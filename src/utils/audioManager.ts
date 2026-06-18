// ======================================================================
// 音频管理模块（iOS Safari 兼容版）
// 核心思路：
//  1. ensureReady() 必须在用户手势（click/touch/keydown）的同步栈内调用
//  2. 调用 ensureReady 时立即播放一个极短（1ms）的解锁音 —— 这是 iOS 识别
//     "用户主动触发声音" 的唯一标准，解锁后 BGM/音效才能正常播放
//  3. BGM 循环不依赖 setInterval 做音符调度，改为：
//     - 立即在当前 ctx 时间上调度一段 melody
//     - 用 requestAnimationFrame 持续检查并补上下一段
//     - 页面从后台切回时立即 checkAndResume
// ======================================================================
type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmRafId: number | null = null;
  private bgmNextScheduleAt = 0;   // 下一个 BGM 小节开始的绝对时间（ctx time）
  private bgmPlaying = false;
  private muted = false;
  private unlocked = false;        // iOS 音频是否已"解锁"

  // ============= 核心：iOS 音频解锁（必须在用户手势同步调用栈内） =============
  ensureReady(): void {
    // 1) 首次：创建 AudioContext + GainNode
    if (!this.ctx) {
      const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return;
      try {
        this.ctx = new Ctor({ latencyHint: 'interactive' });
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);
      } catch (_) {
        this.ctx = null;
        return;
      }
    }

    // 2) 如果被 iOS suspend/interrupt → 同步 resume（不 await，直接 fire）
    if (this.ctx) {
      const st = this.ctx.state as string;
      if (st === 'suspended' || st === 'interrupted') {
        try { this.ctx.resume(); } catch (_) {}
      }
    }

    // 3) 关键：立即播放一个极短（1ms）的静音解锁音
    //    —— 这是 iOS 认可"用户手势触发音频"的唯一路径
    if (this.ctx && !this.unlocked) {
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 440;
        g.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.001);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.001);
        this.unlocked = true;
      } catch (_) {}
    }
  }

  // ===== 单音符调度（相对当前时间，毫秒 offset） =====
  private note(freq: number, offsetMs: number, durationMs: number, type: OscillatorType, gain: number): void {
    if (!this.ctx || !this.masterGain) return;
    const t0 = this.ctx.currentTime + offsetMs / 1000;
    const dur = durationMs / 1000;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
    g.gain.setValueAtTime(gain, t0 + Math.max(0.008, dur * 0.6));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.002);
  }

  // ===== BGM 一个小节（约 2.5s） —— 以 ctx 时间为基准 =====
  private scheduleBar(startTime: number): number {
    if (!this.ctx || !this.masterGain) return startTime;
    const beat = 0.25;                // 250ms/拍
    const beats = 8;                  // 8 拍 = 2 秒
    const melody1 = [523, 659, 784, 659, 587, 523, 440, 523]; // C大调音序，更顺耳
    for (let i = 0; i < beats; i++) {
      const t = startTime + i * beat;
      const freq = melody1[i];
      // 主旋律（稍响）
      this.scheduleNoteAt(freq, t, beat * 0.7, 'triangle', 0.13);
      // 低音：每 4 拍
      if (i % 4 === 0) {
        this.scheduleNoteAt(freq / 2, t, beat * 1.2, 'sine', 0.12);
      }
      // 鼓点：每 2 拍一个 kick，每拍一个轻 hi-hat
      if (i % 2 === 0) {
        this.scheduleKickAt(t);
      } else {
        this.scheduleHiHatAt(t);
      }
      this.scheduleHiHatAt(t + beat * 0.5);
    }
    return startTime + beats * beat;
  }

  // ===== 基于"绝对 ctx 时间"的音符调度（保证连续无间隙） =====
  private scheduleNoteAt(freq: number, t: number, duration: number, type: OscillatorType, gain: number): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.setValueAtTime(gain, t + duration * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + duration + 0.005);
  }

  private scheduleKickAt(t: number): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  private scheduleHiHatAt(t: number): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 7000 + Math.random() * 600;
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // ===== 检查 BGM 是否需要续排（主循环） =====
  private bgmTick = (): void => {
    if (!this.bgmPlaying || !this.ctx) return;
    // 如果 ctx 被暂停 → 恢复
    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch (_) {}
    }
    // 如果还需要排下一段（提前 500ms 排）
    const horizon = this.ctx.currentTime + 0.5;
    while (this.bgmNextScheduleAt < horizon) {
      this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt);
    }
    this.bgmRafId = requestAnimationFrame(this.bgmTick);
  };

  // ===================== 公共 API =====================

  startBGM(): void {
    if (this.bgmPlaying || this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;
    this.bgmPlaying = true;
    // 从当前时间 + 0.03s 开始排第一段
    this.bgmNextScheduleAt = this.ctx.currentTime + 0.03;
    this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt);
    this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt);
    if (this.bgmRafId == null) {
      this.bgmRafId = requestAnimationFrame(this.bgmTick);
    }
  }

  stopBGM(): void {
    if (this.bgmRafId != null) {
      cancelAnimationFrame(this.bgmRafId);
      this.bgmRafId = null;
    }
    // 淡入淡出
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
      } catch (_) {}
      setTimeout(() => {
        if (this.masterGain) this.masterGain.gain.value = 1.0;
      }, 250);
    }
    this.bgmPlaying = false;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    } else {
      this.ensureReady();
      this.startBGM();
    }
    return this.muted;
  }

  // ===== 音效：点击 =====
  playClick(): void {
    this.ensureReady();
    if (!this.ctx || this.muted) return;
    this.note(880, 0, 60, 'sine', 0.15);
  }

  playSelect(): void {
    this.ensureReady();
    if (!this.ctx || this.muted) return;
    this.note(784, 0, 60, 'triangle', 0.18);
    this.note(1175, 50, 80, 'triangle', 0.14);
  }

  playSubmit(): void {
    this.ensureReady();
    if (!this.ctx || this.muted) return;
    this.note(523, 0, 150, 'triangle', 0.18);
    this.note(659, 70, 150, 'triangle', 0.16);
    this.note(784, 140, 200, 'triangle', 0.14);
    if (this.ctx && this.masterGain) this.scheduleKickAt(this.ctx.currentTime + 0.2);
  }

  playSuccess(): void {
    this.ensureReady();
    if (!this.ctx || this.muted) return;
    [523, 659, 784, 1047].forEach((f, i) => {
      this.note(f, i * 100, 250, 'triangle', 0.18);
    });
  }

  playAntiKing(): void {
    this.ensureReady();
    if (!this.ctx || this.muted) return;
    // 低沉开头
    this.note(200, 0, 150, 'sawtooth', 0.18);
    if (this.ctx && this.masterGain) this.scheduleKickAt(this.ctx.currentTime + 0.1);
    // 上扬音阶
    [523, 659, 784, 1047, 1318, 1567].forEach((f, i) => {
      this.note(f, 250 + i * 70, 200, 'triangle', 0.18);
    });
    // 结尾爆发
    this.note(1200, 700, 400, 'square', 0.15);
    this.note(1600, 800, 300, 'sine', 0.13);
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
  get isUnlocked() { return this.unlocked; }
}

export const audioManager = new AudioManager();
