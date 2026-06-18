// ======================================================================
// 音频管理模块（iOS Safari 可靠版 + 丰富多轨 BGM）
//
// iOS 音频解锁核心原则（2026 经验总结）：
//   1. AudioContext 必须在用户手势的同步调用栈内创建 + resume
//   2. 必须播放一段**可听到的声音**（不能是静音/超短音）才会解锁
//   3. 首次解锁后后续所有 WebAudio 调用都正常工作
//   4. `webkitAudioContext` 在老 iOS 上比 `AudioContext` 更稳
//
// BGM 设计（C大调流行循环）：
//   和弦进行：C → Am → F → G（每 2 小节一个和弦，循环 8 小节）
//   音轨：
//     - Melody（三角波，主旋律，每小节一个乐句）
//     - Chord（正弦波和声，每拍和弦根音/三度/五度）
//     - Bass（低音 sine，每小节开头 + 中间）
//     - Hi-Hat（高频方波，八分音符）
//     - Kick（频率下滑正弦，第 1、5 拍）
// ======================================================================

type SoundKey = 'click' | 'select' | 'submit' | 'success' | 'anti';

// ============ 音乐常量（Hz 频率表） ============
const NOTES: Record<string, number> = {
  // C4 ~ B4 中音区
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.0, 'A4': 440.0, 'B4': 493.88,
  // C5 ~ B5 高音区
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
  'G5': 783.99, 'A5': 880.0, 'B5': 987.77,
  // C6 最高
  'C6': 1046.5,
  // 低音区
  'C3': 130.81, 'E3': 164.81, 'G3': 196.0, 'A3': 220.0,
  'F3': 174.61, 'D3': 146.83,
};

// 每个和弦的组成音（根音+三度+五度，用于 chord stabs）
const CHORD_TONES: Record<string, number[]> = {
  'C':  [NOTES['C5'], NOTES['E5'], NOTES['G5']],
  'Am': [NOTES['A4'], NOTES['C5'], NOTES['E5']],
  'F':  [NOTES['F4'], NOTES['A4'], NOTES['C5']],
  'G':  [NOTES['G4'], NOTES['B4'], NOTES['D5']],
};

// 主旋律（每小节 8 拍 × 4 小节 = 32 个音）
const MELODY: (string | null)[] = [
  // C 小节
  'C5', 'E5', 'G5', 'E5', 'C5', 'G5', 'E5', 'C5',
  // Am 小节
  'A4', 'C5', 'E5', 'C5', 'A4', 'E5', 'C5', 'A4',
  // F 小节
  'F4', 'A4', 'C5', 'A4', 'F4', 'C5', 'A4', 'F4',
  // G 小节
  'G4', 'B4', 'D5', 'B4', 'G4', 'D5', 'B4', 'G4',
];

// 第二遍 melody（高八度 + 变化）
const MELODY2: (string | null)[] = [
  'E5', 'G5', 'C6', 'G5', 'E5', 'C6', 'G5', 'E5',
  'C5', 'E5', 'A5', 'E5', 'C5', 'A5', 'E5', 'C5',
  'F4', 'C5', 'F5', 'C5', 'F4', 'F5', 'C5', 'A4',
  'G4', 'D5', 'G5', 'D5', 'G4', 'B4', 'G5', 'D5',
];

// 低音（每拍的低音根音）
const BASS: string[] = [
  'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'C3',
  'A3', 'A3', 'A3', 'A3', 'A3', 'A3', 'A3', 'A3',
  'F3', 'F3', 'F3', 'F3', 'F3', 'F3', 'F3', 'F3',
  'G3', 'G3', 'G3', 'G3', 'G3', 'G3', 'G3', 'G3',
];

// 和弦进行：每 2 拍切换和弦（16拍 = 4小节 × 4拍）
const CHORD_PROGRESSION: string[] = ['C', 'C', 'Am', 'Am', 'F', 'F', 'G', 'G'];

