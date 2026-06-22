// ============================================================
// 游戏全局状态（zustand · v3 增强版）
// ------------------------------------------------------------
// 新增：
//   - 连续选对高情商答案 → 隐藏段位「情商天花板」
//   - 连续选社死选项 → 解锁「社交杀手」隐藏成就
//   - 随机地狱模式（hellMode）
//   - 击败全球玩家百分比计算（percentile）
// ============================================================
import { create } from 'zustand';
import type { Scene, Level } from '../data/types';
import { scenes, getSceneById, getScenesByModule } from '../data';
import type { SceneModule } from '../data/types';
import { getOptionLevel } from '../data/levels';
import { scoreCustomInput, scorePresetOption, type ScoringResult } from '../utils/scoring';

export type PageName = 'home' | 'modules' | 'select' | 'game' | 'result' | 'report' | 'profile';

// 每一次答题的记录
export interface AnswerRecord {
  sceneId: string;
  questionId: string;
  score: number;
  level: Level;
  result: ScoringResult;
  selectedOptionId?: string;
  customInput?: string;
  optionLevel?: 'anti' | 'god' | 'high' | 'medium' | 'low';
}

// 每个场景的聚合结果（用于结果页/总报告页）
export interface SceneResult {
  sceneId: string;
  totalScore: number;
  averageScore: number;
  level: Level;
  answers: AnswerRecord[];
}

// 隐藏成就
export interface HiddenAchievement {
  id: 'eqCeiling' | 'socialKiller';
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
  emoji: string;
}

interface GameState {
  currentPage: PageName;
  setPage: (page: PageName) => void;

  currentModule: SceneModule;
  selectModule: (moduleId: SceneModule) => void;

  codename: string;
  setCodename: (name: string) => void;

  consented: boolean;
  setConsented: (v: boolean) => void;

  currentSceneIndex: number;
  currentQuestionIndex: number;
  selectScene: (index: number, opts?: { hellMode?: boolean }) => void;

  // 地狱模式（混合场景题目）
  hellMode: boolean;
  setHellMode: (v: boolean) => void;

  // 连续选对 / 选错追踪（用于隐藏彩蛋）
  streakAnti: number;  // 连续选高情商 (anti + god + high)
  streakLow: number;   // 连续选社死 (low)
  maxStreakAnti: number;
  maxStreakLow: number;
  achieved: Set<string>;

  answers: AnswerRecord[];
  customInputs: Record<string, string>;
  setCustomInput: (key: string, value: string) => void;

  submitAnswer: (optionId?: string, customInput?: string, optionLevel?: 'anti' | 'god' | 'high' | 'medium' | 'low') => void;

  goToNextScene: () => void;
  reset: () => void;

  // ---- 只读便利方法 ----
  getCurrentScene: () => Scene | null;
  getCurrentQuestion: () => { questionIndex: number; question: Scene['questions'][0] } | null;
  getCompletedSceneResult: (sceneId: string) => SceneResult | null;
  getCurrentSceneResult: () => SceneResult | null;
  getFinalReport: () => {
    totalScore: number;
    averageScore: number;
    level: Level;
    scenes: SceneResult[];
    percentile: number;      // 击败全球 XX% 玩家
  };
  getCompletedSceneIds: () => Set<string>;
}

