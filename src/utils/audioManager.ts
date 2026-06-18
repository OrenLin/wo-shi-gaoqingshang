// ======================================================================
// 音频管理模块（iOS + 微信双保险方案，2026 最新）
//
// 核心架构：
//   - 基础层：AudioContext（Web Audio API）用于实时合成短音效
//   - 背景层：HTML5 <audio> + Web Audio 合成 BGM（循环播放）
//   - 触发层：真实用户手势（touchstart / click）+ 微信 JSBridge 双重触发
//   - 状态层：isUserInteracted + isPlaying + UI 可见按钮
//   - 兜底层：错误处理 + 静默恢复 + 显示"点击开启声音"按钮
//
// iOS / 微信铁律：
//   1. 非静音音频必须由真实用户点击/触摸触发
//   2. JS 模拟点击、定时器、onload 全被拦截
//   3. 微信 iOS 还需要 WeixinJSBridgeReady 事件
//   4. 用户手势解锁后权限仅在当前页面有效，切后台需重新触发
// ======================================================================

type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

// ====== 音乐常量 ======
const NOTES: Record<string, number> = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.0, 'A4': 440.0, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
  'G5': 783.99, 'A5': 880.0, 'B5': 987.77,
  'C6': 1046.5,
  'C3': 130.81, 'E3': 164.81, 'G3': 196.0, 'A3': 220.0,
  'F3': 174.61, 'D3': 146.83,
};

const CHORD_TONES: Record<string, number[]> = {
  'C':  [NOTES['C5'], NOTES['E5'], NOTES['G5']],
  'Am': [NOTES['A4'], NOTES['C5'], NOTES['E5']],
  'F':  [NOTES['F4'], NOTES['A4'], NOTES['C5']],
  'G':  [NOTES['G4'], NOTES['B4'], NOTES['D5']],
};

const MELODY: (string | null)[] = [
  'C5', 'E5', 'G5', 'E5', 'C5', 'G5', 'E5', 'C5',
  'A4', 'C5', 'E5', 'C5', 'A4', 'E5', 'C5', 'A4',
  'F4', 'A4', 'C5', 'A4', 'F4', 'C5', 'A4', 'F4',
  'G4', 'B4', 'D5', 'B4', 'G4', 'D5', 'B4', 'G4',
];

const MELODY2: (string | null)[] = [
  'E5', 'G5', 'C6', 'G5', 'E5', 'C6', 'G5', 'E5',
  'C5', 'E5', 'A5', 'E5', 'C5', 'A5', 'E5', 'C5',
  'F4', 'C5', 'F5', 'C5', 'F4', 'F5', 'C5', 'A4',
  'G4', 'D5', 'G5', 'D5', 'G4', 'B4', 'G5', 'D5',
];

const BASS: string[] = [
  'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3',
  'A3', 'A3', 'A3', 'A3', 'A3', 'A3', 'A3', 'A3',
  'F3', 'F3', 'F3', 'F3', 'F3', 'F3', 'F3', 'F3',
  'G3', 'G3', 'G3', 'G3', 'G3', 'G3', 'G3', 'G3',
];

const CHORD_PROGRESSION: string[] = ['C', 'C', 'Am', 'Am', 'F', 'F', 'G', 'G'];

// ==================== 事件类型定义 ====================
type AudioListener = () => void;

class AudioManager {
  // ========== 状态 ==========
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private bgmRafId: number | null = null;
  private bgmNextScheduleAt = 0;
  private bgmPlaying = false;        // BGM 当前是否在调度
  private bgmEnabled = true;          // 用户是否想要播放（用于恢复）

  private muted = false;
  private isUserInteracted = false;   // 用户是否已发生过手势
  private audioReady = false;         // 音频是否已经成功初始化

  private beatDuration = 0.28;
  private bgmVariation = 0;

  // 状态变化通知（React UI 订阅）
  private listeners: Set<AudioListener> = new Set();
  // 一次性触发解锁（绑定后自动解绑）
  private boundUnlock: (() => void) | null = null;

  // ========== 工具：通知 UI 更新 ==========
  private notify(): void {
    this.listeners.forEach((l) => {
      try { l(); } catch (_) {}
    });
  }

  subscribe(l: AudioListener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  // ========== 核心：创建 AudioContext（必须在用户手势同步栈内调用） ==========
  private ensureAudioContext(): boolean {
    if (this.ctx) {
      // 已存在：尝试 resume
      const st = this.ctx.state as string;
      if (st === 'suspended' || st === 'interrupted') {
        try { this.ctx.resume(); } catch (_) {}
      }
      return true;
    }

    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) {
      console.warn('[audio] AudioContext 不支持');
      return false;
    }

    try {
      this.ctx = new Ctor({ latencyHint: 'interactive' });
    } catch (e) {
      console.warn('[audio] 创建 AudioContext 失败:', e);
      this.ctx = null;
      return false;
    }

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;
    this.masterGain.connect(this.ctx.destination);

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.35;
    this.bgmGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.6;
    this.sfxGain.connect(this.masterGain);

    return true;
  }

