// ======================================================================
// 音频管理模块（iOS/微信兼容版）
//
// iOS 解锁核心要点：
//   1. AudioContext 必须在用户手势同步栈内创建
//   2. 创建后必须立即调用 ctx.resume() （iOS 创建默认是 suspended 状态）
//   3. 必须在同步栈内播放可听到的声音才能真正解锁
//   4. 解锁后 BGM 才能正常调度
// ======================================================================

type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.5, F6: 1396.91, G6: 1567.98, A6: 1760.0,
};

// 欢快简单的旋律（C大调，跳跃感）
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

  private bgmRafId: number | null = null;
  private bgmNextTime = 0;
  private bgmPlaying = false;
  private muted = false;
  private unlocked = false;
  private isIOS = false;

  private beatDur = 0.5;
  private melodyIndex = 0;

  private listeners: Set<() => void> = new Set();
  subscribe(l: () => void): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  private notify() { this.listeners.forEach(l => { try { l(); } catch {} }); }

  // ========== 创建并立即 resume AudioContext（iOS 关键！） ==========
  private createCtx(): boolean {
    if (this.ctx) {
      const st = this.ctx.state as string;
      if (st === 'suspended' || st === 'interrupted') {
        try { this.ctx.resume(); } catch {}
      }
      return true;
    }

    const AC: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return false;

    this.isIOS = /iPhone|iPad|iPod|iOS/i.test(navigator.userAgent) ||
      (typeof (navigator as any).platform === 'string' && /iPad|iPhone|iPod/.test((navigator as any).platform)) ||
      'ontouchend' in document;

    try {
      const ACtor = (window as any).webkitAudioContext || AC;
      this.ctx = new ACtor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.6;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);

      const st = this.ctx.state as string;
      if (st === 'suspended' || st === 'interrupted') {
        try { this.ctx.resume(); } catch {}
      }

      return true;
    } catch {
      return false;
    }
  }

  // ========== 同步播放单个音符（用于解锁和音效） ==========
  private playNote(freq: number, start: number, dur: number, type: OscillatorType, peak: number, dest: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    // iOS 友好的包络：避免从 0 开始的 ramp
    g.gain.setValueAtTime(peak, start);
    g.gain.setValueAtTime(peak, start + Math.max(0.01, dur * 0.5));
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(g);
    g.connect(dest);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  private playKick(t: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g);
    g.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  private playHiHat(t: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 8000;
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(g);
    g.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  private scheduleBeat(t: number) {
    if (!this.ctx || !this.bgmGain) return;

    const note = HAPPY_MELODY[this.melodyIndex % HAPPY_MELODY.length];
    const freq = NOTES[note];
    if (freq) {
      this.playNote(freq, t, this.beatDur * 0.9, 'triangle', 0.35, this.bgmGain);
    }
    this.melodyIndex++;

    const beatInBar = this.melodyIndex % 8;
    if (beatInBar === 0 || beatInBar === 4) {
      this.playKick(t);
    }
    this.playHiHat(t);
    this.playHiHat(t + this.beatDur * 0.5);
  }

  private bgmLoop = () => {
    if (!this.bgmPlaying || !this.ctx) return;

    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch {}
    }

    const now = this.ctx.currentTime;
    while (this.bgmNextTime < now + 2) {
      this.scheduleBeat(this.bgmNextTime);
      this.bgmNextTime += this.beatDur;
    }

    this.bgmRafId = requestAnimationFrame(this.bgmLoop);
  };

  private startBGM() {
    if (!this.ctx) return;
    if (this.bgmPlaying) return;

    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch {}
    }

    this.bgmPlaying = true;
    this.bgmNextTime = this.ctx.currentTime + 0.05;
    this.melodyIndex = 0;

    for (let i = 0; i < 4; i++) {
      this.scheduleBeat(this.bgmNextTime);
      this.bgmNextTime += this.beatDur;
    }

    this.bgmRafId = requestAnimationFrame(this.bgmLoop);
  }

  private stopBGM() {
    if (this.bgmRafId) {
      cancelAnimationFrame(this.bgmRafId);
      this.bgmRafId = null;
    }
    this.bgmPlaying = false;
  }

  // ========== 公共 API ==========

  init() {
    const unlock = () => this.unlockByUserGesture();
    // iOS：touchstart 是最可靠的手势事件
    document.addEventListener('touchstart', unlock, { passive: true, once: true });
    document.addEventListener('click', unlock, { once: true });

    // 微信浏览器：等待 WeixinJSBridgeReady 后再尝试一次
    if (typeof (window as any).WeixinJSBridge === 'undefined') {
      const wxHandler = () => { this.unlockByUserGesture(); };
      document.addEventListener('WeixinJSBridgeReady', wxHandler as any, { once: true });
    }
  }

  /** 用户手势解锁 —— iOS 关键！必须在同步栈内创建 + resume + 播放声音 */
  unlockByUserGesture(): boolean {
    if (!this.createCtx()) return false;
    if (!this.ctx) return false;

    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch {}
    }

    const t = this.ctx.currentTime;
    this.playNote(NOTES.C6, t, 0.15, 'triangle', 0.5, this.sfxGain!);
    this.playNote(NOTES.E6, t + 0.08, 0.15, 'triangle', 0.45, this.sfxGain!);
    this.playNote(NOTES.G6, t + 0.16, 0.2, 'triangle', 0.4, this.sfxGain!);

    if (!this.unlocked) {
      this.unlocked = true;
      if (!this.muted) {
        this.startBGM();
      }
      this.notify();
    }
    return true;
  }

  userTapped() {
    this.unlockByUserGesture();
  }

  play(key: SoundKey) {
    if (!this.unlocked) this.unlockByUserGesture();
    if (!this.ctx || this.muted || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    switch (key) {
      case 'click':
        this.playNote(880, t, 0.08, 'sine', 0.25, this.sfxGain);
        break;
      case 'select':
        this.playNote(784, t, 0.1, 'triangle', 0.3, this.sfxGain);
        this.playNote(1175, t + 0.06, 0.12, 'triangle', 0.25, this.sfxGain);
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
    }
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
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
      }
      if (this.unlocked) this.startBGM();
    }
    this.notify();
    return this.muted;
  }

  onPageVisible() {
    if (this.unlocked && !this.muted && !this.bgmPlaying && this.ctx) {
      this.startBGM();
    }
  }

  get state() {
    return {
      muted: this.muted,
      ready: this.unlocked,
      interacted: this.unlocked,
      playing: this.bgmPlaying,
      isIOS: this.isIOS,
    };
  }
}

export const audioManager = new AudioManager();