// --- 击败百分比计算：基于合理的正态分布模拟 ---
// 全球玩家平均分≈65分，标准差≈18
// 用累积正态分布近似估算玩家位置
function estimatePercentile(avg: number): number {
  const mean = 65;
  const sd = 18;
  const z = (avg - mean) / sd;
  // Abramowitz & Stegun 近似 erf
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = z >= 0 ? 1 : -1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  const erf = sign * y;
  const pct = 0.5 * (1 + erf);
  // 边界夹紧 + 让数据更友好
  const friendly = Math.min(99.9, Math.max(0.5, pct * 100));
  // 极端高分额外加一点"神性"加成
  if (avg >= 95) return Math.min(99.9, friendly + 0.5);
  if (avg >= 90) return Math.min(99.9, friendly + 0.3);
  return friendly;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentPage: 'home',
  setPage: (page) => set({ currentPage: page }),

  currentModule: 'eq-challenge',
  selectModule: (moduleId) => set({ currentModule: moduleId, currentPage: 'select', currentSceneIndex: 0, currentQuestionIndex: 0 }),

  codename: '',
  setCodename: (name) => set({ codename: name }),

  consented: false,
  setConsented: (v) => set({ consented: v }),

  currentSceneIndex: 0,
  currentQuestionIndex: 0,
  selectScene: (index, optsIn) => {
    const opts = typeof optsIn === 'object' && optsIn !== null ? optsIn : {};
    set({
      currentSceneIndex: index,
      currentQuestionIndex: 0,
      currentPage: 'game',
      hellMode: opts?.hellMode ?? false,
      streakAnti: 0,
      streakLow: 0,
      maxStreakAnti: 0,
      maxStreakLow: 0,
      achieved: new Set(),
    });
  },

  answers: [],
  customInputs: {},
  setCustomInput: (key, value) =>
    set((s) => ({ customInputs: { ...s.customInputs, [key]: value } })),

  hellMode: false,
  setHellMode: (v) => set({ hellMode: v }),

  streakAnti: 0,
  streakLow: 0,
  maxStreakAnti: 0,
  maxStreakLow: 0,
  achieved: new Set<string>(),

  submitAnswer: (optionId, customInput, optionLevel) => {
    const state = get();
    const scene = state.getCurrentScene();
    const q = state.getCurrentQuestion();
    if (!scene || !q) return;

    let score = 0;
    let level: Level;
    let result: ScoringResult;
    let recordOptionId: string | undefined;
    let recordCustomInput: string | undefined;
    let resolvedLevel = optionLevel;

    if (optionId) {
      const option = q.question.options.find((o) => o.id === optionId);
      if (!option) return;
      score = option.score;
      level = getOptionLevel(option.level);
      result = scorePresetOption(score);
      recordOptionId = optionId;
      resolvedLevel = option.level;
    } else if (customInput !== undefined && customInput.trim().length > 0) {
      const r = scoreCustomInput(customInput);
      score = r.score;
      level = r.level;
      result = r;
      recordCustomInput = customInput;
      if (score >= 85) resolvedLevel = 'high';
      else if (score < 40) resolvedLevel = 'low';
      else resolvedLevel = 'medium';
    } else {
      return;
    }

    const record: AnswerRecord = {
      sceneId: scene.id,
      questionId: q.question.id,
      score,
      level,
      result,
      selectedOptionId: recordOptionId,
      customInput: recordCustomInput,
      optionLevel: resolvedLevel,
    };

    // --- 连对 / 连错追踪 ---
    let nextStreakAnti = state.streakAnti;
    let nextStreakLow = state.streakLow;
    const newAchieved = new Set(state.achieved);

    if (resolvedLevel === 'anti' || resolvedLevel === 'god' || resolvedLevel === 'high') {
      nextStreakAnti = state.streakAnti + 1;
      nextStreakLow = 0;
      if (nextStreakAnti >= 3) newAchieved.add('eqCeiling');
    } else if (resolvedLevel === 'low') {
      nextStreakLow = state.streakLow + 1;
      nextStreakAnti = 0;
      if (nextStreakLow >= 3) newAchieved.add('socialKiller');
    } else {
      nextStreakAnti = 0;
      nextStreakLow = 0;
    }

    const isLastInScene = q.questionIndex + 1 >= scene.questions.length;

    set({
      answers: [...state.answers, record],
      currentQuestionIndex: isLastInScene ? 0 : q.questionIndex + 1,
      currentPage: 'result',
      streakAnti: nextStreakAnti,
      streakLow: nextStreakLow,
      maxStreakAnti: Math.max(state.maxStreakAnti, nextStreakAnti),
      maxStreakLow: Math.max(state.maxStreakLow, nextStreakLow),
      achieved: newAchieved,
    });
  },

  goToNextScene: () => {
    const { currentSceneIndex, currentModule, getCompletedSceneIds } = get();
    const moduleScenes = getScenesByModule(currentModule);
    const completed = getCompletedSceneIds();
    let nextIndex = currentSceneIndex + 1;
    while (nextIndex < moduleScenes.length && completed.has(moduleScenes[nextIndex].id)) {
      nextIndex++;
    }
    if (nextIndex >= moduleScenes.length) {
      set({ currentPage: 'report' });
    } else {
      set({ currentSceneIndex: nextIndex, currentQuestionIndex: 0, currentPage: 'select' });
    }
  },

  reset: () =>
    set({
      currentPage: 'home',
      currentSceneIndex: 0,
      currentQuestionIndex: 0,
      answers: [],
      customInputs: {},
      hellMode: false,
      streakAnti: 0,
      streakLow: 0,
      maxStreakAnti: 0,
      maxStreakLow: 0,
      achieved: new Set(),
    }),

  getCurrentScene: () => {
    const moduleScenes = getScenesByModule(get().currentModule);
    return moduleScenes[get().currentSceneIndex] ?? null;
  },

  getCurrentQuestion: () => {
    const moduleScenes = getScenesByModule(get().currentModule);
    const s = moduleScenes[get().currentSceneIndex];
    if (!s) return null;
    const qi = Math.min(get().currentQuestionIndex, s.questions.length - 1);
    return { questionIndex: qi, question: s.questions[qi] };
  },

  getCompletedSceneResult: (sceneId) => {
    const scene = getSceneById(sceneId);
    if (!scene) return null;
    const answers = get().answers.filter((a) => a.sceneId === sceneId);
    if (answers.length === 0) return null;
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const averageScore = Math.round(totalScore / answers.length);
    const level = (() => {
      const maxAnswer = answers.reduce((a, b) => (a.score > b.score ? a : b));
      return maxAnswer.level;
    })();
    return { sceneId, totalScore: averageScore, averageScore, level, answers };
  },

  getCurrentSceneResult: () => {
    const s = get().getCurrentScene();
    if (!s) return null;
    return get().getCompletedSceneResult(s.id);
  },

  getFinalReport: () => {
    const moduleScenes = getScenesByModule(get().currentModule);
    const completed = moduleScenes
      .map((s) => get().getCompletedSceneResult(s.id))
      .filter((r): r is SceneResult => !!r);
    if (completed.length === 0) {
      return {
        totalScore: 0,
        averageScore: 0,
        level: getOptionLevel('low'),
        scenes: [],
        percentile: 0.5,
      };
    }
    const totalScore = completed.reduce((sum, r) => sum + r.averageScore, 0);
    const avg = Math.round(totalScore / completed.length);
    const foundLevel = (() => {
      if (avg === 100) return getOptionLevel('anti');
      if (avg >= 90) return getOptionLevel('god');
      if (avg >= 70) return getOptionLevel('high');
      if (avg >= 40) return getOptionLevel('medium');
      return getOptionLevel('low');
    })();
    return {
      totalScore,
      averageScore: avg,
      level: foundLevel,
      scenes: completed,
      percentile: estimatePercentile(avg),
    };
  },

  getCompletedSceneIds: () => {
    const moduleScenes = getScenesByModule(get().currentModule);
    const map = new Map<string, number>();
    for (const a of get().answers) {
      map.set(a.sceneId, (map.get(a.sceneId) ?? 0) + 1);
    }
    const ids = new Set<string>();
    for (const s of moduleScenes) {
      const cnt = map.get(s.id) ?? 0;
      if (cnt >= s.questions.length) ids.add(s.id);
    }
    return ids;
  },
}));

// ---- 隐藏成就元数据 ----
export const HIDDEN_ACHIEVEMENTS: HiddenAchievement[] = [
  {
    id: 'eqCeiling',
    title: { zh: '🏆 情商天花板', en: '🏆 EQ Ceiling' },
    desc: {
      zh: '连续 3 题选到高情商答案，全场被你稳稳拿捏',
      en: 'Picked 3 high-EQ answers in a row — you owned that room',
    },
    emoji: '🏆',
  },
  {
    id: 'socialKiller',
    title: { zh: '💀 社交杀手', en: '💀 Social Killer' },
    desc: {
      zh: '连续 3 题触发社死答案，恭喜抠出三室一厅',
      en: '3 social-death answers in a row — congrats, you excavated three apartments',
    },
    emoji: '💀',
  },
];
