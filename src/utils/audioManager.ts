// ======================================================================
// 音频管理模块（iOS Safari 强兼容版）
//
// 【核心设计原则 —— iOS 音频解锁历史上被验证可靠的做法】
// 1. 使用 AudioBufferSourceNode 而不是 OscillatorNode
//    - iOS Safari 对 AudioBufferSourceNode 的解锁更可靠
//    - OscillatorNode 在 resume 之前调度的 start(time) 会被静默丢弃
// 2. 解锁流程必须完全在"用户手势的同步调用栈"内完成
//    - new AudioContext() → resume() → start(buffer) 之间不能有任何 await
// 3. 预创建多个可复用的 AudioBuffer（不同频率和波形），每次播放只需要 start()
// 4. 多次重试：context.state 不是 running → 间隔 100ms 再 resume 最多 3 次
// 5. 暴露 window.__audioDebug 供开发时实时观测状态
// ======================================================================

type SoundKey = 'click' | 'select' | 'submit' | 'anti' | 'smartClick' | 'caw' | 'success' | 'unlockBeep' | 'woodfish';

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // 预生成的 AudioBuffer（可重复播放）
  private buffers: Record<string, AudioBuffer | null> = {};

  private bgmTimer: number | null = null;
  private melodyIndex = 0;
  private muted = false;
  private unlocked = false;
  private unlockAttempts = 0;
  private listeners = new Set<() => void>();
  private persistentHandlers: Array<() => void> = [];

  subscribe(l: () => void): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try { l(); } catch { /* ignore */ }
    });
  }

  get state() {
    return {
      muted: this.muted,
      unlocked: this.unlocked,
      unlockAttempts: this.unlockAttempts,
      state: this.ctx?.state ?? 'null',
      playing: this.bgmTimer !== null && !this.muted,
    };
  }

  // ==================================================================
  // init —— 安装"持久的用户手势监听器"
  // 注意：这里只预创建 context，不播放声音也不设置 unlocked
  // unlocked 只能在用户主动点击音频按钮 / 选答案时设置
  // ==================================================================
  init() {
    // 预创建 AudioContext（在用户第一次点击时才真正初始化）
    // 这里只注册监听器，不触碰音频 API，避免被浏览器限流

    const events = ['pointerdown', 'touchstart', 'click', 'mousedown', 'keydown'];
    events.forEach((ev) => {
      const handler = () => {
        // 用户每次手势都尝试解锁一次（最多 3 次尝试后就停）
        if (!this.unlocked && this.unlockAttempts < 3) {
          this.unlockByUserGesture().catch(() => { /* ignore */ });
        }
        // 【iOS 修复】即已解锁，每次手势也确保 context 处于 running 状态
        // 因为 iOS 切后台/锁屏后 context 可能被自动 suspend
        if (this.unlocked && this.ctx && this.ctx.state !== 'running') {
          try {
            const p = this.ctx.resume();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch { /* ignore */ }
        }
      };
      this.persistentHandlers.push(() =>
        document.removeEventListener(ev, handler, { capture: true } as any));
      document.addEventListener(ev, handler, { capture: true, passive: true } as any);
    });

    // 微信 JSBridge
    if (typeof (window as any).WeixinJSBridge === 'undefined') {
      const wxHandler = () => {
        try {
          (window as any).WeixinJSBridge?.invoke?.('getNetworkType', {}, () => {
            if (!this.unlocked) void this.unlockByUserGesture();
          });
        } catch { /* ignore */ }
      };
      document.addEventListener('WeixinJSBridgeReady', wxHandler as any, { once: true });
    }

    // 页面可见性恢复：从后台切回时尝试 resume + 重启 BGM
    // 【iOS 关键修复】iOS Safari 切后台会暂停 AudioContext 和 setInterval
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (this.ctx && this.ctx.state === 'suspended') {
          const p = this.ctx.resume();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
        // 重启 BGM（如果应该播放但 timer 已死）
        if (this.unlocked && !this.muted && this.bgmTimer === null) {
          setTimeout(() => this.startBGM(), 200);
        }
      }
    });

    // 【iOS 修复】窗口获得焦点时也尝试恢复
    window.addEventListener('focus', () => {
      if (this.unlocked && this.ctx && this.ctx.state !== 'running') {
        try {
          const p = this.ctx.resume();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch { /* ignore */ }
      }
      if (this.unlocked && !this.muted && this.bgmTimer === null) {
        setTimeout(() => this.startBGM(), 100);
      }
    });

    // 【iOS 修复】BGM 健康检查：每 10 秒检查一次 BGM 是否还在播放
    // 如果 timer 死了但应该播放，重启它
    setInterval(() => {
      if (this.unlocked && !this.muted && this.bgmTimer === null && this.ctx?.state === 'running') {
        this.startBGM();
      }
    }, 10000);

    // 暴露调试接口
    if (typeof window !== 'undefined') {
      (window as any).__audioDebug = () => ({
        state: this.state,
        ctxState: this.ctx?.state,
        ctxCurrentTime: this.ctx?.currentTime,
        masterGainValue: this.masterGain?.gain.value,
        sfxGainValue: this.sfxGain?.gain.value,
        bgmGainValue: this.bgmGain?.gain.value,
        bufferCount: Object.keys(this.buffers).length,
        hasAudioAPI: typeof (window as any).AudioContext !== 'undefined' ||
                      typeof (window as any).webkitAudioContext !== 'undefined',
        userAgent: navigator.userAgent,
      });
    }
  }

  // ==================================================================
  // 创建 AudioContext
  // 【关键】必须在"用户手势同步栈"内调用才会被 iOS Safari 信任
  // ==================================================================
  private ensureContext(fromUserGesture: boolean): boolean {
    if (this.ctx) return true;
    if (!fromUserGesture) return false; // 非用户手势不创建 context

    try {
      const AC: typeof AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return false;

      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);

      // 【音量修复】添加 DynamicsCompressorNode，自动限制峰值，避免多 buffer 叠加爆音
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -10;
      this.compressor.knee.value = 10;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.1;
      this.compressor.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.55; // 从 0.7 降到 0.55，与首次解锁音量更接近
      this.sfxGain.connect(this.compressor);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.28; // 从 0.35 降到 0.28，让 BGM 更柔和
      this.bgmGain.connect(this.compressor);

      // 预生成多个可复用的 AudioBuffer（替代 OscillatorNode）
      this.precreateBuffers();
      return true;
    } catch {
      this.ctx = null;
      return false;
    }
  }

  // ==================================================================
  // 预创建 AudioBuffer —— 用程序生成多种音效的 PCM 数据
  // ==================================================================
  private precreateBuffers() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const sampleRate = ctx.sampleRate;

    const createBeep = (freq: number, durationSec: number, volume: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine'): AudioBuffer => {
      const length = Math.max(1, Math.floor(sampleRate * durationSec));
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        // 用 envelope 做 attack/decay，避免点击爆音
        const t = i / length;
        const envelope = t < 0.1 ? t / 0.1 : Math.pow(1 - (t - 0.1) / 0.9, 2);
        let sample: number;
        switch (type) {
          case 'sine':
            sample = Math.sin(2 * Math.PI * freq * i / sampleRate);
            break;
          case 'triangle':
            sample = 2 * Math.abs(2 * ((i * freq / sampleRate) % 1) - 1) - 1;
            break;
          case 'square':
            sample = ((i * freq / sampleRate) % 1) < 0.5 ? 1 : -1;
            break;
          case 'sawtooth':
            sample = 2 * ((i * freq / sampleRate) % 1) - 1;
            break;
        }
        data[i] = sample * volume * envelope;
      }
      return buffer;
    };

    const createArpeggio = (freqs: number[], stepSec: number, volume: number): AudioBuffer => {
      const totalLen = Math.floor(sampleRate * stepSec * freqs.length);
      const buffer = ctx.createBuffer(1, totalLen, sampleRate);
      const data = buffer.getChannelData(0);
      freqs.forEach((f, idx) => {
        const start = Math.floor(idx * stepSec * sampleRate);
        const len = Math.floor(stepSec * sampleRate);
        for (let i = 0; i < len && start + i < totalLen; i++) {
          const t = i / len;
          const envelope = t < 0.2 ? t / 0.2 : Math.pow(1 - (t - 0.2) / 0.8, 1.5);
          data[start + i] = Math.sin(2 * Math.PI * f * i / sampleRate) * volume * envelope;
        }
      });
      return buffer;
    };

    // 缓存多种 buffer
    this.buffers.unlockBeep = createBeep(880, 0.15, 0.4, 'triangle');
    this.buffers.click = createBeep(880, 0.08, 0.3, 'sine');
    this.buffers.select = createArpeggio([784, 988], 0.08, 0.3);
    this.buffers.submit = createArpeggio([523, 659, 784, 1047], 0.09, 0.3);
    this.buffers.success = createArpeggio([523, 659, 784, 1047, 1319], 0.08, 0.3);
    this.buffers.anti = createBeep(200, 0.3, 0.35, 'sawtooth');
    this.buffers.smartClick = createArpeggio([784, 988, 1175, 1568, 2093], 0.04, 0.3);
    this.buffers.caw = createBeep(250, 0.25, 0.35, 'sawtooth');
    // 木鱼音效：低频 triangle 波，模拟真实木鱼声
    this.buffers.woodfish = createBeep(200, 0.12, 0.45, 'triangle');

    // BGM 循环旋律的 buffer（整个 4 拍的简短旋律）
    const melody = [523, 659, 784, 659, 523, 784, 659, 523,
                    784, 880, 784, 659, 784, 880, 784, 659];
    const beat = 450; // ms
    const beatInSamples = Math.floor(sampleRate * beat / 1000);
    const totalLen = beatInSamples * melody.length;
    const bgmBuffer = ctx.createBuffer(1, totalLen, sampleRate);
    const bgmData = bgmBuffer.getChannelData(0);
    melody.forEach((f, idx) => {
      const start = idx * beatInSamples;
      for (let i = 0; i < beatInSamples && start + i < totalLen; i++) {
        const t = i / beatInSamples;
        const envelope = t < 0.1 ? t / 0.1 : Math.pow(1 - (t - 0.1) / 0.9, 2);
        bgmData[start + i] = Math.sin(2 * Math.PI * f * i / sampleRate) * 0.25 * envelope;
      }
    });
    this.buffers.bgm = bgmBuffer;
  }

  // ==================================================================
  // 播放一个 buffer（iOS 最可靠的方式）
  // 【关键】必须在 AudioContext.state === 'running' 后调用
  // ==================================================================
  private playBuffer(buffer: AudioBuffer | null, gain: GainNode | null, volume = 1.0): void {
    if (!this.ctx || !buffer || !gain) return;

    try {
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;

      const g = this.ctx.createGain();
      g.gain.value = volume;
      src.connect(g);
      g.connect(gain);

      // start(0) —— 从当前位置立即播放
      // 【iOS 关键】这是唯一在 AudioContext 各种状态下都能正确工作的 start 调用方式
      src.start(0);
    } catch { /* ignore */ }
  }

  // ==================================================================
  // 用户手势解锁 —— 整个流程必须在"用户手势同步调用栈"内
  // 【策略】
  //   1. 同步创建 AudioContext → 2. 同步 resume → 3. 同步播放 AudioBufferSourceNode
  //   4. 不 await resume（await 会跳出同步栈），但在 Promise 解决后标记 unlocked
  // ==================================================================
  async unlockByUserGesture(deferKey?: SoundKey): Promise<boolean> {
    this.unlockAttempts++;

    // 1. 同步创建 AudioContext（必须在用户手势栈内）
    const ok = this.ensureContext(true);
    if (!ok || !this.ctx || !this.sfxGain) return false;

    // 2. 同步播放解锁音效（AudioBufferSourceNode，iOS 最可靠）
    //    【音量修复】只播 deferKey（不播 unlockBeep），避免多 buffer 叠加爆音
    try {
      if (deferKey && deferKey !== 'unlockBeep') {
        const buffer = this.buffers[deferKey];
        if (buffer) this.playBuffer(buffer, this.sfxGain, 0.4);
      } else if (this.buffers.unlockBeep) {
        // 没有 deferKey 时才播 unlockBeep
        this.playBuffer(this.buffers.unlockBeep, this.sfxGain, 0.4);
      }
    } catch { /* ignore */ }

    // 3. 同步 resume（不能 await，await 会跳出同步栈）
    let resumed = false;
    try {
      const st = this.ctx.state;
      if (st === 'running') {
        resumed = true;
      } else {
        const p = this.ctx.resume();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            // 【音量修复】不再补播 unlockBeep，避免叠加爆音
            this.markUnlocked();
          }).catch(() => { /* ignore */ });
        } else {
          // 旧浏览器 resume 同步完成
          resumed = true;
        }
      }
    } catch { /* ignore */ }

    // 4. 兜底：如果 300ms 后还没 resumed，再试一次
    setTimeout(() => {
      if (!this.unlocked && this.ctx) {
        try {
          const s = this.ctx.state;
          if (s !== 'running') {
            const p2 = this.ctx.resume();
            if (p2 && typeof p2.then === 'function') {
              p2.then(() => this.markUnlocked()).catch(() => { /* ignore */ });
            } else {
              this.markUnlocked();
            }
          } else {
            this.markUnlocked();
          }
        } catch { /* ignore */ }
      }
    }, 300);

    // 立即返回，不阻塞 UI
    return true;
  }

  private markUnlocked() {
    if (this.unlocked) return;
    this.unlocked = true;

    // 卸载持久监听器
    this.persistentHandlers.forEach((removeHandler) => {
      try { removeHandler(); } catch { /* ignore */ }
    });
    this.persistentHandlers = [];

    // 启动 BGM（如无静音）
    if (!this.muted) {
      this.startBGM();
    }
    this.notify();
  }

  // ==================================================================
  // BGM：循环播放预生成的 bgm buffer
  // ==================================================================
  private startBGM() {
    if (!this.ctx || !this.bgmGain) return;
    if (this.bgmTimer !== null) return;
    if (this.muted) return;

    const playBgmBeat = () => {
      if (!this.ctx || this.muted) return;
      try {
        const buffer = this.buffers.bgm;
        if (buffer) {
          this.playBuffer(buffer, this.bgmGain, 0.3);
        }
      } catch { /* ignore */ }
    };

    // 立即播放第一拍
    playBgmBeat();
    // 循环调度：每 7 秒播一次完整的 bgm buffer 片段
    const bgmDuration = (this.buffers.bgm?.length ?? 0) / this.ctx.sampleRate * 1000;
    this.bgmTimer = window.setInterval(playBgmBeat, Math.max(bgmDuration, 4000));
  }

  private stopBGM() {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // ==================================================================
  // 公共 API
  // ==================================================================

  userTapped() {
    // 【关键】在用户手势同步栈内立即尝试解锁
    void this.unlockByUserGesture();
  }

  play(key: SoundKey) {
    if (this.muted) return;

    // 未解锁：在用户手势栈内解锁并同步播放这个 key
    if (!this.unlocked) {
      void this.unlockByUserGesture(key);
      return;
    }

    // 已解锁：确认 context running
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state !== 'running') {
      try {
        const p = this.ctx.resume();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            const buffer = this.buffers[key];
            if (buffer && this.sfxGain) this.playBuffer(buffer, this.sfxGain, 0.55);
          }).catch(() => { /* ignore */ });
        }
      } catch { /* ignore */ }
      return;
    }

    // 正常播放
    const buffer = this.buffers[key];
    if (buffer) this.playBuffer(buffer, this.sfxGain, 0.55);
  }

  toggle(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      }
      if (this.unlocked) this.startBGM();
    }
    this.notify();
    return this.muted;
  }
}

export const audioManager = new AudioManager();
