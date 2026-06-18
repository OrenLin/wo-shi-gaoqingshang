// ======================================================================
// 音频管理模块（全局单例，纯 Web Audio API 合成，零外部文件依赖）
//
// 手机端（iOS Safari）兼容性关键要点：
//   1. AudioContext 必须在用户手势的同步调用栈内创建 + resume
//   2. 每次调度前都检查 ctx.state，必要时同步 resume
//   3. 不使用 AudioBuffer / fetch 等异步路径，全部用实时调度器
//   4. BGM 采用"定时调度"方案，循环播放 2 小节短旋律
//
// 使用方式：
//   audioManager.ensureReady()   // 按钮点击时预初始化（重要！）
//   audioManager.play('select')  // 播放音效
//   audioManager.startBGM()       // 启动背景音乐
//   audioManager.toggleMute()     // 静音切换
// ======================================================================
type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmTimer: ReturnType<typeof setInterval> | null = null;
  private bgmPlaying = false;
  private muted = false;
  private initialized = false;

  /** 同步创建并准备好 AudioContext —— 必须在用户手势（点击/触摸）内调用 */
  ensureReady(): void {
    if (this.audioCtx && this.audioCtx.state === 'running') return;

    if (!this.audioCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return;
      this.audioCtx = new Ctor({ latencyHint: 'interactive' });
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.audioCtx.destination);
    }

    // iOS 要求同步 resume（在同一个用户手势事件内）
    if (this.audioCtx.state === 'suspended') {
      try {
        this.audioCtx.resume();
      } catch (_) {}
    }
    this.initialized = true;
  }

  // ------- 单个音符调度（绝对时间） -------
  private scheduleNote(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainValue = 0.12,
  ): void {
    const ctx = this.audioCtx!;
    const masterGain = this.masterGain!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
    g.gain.setValueAtTime(gainValue, startTime + duration * 0.65);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(g);
    g.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  // ------- 鼓点调度（kick / snare / hi-hat） -------
  private scheduleKick(startTime: number): void {
    const ctx = this.audioCtx!;
    const masterGain = this.masterGain!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.12);
    g.gain.setValueAtTime(0.25, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + 0.2);
  }

  private scheduleSnare(startTime: number): void {
    const ctx = this.audioCtx!;
    const masterGain = this.masterGain!;
    // 用噪波做 snare（多个带噪声的振荡器叠加）
    const band = ctx.createOscillator();
    const bandGain = ctx.createGain();
    band.type = 'triangle';
    band.frequency.value = 200;
    bandGain.gain.setValueAtTime(0.18, startTime);
    bandGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
    band.connect(bandGain);
    bandGain.connect(masterGain);
    band.start(startTime);
    band.stop(startTime + 0.15);

    // 高频白噪声模拟（用高频正弦近似）
    const hi = ctx.createOscillator();
    const hiGain = ctx.createGain();
    hi.type = 'sine';
    hi.frequency.value = 6000 + Math.random() * 500;
    hiGain.gain.setValueAtTime(0.05, startTime);
    hiGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
    hi.connect(hiGain);
    hiGain.connect(masterGain);
    hi.start(startTime);
    hi.stop(startTime + 0.12);
  }

  private scheduleHiHat(startTime: number): void {
    const ctx = this.audioCtx!;
    const masterGain = this.masterGain!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 7500 + Math.random() * 400;
    g.gain.setValueAtTime(0.04, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + 0.06);
  }

  // ======================================================================
  //  BGM 调度：2 小节 × 8 拍 = 约 3.5 秒循环
  //  节奏：C五声音阶，每拍 kick/snare/hi-hat 节奏稳定
  // ======================================================================
  private scheduleLoop(startTime: number): number {
    const beat = 0.22; // 220ms per beat
    const beatsPerBar = 8;
    const bars = 2;
    const totalBeats = beatsPerBar * bars;

    // 旋律：C五声音阶（C5, D5, E5, G5, A5, G5, E5, D5）
    const melody = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33];
    // 第二小节稍作变化（高八度点缀）
    const melody2 = [523.25 * 2, 659.25, 880, 783.99, 659.25, 587.33, 523.25, 659.25];

    for (let i = 0; i < totalBeats; i++) {
      const t = startTime + i * beat;
      const freq = i < beatsPerBar ? melody[i] : melody2[i - beatsPerBar];
      const isAccent = i === 0 || i === beatsPerBar;

      // 旋律主音（突出第一拍）
      this.scheduleNote(freq, t, beat * 0.9, 'triangle', isAccent ? 0.15 : 0.1);
      // 低音（根音）：每4拍来一次
      if (i % 4 === 0) this.scheduleNote(freq / 2, t, beat * 1.5, 'sine', 0.09);

      // 鼓点节奏：kick on 0,4; snare on 2,6; hi-hat on every beat
      const beatIdx = i % beatsPerBar;
      if (beatIdx === 0 || beatIdx === 4) this.scheduleKick(t);
      if (beatIdx === 2 || beatIdx === 6) this.scheduleSnare(t);
      this.scheduleHiHat(t);
      if (beatIdx === 1 || beatIdx === 3 || beatIdx === 5 || beatIdx === 7) {
        this.scheduleHiHat(t + beat * 0.5); // 反拍 hi-hat
      }
    }

    // 返回下一个循环的起始时间
    return startTime + totalBeats * beat;
  }

  // ======================================================================
  //  公共方法
  // ======================================================================

  /** 启动 BGM：首次调用会确保 AudioContext 已就绪 */
  startBGM(): void {
    if (this.bgmPlaying || this.muted) return;
    this.ensureReady();
    if (!this.audioCtx) return;

    // 先把音量调到 0，然后淡入（避免 iOS 拒绝）
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.6, this.audioCtx.currentTime + 0.8);
    }

    let nextStart = this.audioCtx.currentTime + 0.05;
    // 首轮调度
    nextStart = this.scheduleLoop(nextStart);
    // 预调度下一轮（提前一点调度避免空窗）
    nextStart = this.scheduleLoop(nextStart);

    this.bgmPlaying = true;

    // 定时调度下一轮循环（每 3.5 秒调度一次循环内容）
    const loopInterval = 3500;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.bgmPlaying || !this.audioCtx) return;
      // 若 ctx 被浏览器暂停，尝试恢复
      if (this.audioCtx.state === 'suspended') {
        try { this.audioCtx.resume(); } catch (_) {}
      }
      // 从当前时间 + 0.1s 开始排下一个 loop
      let t = this.audioCtx.currentTime + 0.1;
      t = this.scheduleLoop(t);
      t = this.scheduleLoop(t);
    }, loopInterval);
  }

  stopBGM(): void {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.audioCtx && this.masterGain) {
      // 快速淡出
      try {
        this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.2);
      } catch (_) {}
    }
    this.bgmPlaying = false;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.muted;
  }

  // ---- 单音效：简短点击/选中/提交/胜利/抗压之王 ----

  playClick(): void {
    this.ensureReady();
    if (!this.audioCtx || this.muted) return;
    const t = this.audioCtx.currentTime;
    this.scheduleNote(880, t, 0.06, 'sine', 0.12);
  }

  playSelect(): void {
    this.ensureReady();
    if (!this.audioCtx || this.muted) return;
    const t = this.audioCtx.currentTime;
    this.scheduleNote(784, t, 0.06, 'triangle', 0.14);
    this.scheduleNote(1175, t + 0.05, 0.08, 'triangle', 0.12);
  }

  playSubmit(): void {
    this.ensureReady();
    if (!this.audioCtx || this.muted) return;
    const t = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      this.scheduleNote(f, t + i * 0.07, 0.18, 'triangle', 0.15);
    });
    this.scheduleKick(t + 0.2);
  }

  playSuccess(): void {
    this.ensureReady();
    if (!this.audioCtx || this.muted) return;
    const t = this.audioCtx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      this.scheduleNote(f, t + i * 0.1, 0.22, 'triangle', 0.18);
    });
    this.scheduleKick(t);
    this.scheduleSnare(t + 0.25);
  }

  playAntiKing(): void {
    this.ensureReady();
    if (!this.audioCtx || this.muted) return;
    const t = this.audioCtx.currentTime;
    // 开场低沉打击
    this.scheduleNote(180, t, 0.12, 'sawtooth', 0.18);
    this.scheduleKick(t + 0.1);
    // 上扬音阶（搞笑感）
    [523, 659, 784, 1047, 1318, 1567].forEach((f, i) => {
      this.scheduleNote(f, t + 0.25 + i * 0.07, 0.18, 'triangle', 0.16);
    });
    // 爆炸感
    this.scheduleNote(1200, t + 0.7, 0.4, 'square', 0.14);
    this.scheduleNote(1600, t + 0.8, 0.3, 'sine', 0.12);
    this.scheduleSnare(t + 0.85);
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

  get isMuted() { return this.muted; }
  get isBgmPlaying() { return this.bgmPlaying; }
}

export const audioManager = new AudioManager();