// ============ 工具函数 ============
function freqOf(note: string | null): number | null {
  if (!note) return null;
  return NOTES[note] ?? null;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;   // BGM 独立音量
  private sfxGain: GainNode | null = null;    // 音效独立音量

  private bgmRafId: number | null = null;
  private bgmNextScheduleAt = 0;
  private bgmPlaying = false;
  private muted = false;
  private unlocked = false;

  private beatDuration = 0.28;   // 每拍 280ms（≈ BPM 107，轻松活泼）
  private bgmVariation = 0;       // 0 = melody1, 1 = melody2

  // ===== 核心：iOS 音频解锁（必须在手势同步栈内调用） =====
  ensureReady(): void {
    if (!this.ctx) {
      const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return;
      try {
        this.ctx = new Ctor({ latencyHint: 'interactive' });
      } catch (_) {
        this.ctx = null;
        return;
      }
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);

      // BGM 通道：音量 0.35（不会盖过 UI 音）
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.35;
      this.bgmGain.connect(this.masterGain);

      // 音效通道：音量 0.6（清脆）
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.masterGain);
    }

    // 同步 resume（iOS 关键）
    const ctx = this.ctx;
    if (ctx && ctx.state !== 'running') {
      try { ctx.resume(); } catch (_) {}
    }

    // ---- 关键：播一个可听到的解锁音（iOS 需要感知声音才解锁） ----
    if (ctx && !this.unlocked) {
      try {
        const t0 = ctx.currentTime;
        // 两个短促的悦耳音：C6 100ms → E6 100ms
        this.scheduleSfxTone(NOTES['C6'], t0, 0.1, 'triangle', 0.35);
        this.scheduleSfxTone(NOTES['E6'], t0 + 0.1, 0.1, 'triangle', 0.30);
        this.unlocked = true;
      } catch (_) {}
    }
  }

  // ===== 播放单个音符（通用） =====
  private playNote(
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

    // ADSR 简化：快速起音，稳定，快速衰减
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
    g.gain.setValueAtTime(peakGain, startTime + Math.max(0.01, duration * 0.65));
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(g);
    g.connect(outNode);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  // 用于解锁音（走 sfxGain，不会受 muted 影响）
  private scheduleSfxTone(freq: number, t: number, dur: number, type: OscillatorType, peak: number): void {
    if (!this.ctx || !this.sfxGain) return;
    this.playNote(freq, t, dur, type, peak, this.sfxGain);
  }

  // ===== Kick 底鼓（频率快速下滑） =====
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

  // ===== Snare 军鼓（高频噪声感方波 + 快速衰减） =====
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

    // 高频点缀
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

  // ===== Hi-Hat 踩镲（高频方波短爆音） =====
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

  // ===== BGM：调度一个完整的 8-beat 小节 =====
  private scheduleBar(startTime: number, barIndex: number): number {
    if (!this.ctx || !this.bgmGain) return startTime;
    const beat = this.beatDuration;
    const melody = (this.bgmVariation % 2 === 0) ? MELODY : MELODY2;
    const chordOfBar = CHORD_PROGRESSION[barIndex % CHORD_PROGRESSION.length];
    const chordTones = CHORD_TONES[chordOfBar];

    for (let i = 0; i < 8; i++) {
      const t = startTime + i * beat;

      // 旋律
      const note = melody[(barIndex * 8 + i) % melody.length];
      if (note) {
        const f = freqOf(note);
        if (f) this.playNote(f, t, beat * 0.8, 'triangle', 0.14, this.bgmGain);
      }

      // 和弦铺底：每 2 拍一个轻柔和弦音
      if (i % 2 === 0 && chordTones) {
        chordTones.forEach((cf, ci) => {
          this.playNote(cf / 2, t, beat * 1.3, 'sine', 0.035 - ci * 0.003, this.bgmGain);
        });
      }

      // Bass：每拍一个（偶拍稍弱）
      const bassNote = BASS[(barIndex * 8 + i) % BASS.length];
      const bf = freqOf(bassNote);
      if (bf) this.playNote(bf, t, beat * 0.7, 'sine', i % 2 === 0 ? 0.12 : 0.08, this.bgmGain);

      // Kick：第 1、5 拍（强拍）
      if (i === 0 || i === 4) this.scheduleKick(t);
      // Snare：第 3、7 拍（弱拍反拍）
      if (i === 2 || i === 6) this.scheduleSnare(t);
      // Hi-Hat：每拍 + 反拍都打
      this.scheduleHiHat(t, i % 4 === 0);
      this.scheduleHiHat(t + beat * 0.5, false);
    }

    return startTime + 8 * beat;
  }

  // ===== BGM 循环：用 rAF 预排下一小节 =====
  private bgmTick = (): void => {
    if (!this.bgmPlaying || !this.ctx) return;
    const st = this.ctx.state as string;
    if (st === 'suspended' || st === 'interrupted') {
      try { this.ctx.resume(); } catch (_) {}
    }
    // 提前 1 秒预排下一段
    const horizon = this.ctx.currentTime + 1.0;
    let barIndex = Math.floor(this.bgmNextScheduleAt / (8 * this.beatDuration));
    while (this.bgmNextScheduleAt < horizon) {
      this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt, barIndex);
      barIndex++;
      // 每 4 小节切换一次旋律变体，保持新鲜
      if (barIndex % 4 === 0) this.bgmVariation = 1 - this.bgmVariation;
    }
    this.bgmRafId = requestAnimationFrame(this.bgmTick);
  };

  // ================= 公共 API =================

  startBGM(): void {
    if (this.bgmPlaying || this.muted) return;
    this.ensureReady();
    if (!this.ctx) return;
    this.bgmPlaying = true;
    this.bgmNextScheduleAt = this.ctx.currentTime + 0.05;
    // 预排 2 小节
    this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt, 0);
    this.bgmNextScheduleAt = this.scheduleBar(this.bgmNextScheduleAt, 1);
    if (this.bgmRafId == null) {
      this.bgmRafId = requestAnimationFrame(this.bgmTick);
    }
  }

  stopBGM(): void {
    if (this.bgmRafId != null) {
      cancelAnimationFrame(this.bgmRafId);
      this.bgmRafId = null;
    }
    if (this.ctx && this.bgmGain) {
      try {
        this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, this.ctx.currentTime);
        this.bgmGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.25);
      } catch (_) {}
      setTimeout(() => {
        if (this.bgmGain) this.bgmGain.gain.value = 0.35;
      }, 300);
    }
    this.bgmPlaying = false;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      }
      this.ensureReady();
      this.startBGM();
    }
    return this.muted;
  }

  // ===== 短音效 =====
  playClick(): void {
    this.ensureReady();
    if (!this.ctx || this.muted || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    this.playNote(1046, t, 0.05, 'sine', 0.2, this.sfxGain);
  }

  playSelect(): void {
    this.ensureReady();
    if (!this.ctx || this.muted || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    this.playNote(784, t, 0.06, 'triangle', 0.22, this.sfxGain);
    this.playNote(1175, t + 0.05, 0.08, 'triangle', 0.18, this.sfxGain);
  }

  playSubmit(): void {
    this.ensureReady();
    if (!this.ctx || this.muted || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.playNote(f, t + i * 0.07, 0.18, 'triangle', 0.22, this.sfxGain);
    });
    // 末尾一个 kick 增强"提交"反馈
    if (this.bgmGain) {
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
  }

  playSuccess(): void {
    this.ensureReady();
    if (!this.ctx || this.muted || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    // C-E-G-C 大调音阶琶音
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      this.playNote(f, t + i * 0.09, 0.22, 'triangle', 0.22, this.sfxGain);
    });
  }

  playAntiKing(): void {
    this.ensureReady();
    if (!this.ctx || this.muted || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    // 开场低沉下滑（整活感）
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

    // 上扬音阶（搞笑）
    [523, 784, 1047, 1318, 1568, 1760].forEach((f, i) => {
      this.playNote(f, t + 0.2 + i * 0.06, 0.18, 'square', 0.18, this.sfxGain);
    });

    // 结尾爆发
    this.playNote(1200, t + 0.6, 0.4, 'square', 0.18, this.sfxGain);
    this.playNote(1568, t + 0.75, 0.35, 'triangle', 0.15, this.sfxGain);
    this.playNote(2093, t + 0.9, 0.25, 'sine', 0.12, this.sfxGain);
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
