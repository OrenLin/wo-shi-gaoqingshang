// ======================================================================
// 音频管理模块（v2 · iOS 强兼容版）
//
// iOS 音频解锁核心原则：
// 1. AudioContext 必须在「用户手势同步栈内」创建 + resume
// 2. resume 返回 Promise，必须等待它 resolve 才能播放
// 3. iOS 15+ 同时需要「真实媒体播放」才能解锁，不能只调用空的 resume()
// 4. 解锁后所有音频才能正常调度
//
// 改进：
// - 多事件长期监听（pointerdown / touchstart / click），直到真正解锁
// - 创建时使用「音频缓冲播放 + 振荡器 + HTML5 audio」三重保险
// - 捕获 context.interrupted 状态
// - 防止一次性 { once: true } 监听器失败后静默失效
// ======================================================================

type SoundKey = 'click' | 'select' | 'submit' | 'anti' | 'smartClick' | 'caw' | 'success';

const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.5, F6: 1396.91, G6: 1567.98, A6: 1760.0,
};

const HAPPY_MELODY = [
  'C5', 'E5', 'G5', 'E5', 'C5', 'G5', 'E5', 'C5',
  'G5', 'F5', 'E5', 'D5', 'E5', 'F5', 'G5', 'A5',
  'A5', 'G5', 'F5', 'E5', 'D5', 'E5', 'F5', 'G5',
  'G5', 'E5', 'C5', 'G4', 'E5', 'G5', 'C6', 'G5',
];

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private bgmTimer: number | null = null;
  private melodyIndex = 0;
  private muted = false;
  private unlocked = false;       // 是否已真正解锁（能播放）
  private isIOS = false;          // 是否 iOS/iPadOS
  private listeners = new Set<() => void>();
  private persistentHandlers: Array<() => void> = [];
  private htmlAudio: HTMLAudioElement | null = null;

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
      ready: this.unlocked,
      interacted: this.unlocked,
      playing: this.bgmTimer !== null && !this.muted,
      isIOS: this.isIOS,
    };
  }

  // ==================================================================
  // init —— 安装「持久的用户手势监听器」，直到音频被解锁
  // 注意：不使用 { once: true }，因为首次事件可能发生在 context 可用之前
  // ==================================================================
  init() {
    this.isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      /^((?!android).)*$/.test(navigator.userAgent) && 'ontouchend' in document;

    // ---- 持久解锁 handler（在 audio 解锁前持续存在）----
    const tryUnlock = () => {
      this.unlockByUserGesture().catch(() => { /* ignore */ });
    };

    // ---- 在多个事件类型上注册（兼容移动端 + 桌面端）----
    const events = ['pointerdown', 'touchstart', 'click', 'mousedown', 'keydown'];
    events.forEach((ev) => {
      const handler = () => tryUnlock();
      this.persistentHandlers.push(() =>
        document.removeEventListener(ev, handler, { capture: true } as any));
      document.addEventListener(ev, handler, { capture: true, passive: true } as any);
    });

    // ---- 微信 JSBridge（国内 iOS 微信）----
    if (typeof (window as any).WeixinJSBridge === 'undefined') {
      const wxHandler = () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        try { (window as any).WeixinJSBridge?.invoke?.('getNetworkType', {}, () => {
          tryUnlock();
        }); } catch { /* ignore */ }
      };
      document.addEventListener('WeixinJSBridgeReady', wxHandler as any, { once: true });
    }

    // ---- 页面可见性恢复（从后台切回来时尝试恢复）----
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.onPageVisible();
      }
    });

    // ---- 全局兜底：页面加载后尝试一次（某些浏览器在 load 后允许音频）----
    if (document.readyState === 'complete') {
      // 非用户手势：只能创建，不一定能解锁
      this.ensureContext(false);
    } else {
      window.addEventListener('load', () => this.ensureContext(false), { once: true });
    }
  }

  // ==================================================================
  // 确保 AudioContext 已创建（可选是否在用户手势内）
  // ==================================================================
  private ensureContext(fromUserGesture: boolean): boolean {
    if (!this.ctx) {
      try {
        const AC: typeof AudioContext =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AC) return false;

        // 某些 iOS 版本要求在构造时就传入 sampleRate
        const opts: AudioContextOptions = {};
        try {
          // 获取默认采样率 —— 避免与设备输出不一致导致锁死
          const probeCtx = new AC();
          if (probeCtx && probeCtx.sampleRate) {
            opts.sampleRate = probeCtx.sampleRate;
          }
          try { probeCtx.close(); } catch { /* ignore */ }
        } catch { /* ignore */ }

        this.ctx = new AC(opts);
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.7;
        this.sfxGain.connect(this.masterGain);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.35;
        this.bgmGain.connect(this.masterGain);
      } catch {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.bgmGain = null;
        return false;
      }
    }

    // 恢复 context 状态（必须在用户手势内调用才能成功）
    if (fromUserGesture && this.ctx) {
      try {
        const st = this.ctx.state as string;
        if (st === 'suspended' || st === 'interrupted') {
          // 不等待 Promise —— iOS 要求同步栈内调用
          const p = this.ctx.resume();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
      } catch { /* ignore */ }
    }
    return true;
  }

  // ==================================================================
  // 用户手势解锁 —— 同步播放声音并启动背景旋律
  // 【iOS 关键】必须在「用户手势的同步调用栈」内完成：创建 context → resume → 实际播放音频
  // 传 deferKey 时：解锁后立刻在同步路径里把这 sound 也播掉，避免时间戳过期
  // ==================================================================
  async unlockByUserGesture(deferKey?: SoundKey): Promise<boolean> {
    // 1. 确保有 AudioContext（在用户手势内创建）
    const ok = this.ensureContext(true);
    if (!ok || !this.ctx || !this.sfxGain) {
      return false;
    }

    // 2. 三重保险：
    //    a. 同步播放短音频 buffer（最可靠）
    //    b. 播放音符（OSC 节点）
    //    c. 触发一个隐藏 HTML5 audio 播放（某些 iOS 版本需要）
    try {
      const t = this.ctx.currentTime;
      this.playShortBeep(t);
      this.playNote(NOTES.C6, t + 0.02, 0.12, 'triangle', 0.4, this.sfxGain);
      this.playNote(NOTES.E6, t + 0.12, 0.12, 'triangle', 0.35, this.sfxGain);
      this.playNote(NOTES.G6, t + 0.22, 0.18, 'triangle', 0.3, this.sfxGain);

      // 【iOS 即时播放】如果调用方传入了 deferKey，立刻在同步栈里把它也播掉
      if (deferKey && deferKey !== 'click') {
        this.playSfxAt(deferKey, t + 0.25);
      }

      // HTML5 audio 解锁（有些 iOS 版本需要）
      this.playSilentHTMLAudio();
    } catch { /* ignore */ }

    // 3. 等一小段时间后确认 state === 'running'
    await new Promise((r) => setTimeout(r, 60));
    try {
      if (this.ctx && (this.ctx.state as string) !== 'running') {
        const p = this.ctx.resume();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    } catch { /* ignore */ }

    // 4. 标记已解锁，启动 BGM（如无静音）
    if (!this.unlocked) {
      this.unlocked = true;

      // 解锁后移除持久监听器，节省 CPU
      this.persistentHandlers.forEach((removeHandler) => {
        try { removeHandler(); } catch { /* ignore */ }
      });
      this.persistentHandlers = [];

      if (!this.muted) {
        this.startBGM();
      }
      this.notify();
    }

    return true;
  }

  // 在指定时间点播放某个音效（给 unlockByUserGesture 用，避免重复写 case 逻辑）
  private playSfxAt(key: SoundKey, t: number) {
    if (!this.ctx || !this.sfxGain) return;
    switch (key) {
      case 'click':
        this.playNote(880, t, 0.06, 'sine', 0.25, this.sfxGain);
        break;
      case 'select':
        this.playNote(784, t, 0.08, 'triangle', 0.3, this.sfxGain);
        this.playNote(1175, t + 0.05, 0.1, 'triangle', 0.25, this.sfxGain);
        break;
      case 'submit':
        [523, 659, 784, 1047].forEach((f, i) => {
          this.playNote(f, t + i * 0.08, 0.2, 'triangle', 0.28, this.sfxGain);
        });
        break;
      case 'success':
        [523, 659, 784, 1047, 1319].forEach((f, i) => {
          this.playNote(f, t + i * 0.1, 0.25, 'triangle', 0.28, this.sfxGain);
        });
        break;
      case 'anti':
        this.playNote(200, t, 0.15, 'sawtooth', 0.35, this.sfxGain);
        [523, 784, 1047, 1319, 1568].forEach((f, i) => {
          this.playNote(f, t + 0.2 + i * 0.07, 0.2, 'square', 0.25, this.sfxGain);
        });
        this.playNote(1568, t + 0.6, 0.4, 'triangle', 0.2, this.sfxGain);
        break;
      case 'smartClick':
        [784, 988, 1175, 1568].forEach((f, i) => {
          this.playNote(f, t + i * 0.05, 0.15, 'triangle', 0.32, this.sfxGain);
        });
        this.playNote(2093, t + 0.1, 0.12, 'sine', 0.22, this.sfxGain);
        break;
      case 'caw':
        this.playNote(320, t, 0.18, 'sawtooth', 0.32, this.sfxGain);
        this.playNote(260, t + 0.18, 0.2, 'sawtooth', 0.3, this.sfxGain);
        this.playNote(200, t + 0.38, 0.25, 'sawtooth', 0.28, this.sfxGain);
        this.playNote(600, t + 0.08, 0.1, 'square', 0.15, this.sfxGain);
        this.playNote(450, t + 0.25, 0.1, 'square', 0.13, this.sfxGain);
        break;
    }
  }

  // ==================================================================
  // 播放一个非常短的「合成音频 Buffer」，最符合 iOS 媒体解锁条件
  // ==================================================================
  private playShortBeep(t: number) {
    if (!this.ctx || !this.sfxGain) return;
    try {
      const buffer = this.ctx.createBuffer(1, 441, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      // 880Hz 短促 sine beep（10ms）
      for (let i = 0; i < data.length; i++) {
        const alpha = i / data.length;
        data[i] = 0.15 * Math.sin(2 * Math.PI * 880 * i / this.ctx.sampleRate)
                  * (1 - alpha);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(this.sfxGain);
      src.start(t);
    } catch { /* ignore */ }
  }

  // ==================================================================
  // HTML5 audio 解锁（某些 iOS 15+ 版本要求真的有媒体元素）
  // ==================================================================
  private playSilentHTMLAudio() {
    try {
      if (!this.htmlAudio) {
        // 创建一个几乎无声的 mp3 base64 data URI（10ms silence）
        // 这是最短的合法单声道 8KHz mp3 静默
        const silentMp3 = 'data:audio/mpeg;base64,'
          + '//uQxAAAAAANIwAAAEAAQAA';
        this.htmlAudio = new Audio(silentMp3);
        (this.htmlAudio as any).playsInline = true;
        this.htmlAudio.setAttribute('playsinline', '');
        this.htmlAudio.preload = 'auto';
        this.htmlAudio.volume = 0.01;
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      const p = this.htmlAudio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch { /* ignore */ }
  }

  // ==================================================================
  // 音符播放（OSC 节点）
  // ==================================================================
  private playNote(
    freq: number,
    start: number,
    duration: number,
    type: OscillatorType,
    peak: number,
    dest: GainNode,
  ) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;

      // 明确的包络（attack + decay），避免爆音
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(peak, start + 0.005);
      g.gain.setValueAtTime(peak, start + Math.max(0.01, duration - 0.01));
      g.gain.linearRampToValueAtTime(0, start + duration);

      osc.connect(g);
      g.connect(dest);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    } catch { /* ignore */ }
  }

  private playKick(t: number) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(g);
      g.connect(this.bgmGain);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch { /* ignore */ }
  }

  private playHiHat(t: number) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 8000;
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(g);
      g.connect(this.bgmGain);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch { /* ignore */ }
  }

  // ==================================================================
  // BGM 调度器：以 0.5s 节拍循环播放旋律
  // ==================================================================
  private startBGM() {
    if (!this.ctx || !this.bgmGain) return;
    if (this.bgmTimer !== null) return;

    const beat = 450; // ms
    this.melodyIndex = 0;

    const scheduleBeat = () => {
      if (!this.ctx || this.muted) return;
      try {
        const t = this.ctx.currentTime;
        const note = HAPPY_MELODY[this.melodyIndex % HAPPY_MELODY.length];
        const freq = NOTES[note];
        if (freq) {
          this.playNote(freq, t + 0.01, beat / 1000 * 0.9, 'triangle', 0.3, this.bgmGain);
        }
        const beatInBar = this.melodyIndex % 8;
        if (beatInBar === 0 || beatInBar === 4) {
          this.playKick(t);
        }
        this.playHiHat(t);
        this.playHiHat(t + beat / 2000);
        this.melodyIndex++;
      } catch { /* ignore */ }
    };

    // 立即播放第一个音符
    scheduleBeat();
    this.bgmTimer = window.setInterval(scheduleBeat, beat);
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
    // 同步栈内立即尝试解锁
    void this.unlockByUserGesture();
  }

  play(key: SoundKey) {
    if (this.muted) return;

    // 【iOS 关键】如果还未解锁 → 在解锁的同步调用栈里把这个 sound 也播掉
    if (!this.unlocked) {
      void this.unlockByUserGesture(key);
      return;
    }

    // 已解锁 → 确保 context is running（从后台切回等场景）
    if (this.ctx && (this.ctx.state as string) !== 'running') {
      try {
        const p = this.ctx.resume();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch { /* ignore */ }
    }
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = Math.max(this.ctx.currentTime, 0.01);
      this.playSfxAt(key, t);
    } catch { /* ignore */ }
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

  onPageVisible() {
    if (!this.unlocked || this.muted || this.bgmTimer !== null) return;
    if (this.ctx) {
      try {
        const st = this.ctx.state as string;
        if (st === 'suspended' || st === 'interrupted') {
          const p = this.ctx.resume();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
      } catch { /* ignore */ }
    }
    this.startBGM();
  }
}

export const audioManager = new AudioManager();