  // ========== 解锁：在用户手势同步栈内，播放一个可听到的解锁音 ==========
  unlockByUserGesture(): boolean {
    this.isUserInteracted = true;

    if (!this.ensureAudioContext()) {
      this.notify();
      return false;
    }

    // 关键：立刻播一个可听到的解锁音（iOS 需要感知到真实声音才解锁）
    if (this.ctx) {
      try {
        const t0 = this.ctx.currentTime;
        // C6 100ms + E6 100ms —— 可听到的"叮咚"双音
        this.playRawNote(NOTES['C6'], t0, 0.1, 'triangle', 0.4, this.sfxGain!);
        this.playRawNote(NOTES['E6'], t0 + 0.1, 0.1, 'triangle', 0.35, this.sfxGain!);
        // 如果用户要 BGM，解锁成功后启动 BGM
        if (this.bgmEnabled && !this.muted) {
          this.startBGMSchedule();
        }
        this.audioReady = true;
        this.notify();
        return true;
      } catch (e) {
        console.warn('[audio] 解锁音播放失败:', e);
      }
    }
    this.notify();
    return false;
  }

  // ========== 微信 JSBridge 解锁（iOS 微信专用，辅助方案） ==========
  tryWechatJSBridgeUnlock(): void {
    const ua = navigator.userAgent.toLowerCase();
    const isWeixin = ua.indexOf('micromessenger') >= 0;
    if (!isWeixin) return;

    const tryPlay = () => {
      if (this.audioReady || this.isUserInteracted) return;
      const W = window as any;
      if (W.WeixinJSBridge) {
        try {
          W.WeixinJSBridge.invoke('getNetworkType', {}, () => {
            this.unlockByUserGesture();
          }, false);
        } catch (_) {}
      }
    };

    try {
      if ((window as any).WeixinJSBridge) {
        tryPlay();
      } else {
        document.addEventListener('WeixinJSBridgeReady', tryPlay, { once: true } as any);
      }
    } catch (_) {}
  }

  // ========== 安装全局手势监听（整个页面首次 touchstart / click 触发） ==========
  installGlobalGestureListeners(): void {
    if (this.boundUnlock) return; // 已安装
    this.boundUnlock = () => {
      this.unlockByUserGesture();
    };
    // { passive: true } 避免性能警告；不阻止冒泡
    document.addEventListener('touchstart', this.boundUnlock, { passive: true, once: true } as any);
    document.addEventListener('click', this.boundUnlock, { once: true });
  }

