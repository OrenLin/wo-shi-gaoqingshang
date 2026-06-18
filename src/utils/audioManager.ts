// ======================================================================
// 音频管理模块（简化版 —— 轻松欢快的 BGM）
//
// iOS 解锁核心：
//   1. 必须在用户手势同步栈内创建 AudioContext
//   2. 必须播放可听到的声音才能解锁
//   3. 解锁后 BGM 自动启动
// ======================================================================

type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

// ===== 简化的音乐常量 =====
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.5, F6: 1396.91, G6: 1567.98, A6: 1760.0,
};

// ===== 欢快简单的旋律（C大调，跳跃感） =====
// 每拍一个音，8拍 = 1小节，循环4小节
const HAPPY_MELODY = [
  // 小节1: C-E-G-E (上行跳跃)
  'C5', 'E5', 'G5', 'E5', 'C5', 'G5', 'E5', 'C5',
  // 小节2: G-F-E-D (下行)
  'G5', 'F5', 'E5', 'D5', 'E5', 'F5', 'G5', 'A5',
  // 小节3: A-G-F-E (波浪)
  'A5', 'G5', 'F5', 'E5', 'D5', 'E5', 'F5', 'G5',
  // 小节4: G-E-C- (回到起点)
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

  // BPM 120 = 每拍 0.5秒，欢快节奏
  private beatDur = 0.5;
  private melodyIndex = 0;

  // ===== 状态订阅 =====
  private listeners: Set<() => void> = new Set();
  subscribe(l: () => void): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  private notify() { this.listeners.forEach(l => { try { l(); } catch {} }); }

  // ===== 创建 AudioContext =====
  private createCtx(): boolean {
    if (this.ctx) return true;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return false;
    try {
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);

      // BGM 通道：音量 0.6（足够响）
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.6;
      this.bgmGain.connect(this.masterGain);

      // 音效通道：音量 0.8
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);
      return true;
    } catch { return false; }
  }

  // ===== 播放单个音符 =====
  private playNote(freq: number, start: number, dur: number, type: OscillatorType, peak: number, dest: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    // 快速起音，平滑衰减
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.02);
    g.gain.setValueAtTime(peak, start + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(g);
    g.connect(dest);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  }

  // ===== 简单 Kick =====
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

  // ===== 简单 Hi-Hat =====
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

  // ===== BGM 循环：每拍调度 =====
  private scheduleBeat(t: number) {
    if (!this.ctx || !this.bgmGain) return;

    // 主旋律音符
    const note = HAPPY_MELODY[this.melodyIndex % HAPPY_MELODY.length];
    const freq = NOTES[note as keyof typeof NOTES];
    if (freq) {
      // 使用明亮的高音，轻松欢快
      this.playNote(freq, t, this.beatDur * 0.9, 'triangle', 0.35, this.bgmGain);
    }
    this.melodyIndex++;

    // 鼓点：第1、3拍 kick，每拍 hi-hat
    const beatInBar = this.melodyIndex % 8;
    if (beatInBar === 0 || beatInBar === 4) {
      this.playKick(t);
    }
    this.playHiHat(t);
    // 反拍 hi-hat
    this.playHiHat(t + this.beatDur * 0.5);
  }

  // ===== BGM 主循环 =====
  private bgmLoop = () => {
    if (!this.bgmPlaying || !this.ctx) return;

    // 检查状态
    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch {}
    }

    // 预排未来 2 秒的音符
    const now = this.ctx.currentTime;
    while (this.bgmNextTime < now + 2) {
      this.scheduleBeat(this.bgmNextTime);
      this.bgmNextTime += this.beatDur;
    }

    this.bgmRafId = requestAnimationFrame(this.bgmLoop);
  };

  private startBGM() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.bgmNextTime = this.ctx.currentTime + 0.05;
    this.melodyIndex = 0;
    // 预排前 4 拍
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

  // ===== 公共 API =====

  /** 初始化：安装全局手势监听 */
  init() {
    const unlock = () => this.unlockByUserGesture();
    document.addEventListener('touchstart', unlock, { passive: true, once: true } as any);
    document.addEventListener('click', unlock, { once: true });
  }

  /** 用户手势解锁（iOS 关键） */
  unlockByUserGesture(): boolean {
    if (!this.createCtx()) return false;

    // 播放可听到的解锁音（C6-E6 双音）
    if (this.ctx && !this.unlocked) {
      const t = this.ctx.currentTime;
      this.playNote(NOTES.C6, t, 0.12, 'triangle', 0.5, this.sfxGain!);
      this.playNote(NOTES.E6, t + 0.12, 0.12, 'triangle', 0.45, this.sfxGain!);
      this.unlocked = true;

      // 解锁成功后启动 BGM
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
        this.playNote(880, t, 0.06, 'sine', 0.25, this.sfxGain);
        break;
      case 'select':
        this.playNote(784, t, 0.08, 'triangle', 0.3, this.sfxGain);
        this.playNote(1175, t + 0.06, 0.1, 'triangle', 0.25, this.sfxGain);
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
        // 搞怪音效
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
    if (this.unlocked && !this.muted && !this.bgmPlaying) {
      this.startBGM();
    }
  }

  get state() {
    return {
      muted: this.muted,
      ready: this.unlocked,
      interacted: this.unlocked,
      playing: this.bgmPlaying,
    };
  }
}

export const audioManager = new AudioManager();