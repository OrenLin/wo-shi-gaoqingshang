// ======================================================================
// 音频管理模块（全局单例，纯 Web Audio API 合成，无需外部文件）
// - BGM：8小节合成循环，欢快搞怪风格
// - 音效：点击/选中/提交/抗压之王
// 使用方式：audioManager.play('select') / audioManager.startBGM()
// ======================================================================
type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private bgmPlaying = false;
  private bgmNodes: (OscillatorNode | GainNode)[] = [];
  private muted = false;

  private getCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
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

  // 短促点击音（轻快）
  playClick(): void {
    this.playTone(660, 0.05, 'sine', 0.15);
  }

  // 选项选中的确认音（清脆上扬）
  playSelect(): void {
    this.playTone(880, 0.06, 'sine', 0.18, 0);
    this.playTone(1108, 0.06, 'sine', 0.15, 0.05);
  }

  // 提交答案的清脆音
  playSubmit(): void {
    this.playTone(523, 0.1, 'triangle', 0.28, 0);
    this.playTone(659, 0.12, 'triangle', 0.22, 0.08);
    this.playTone(784, 0.18, 'triangle', 0.18, 0.16);
  }

  // 成功通关的欢快音
  playSuccess(): void {
    [523, 659, 784, 1047].forEach((f, i) => {
      this.playTone(f, 0.2, 'triangle', 0.22, i * 0.1);
    });
  }

  // 抗压之王特殊音效：搞笑反击音效
  playAntiKing(): void {
    // 先来一个"尴尬"的低频下滑
    this.playTone(300, 0.15, 'sawtooth', 0.2, 0);
    this.playTone(200, 0.2, 'sawtooth', 0.15, 0.1);
    // 然后一串搞怪上扬音符
    [523, 659, 784, 1047, 1318, 1567].forEach((f, i) => {
      this.playTone(f, 0.15, 'triangle', 0.22, 0.35 + i * 0.06);
    });
    // 结束的小号式爆发
    this.playTone(1047, 0.3, 'square', 0.15, 0.75);
    this.playTone(1318, 0.5, 'square', 0.12, 0.85);
  }

  play(key: SoundKey): void {
    switch (key) {
      case 'click':   return this.playClick();
      case 'select':  return this.playSelect();
      case 'submit':  return this.playSubmit();
      case 'success': return this.playSuccess();
      case 'anti':    return this.playAntiKing();
    }
  }

  // 启动合成 BGM（8小节循环，欢快搞怪）
  startBGM(): void {
    if (this.bgmPlaying || this.muted) return;
    const ctx = this.getCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08; // 音量小
    masterGain.connect(ctx.destination);

    const nodes: (OscillatorNode | GainNode)[] = [];

    // 五声音阶旋律（C大调五声音阶）
    const melody = [523, 587, 659, 784, 880, 784, 659, 523];
    const beatDuration = 0.22; // 每音符持续时间
    const barDuration = beatDuration * melody.length; // 一小节
    const totalBars = 8;
    const loopLen = barDuration * totalBars;

    // 旋律合成器
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(masterGain);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = i * beatDuration;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.5, t + 0.01);
      g.gain.setValueAtTime(0.5, t + beatDuration * 0.6);
      g.gain.linearRampToValueAtTime(0, t + beatDuration * 0.95);
      osc.start(t);
      osc.stop(t + beatDuration);
      nodes.push(osc, g);
    });

    // 复制 melody 三次凑满 8 小节（每小节旋律一样，但带相位差）
    for (let bar = 1; bar < totalBars; bar++) {
      const barOffset = bar * barDuration;
      melody.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(masterGain);
        osc.type = bar % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = freq * (bar % 3 === 0 ? 1.122 : 1); // 偶尔高八度
        const t = barOffset + i * beatDuration;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.35, t + 0.01);
        g.gain.setValueAtTime(0.35, t + beatDuration * 0.5);
        g.gain.linearRampToValueAtTime(0, t + beatDuration * 0.9);
        osc.start(t);
        osc.stop(t + beatDuration);
        nodes.push(osc, g);
      });
    }

    // 鼓点：简单的 hi-hat + kick
    for (let bar = 0; bar < totalBars; bar++) {
      for (let beat = 0; beat < 4; beat++) {
        const t = bar * barDuration + beat * beatDuration;

        // Hi-hat on every beat
        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        const noiseFilter = ctx.createBiquadFilter();
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.type = 'sawtooth';
        noise.frequency.value = 800 + Math.random() * 200;
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 7000;
        noiseGain.gain.setValueAtTime(beat % 2 === 0 ? 0.3 : 0.15, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        noise.start(t);
        noise.stop(t + 0.06);
        nodes.push(noise, noiseGain);

        // Kick on 1 & 3
        if (beat === 0 || beat === 2) {
          const kick = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kick.connect(kickGain);
          kickGain.connect(masterGain);
          kick.type = 'sine';
          kick.frequency.setValueAtTime(120, t);
          kick.frequency.exponentialRampToValueAtTime(50, t + 0.08);
          kickGain.gain.setValueAtTime(0.5, t);
          kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          kick.start(t);
          kick.stop(t + 0.16);
          nodes.push(kick, kickGain);
        }

        // Snare on 2 & 4
        if (beat === 1 || beat === 3) {
          const snare = ctx.createOscillator();
          const snareGain = ctx.createGain();
          snare.connect(snareGain);
          snareGain.connect(masterGain);
          snare.type = 'triangle';
          snare.frequency.value = 200;
          snareGain.gain.setValueAtTime(0.25, t);
          snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          snare.start(t);
          snare.stop(t + 0.1);
          nodes.push(snare, snareGain);
        }
      }
    }

    // 循环播放（用 setInterval 重新触发）
    this.bgmNodes = nodes;
    this.bgmPlaying = true;

    // 循环调度（每 loopLen ms 重新启动一小节旋律的淡入淡出）
    this.bgmLoopInterval = setInterval(() => {
      if (this.muted || !this.bgmPlaying) return;
      // 旋律淡出
      nodes.forEach(n => {
        if ('gain' in n && n instanceof GainNode) {
          const g = n as GainNode;
          if (g.gain.value > 0.01) {
            g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          }
        }
      });
    }, loopLen * 1000 - 300);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bgmLoopInterval: any = null;

  stopBGM(): void {
    if (!this.bgmPlaying) return;
    if (this.bgmLoopInterval) {
      clearInterval(this.bgmLoopInterval);
      this.bgmLoopInterval = null;
    }
    this.bgmNodes.forEach(n => {
      try { n instanceof OscillatorNode ? n.stop() : null; } catch (_) {}
    });
    this.bgmNodes = [];
    this.bgmPlaying = false;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) this.stopBGM();
    return this.muted;
  }

  get isMuted() { return this.muted; }
  get isBgmPlaying() { return this.bgmPlaying; }
}

export const audioManager = new AudioManager();