  // ========== Web Audio 音符调度 ==========
  private playRawNote(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    peakGain: number,
    outNode: GainNode,
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
    g.gain.setValueAtTime(peakGain, startTime + Math.max(0.01, duration * 0.65));
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(g);
    g.connect(outNode);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  private scheduleKick(t: number): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g);
    g.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  private scheduleSnare(t: number): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 220 + Math.random() * 30;
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g);
    g.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.15);

    const h = this.ctx.createOscillator();
    const hg = this.ctx.createGain();
    h.type = 'square';
    h.frequency.value = 5000 + Math.random() * 600;
    hg.gain.setValueAtTime(0.05, t);
    hg.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    h.connect(hg);
    hg.connect(this.bgmGain);
    h.start(t);
    h.stop(t + 0.08);
  }

  private scheduleHiHat(t: number, strong = false): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 7200 + Math.random() * 800;
    const peak = strong ? 0.06 : 0.03;
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    osc.connect(g);
    g.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // ========== BGM 小节调度 ==========
  private scheduleBar(startTime: number, barIndex: number): number {
    if (!this.ctx || !this.bgmGain) return startTime;
    const beat = this.beatDuration;
    const melody = (this.bgmVariation % 2 === 0) ? MELODY : MELODY2;
    const chordKey = CHORD_PROGRESSION[barIndex % CHORD_PROGRESSION.length];
    const chordTones = CHORD_TONES[chordKey];

    for (let i = 0; i < 8; i++) {
      const t = startTime + i * beat;
      const note = melody[(barIndex * 8 + i) % melody.length];
      if (note) {
        const f = NOTES[note];
        if (f) this.playRawNote(f, t, beat * 0.8, 'triangle', 0.14, this.bgmGain);
      }
      if (i % 2 === 0 && chordTones) {
        chordTones.forEach((cf, ci) => {
          this.playRawNote(cf / 2, t, beat * 1.3, 'sine', 0.035 - ci * 0.003, this.bgmGain);
        });
      }
      const bassNote = BASS[(barIndex * 8 + i) % BASS.length];
      const bf = NOTES[bassNote];
      if (bf) this.playRawNote(bf, t, beat * 0.7, 'sine', i % 2 === 0 ? 0.12 : 0.08, this.bgmGain);

      if (i === 0 || i === 4) this.scheduleKick(t);
      if (i === 2 || i === 6) this.scheduleSnare(t);
      this.scheduleHiHat(t, i % 4 === 0);
      this.scheduleHiHat(t + beat * 0.5, false);
    }
    return startTime + 8 * beat;
  }

  private bgmTick = (): void => {
    if (!this.bgmPlaying || !this.ctx) return;
    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch (_) {}
    }
    const horizon = this.ctx.currentTime + 1.0;
    let barIndex = Math.floor(this.bgmNextScheduleAt / (8 * this.beatDuration));
    while (this.bgmNextScheduleAt < horizon) {
      this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt, barIndex);
      barIndex++;
      if (barIndex % 4 === 0) this.bgmVariation = 1 - this.bgmVariation;
    }
    this.bgmRafId = requestAnimationFrame(this.bgmTick);
  };

  private startBGMSchedule(): void {
    if (!this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.bgmNextScheduleAt = this.ctx.currentTime + 0.05;
    this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt, 0);
    this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt, 1);
    if (this.bgmRafId == null) {
      this.bgmRafId = requestAnimationFrame(this.bgmTick);
    }
  }

  // ==================== 公共 API ====================

  /** 页面首次挂载调用：安装全局手势监听 + 尝试微信 JSBridge */
  init(): void {
    this.installGlobalGestureListeners();
    // 微信 JSBridge 辅助解锁（只在微信环境生效）
    this.tryWechatJSBridgeUnlock();
  }

  /** 用户点击按钮时手动调用 —— 确保在手势同步栈内 */
  userTapped(): void {
    this.unlockByUserGesture();
  }

  play(key: SoundKey): void {
    // 如果尚未解锁：尝试用当前调用链作为用户手势（如果确实来自手势）
    if (!this.audioReady || !this.ctx) {
      this.unlockByUserGesture();
    }
    if (!this.ctx || this.muted || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    switch (key) {
      case 'click':
        this.playRawNote(1046, t, 0.05, 'sine', 0.2, this.sfxGain);
        break;
      case 'select':
        this.playRawNote(784, t, 0.06, 'triangle', 0.22, this.sfxGain);
        this.playRawNote(1175, t + 0.05, 0.08, 'triangle', 0.18, this.sfxGain);
        break;
      case 'submit':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this.playRawNote(f, t + i * 0.07, 0.18, 'triangle', 0.22, this.sfxGain);
        });
        {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(160, t + 0.3);
          osc.frequency.exponentialRampToValueAtTime(50, t + 0.45);
          g.gain.setValueAtTime(0.35, t + 0.3);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
          osc.connect(g);
          g.connect(this.sfxGain);
          osc.start(t + 0.3);
          osc.stop(t + 0.6);
        }
        break;
      case 'success':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
          this.playRawNote(f, t + i * 0.09, 0.22, 'triangle', 0.22, this.sfxGain);
        });
        break;
      case 'anti':
        {
          const osc1 = this.ctx.createOscillator();
          const g1 = this.ctx.createGain();
          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(300, t);
          osc1.frequency.exponentialRampToValueAtTime(100, t + 0.18);
          g1.gain.setValueAtTime(0.3, t);
          g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
          osc1.connect(g1);
          g1.connect(this.sfxGain);
          osc1.start(t);
          osc1.stop(t + 0.22);

          [523, 784, 1047, 1318, 1568, 1760].forEach((f, i) => {
            this.playRawNote(f, t + 0.2 + i * 0.06, 0.18, 'square', 0.18, this.sfxGain);
          });
          this.playRawNote(1200, t + 0.6, 0.4, 'square', 0.18, this.sfxGain);
          this.playRawNote(1568, t + 0.75, 0.35, 'triangle', 0.15, this.sfxGain);
          this.playRawNote(2093, t + 0.9, 0.25, 'sine', 0.12, this.sfxGain);
        }
        break;
    }
  }

  toggle(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      // 静音：停 BGM，快速淡出
      if (this.bgmRafId != null) {
        cancelAnimationFrame(this.bgmRafId);
        this.bgmRafId = null;
      }
      if (this.ctx && this.masterGain) {
        try {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        } catch (_) {}
      }
      this.bgmPlaying = false;
      this.bgmEnabled = false;
    } else {
      // 取消静音：恢复
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      }
      this.bgmEnabled = true;
      // 需要重新触发用户手势来启动 BGM
      this.unlockByUserGesture();
    }
    this.notify();
    return this.muted;
  }

  /** 页面切后台回来：尝试恢复 BGM（需用户已交互） */
  onPageVisible(): void {
    if (this.isUserInteracted && this.bgmEnabled && !this.muted && !this.bgmPlaying) {
      if (this.ensureAudioContext()) {
        this.startBGMSchedule();
      }
    }
  }

  /** 供 React 查询状态 */
  get state(): { muted: boolean; ready: boolean; interacted: boolean; playing: boolean } {
    return {
      muted: this.muted,
      ready: this.audioReady,
      interacted: this.isUserInteracted,
      playing: this.bgmPlaying,
    };
  }
}

// —— 单例导出 ——
export const audioManager = new AudioManager();
