// ======================================================================
// 音频管理模块（全局单例）
// - BGM：开场循环播放，音量小
// - 点击音效：每个交互触发
// - 抗压之王特殊音效：100分触发
// 使用方式：AudioManager.play('click') / AudioManager.play('anti')
// ======================================================================
type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

const BASE_URL = '/audio';

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private bgmGain: GainNode | null = null;
  private bgmPlaying = false;
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.connect(this.audioCtx.destination);
      this.gainNode.gain.value = 0.6;
    }
    return this.audioCtx;
  }

  // 初始化时预加载 BGM
  async loadBGM(): Promise<void> {
    try {
      const ctx = this.getCtx();
      const resp = await fetch(`${BASE_URL}/bgm.mp3`);
      const arrayBuffer = await resp.arrayBuffer();
      this.bgmBuffer = await ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      // BGM 加载失败静默忽略
    }
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.25,
    startDelay = 0,
  ): void {
    if (this.muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = frequency;
    const t = ctx.currentTime + startDelay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  // 短促点击音
  playClick(): void {
    this.playTone(880, 0.06, 'sine', 0.2);
  }

  // 选项选中的确认音
  playSelect(): void {
    this.playTone(1320, 0.08, 'sine', 0.18, 0);
    this.playTone(1760, 0.08, 'sine', 0.15, 0.06);
  }

  // 提交答案的清脆音
  playSubmit(): void {
    this.playTone(523, 0.1, 'triangle', 0.3, 0);
    this.playTone(659, 0.12, 'triangle', 0.25, 0.08);
    this.playTone(784, 0.18, 'triangle', 0.2, 0.15);
  }

  // 成功通关的欢快音
  playSuccess(): void {
    [523, 659, 784, 1047].forEach((f, i) => {
      this.playTone(f, 0.2, 'triangle', 0.25, i * 0.1);
    });
  }

  // 抗压之王特殊音效：胜利反击！
  playAntiKing(): void {
    // 第一段：低沉的反击音（象征压制对方）
    this.playTone(200, 0.15, 'sawtooth', 0.35, 0);
    this.playTone(250, 0.15, 'sawtooth', 0.3, 0.12);
    // 第二段：上行扫弦（胜利感）
    [440, 523, 659, 784, 1047].forEach((f, i) => {
      this.playTone(f, 0.3, 'triangle', 0.3, 0.35 + i * 0.07);
    });
    // 第三段：锣/胜利音效
    this.playTone(1800, 0.5, 'sine', 0.4, 0.9);
    this.playTone(1200, 0.4, 'sine', 0.3, 0.95);
    this.playTone(900, 0.3, 'sine', 0.2, 1.0);
  }

  play(key: SoundKey): void {
    switch (key) {
      case 'click':    return this.playClick();
      case 'select':   return this.playSelect();
      case 'submit':   return this.playSubmit();
      case 'success':  return this.playSuccess();
      case 'anti':     return this.playAntiKing();
    }
  }

  startBGM(): void {
    if (this.bgmPlaying || !this.bgmBuffer || this.muted) return;
    const ctx = this.getCtx();
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0.12; // 背景音乐音量小
    this.bgmGain.connect(ctx.destination);
    this.bgmSource = ctx.createBufferSource();
    this.bgmSource.buffer = this.bgmBuffer;
    this.bgmSource.loop = true;
    this.bgmSource.connect(this.bgmGain);
    this.bgmSource.start();
    this.bgmPlaying = true;
  }

  stopBGM(): void {
    if (!this.bgmPlaying) return;
    try {
      this.bgmSource?.stop();
    } catch (_) {}
    this.bgmPlaying = false;
    this.bgmSource = null;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    }
    return this.muted;
  }

  get isMuted() { return this.muted; }
  get isBgmPlaying() { return this.bgmPlaying; }
}

export const audioManager = new AudioManager();
