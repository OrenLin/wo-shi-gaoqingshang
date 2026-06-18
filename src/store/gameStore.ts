// ============================================================
// 游戏全局状态（zustand）
// ------------------------------------------------------------
// 支持：多场景 / 每场景多道题 / 自由发挥 / 段位结算
// 使用方式：
//   const { currentPage, setPage, submitAnswer } = useGameStore();
// ============================================================
import { create } from 'zustand';
import type { Scene, Level } from '../data/types';
import { scenes, getSceneById } from '../data';
import { getOptionLevel } from '../data/levels';
import { scoreCustomInput, scorePresetOption, type ScoringResult } from '../utils/scoring';

export type PageName = 'home' | 'select' | 'game' | 'result' | 'report';

// 每一次答题的记录
export interface AnswerRecord {
  sceneId: string;
  questionId: string;
  score: number;
  level: Level;
  result: ScoringResult;
  selectedOptionId?: string;
  customInput?: string;
}

// 每个场景的聚合结果（用于结果页/总报告页）
export interface SceneResult {
  sceneId: string;
  totalScore: number;       // 各题得分之和
  averageScore: number;     // 平均分（四舍五入到整数）
  level: Level;             // 按平均分拿到的段位
  answers: AnswerRecord[];  // 每道题的答题详情
}

interface GameState {
  // 页面路由
  currentPage: PageName;
  setPage: (page: PageName) => void;

  // 用户代号（首页输入）
  codename: string;
  setCodename: (name: string) => void;

  // 场景进度
  currentSceneIndex: number;
  currentQuestionIndex: number;
  selectScene: (index: number) => void;

  // 答题结果
  answers: AnswerRecord[];                 // 所有答题记录
  customInputs: Record<string, string>;     // 自由发挥内容（key: sceneId:questionId 或 sceneId 兼容旧数据）
  setCustomInput: (key: string, value: string) => void;

  // 提交答案：
  //   - 如果当前场景还有下一题 → 停留在 game（组件自己判断切换到下一题动画）
  //   - 如果是场景最后一题 → result 页
  submitAnswer: (optionId?: string, customInput?: string) => void;

  // 跳到下一场景（从 result 页出发）
  goToNextScene: () => void;

  // 重置游戏
  reset: () => void;

  // ---------- 只读便利方法 ----------
  // 当前场景对象
  getCurrentScene: () => Scene | null;
  // 当前题目
  getCurrentQuestion: () => { questionIndex: number; question: Scene['questions'][0] } | null;
  // 已完成场景结果（便于结果页/报告页取数）
  getCompletedSceneResult: (sceneId: string) => SceneResult | null;
  // 当前场景结果（刚答完题目后展示）
  getCurrentSceneResult: () => SceneResult | null;
  // 总报告
  getFinalReport: () => {
    totalScore: number;
    averageScore: number;
    level: Level;
    scenes: SceneResult[];
  };
  // 已完成的场景ID集合（用于场景选择页的"已完成"角标）
  getCompletedSceneIds: () => Set<string>;
}

export const useGameStore = create<GameState>((set, get) => ({
  // ---------- 路由 ----------
  currentPage: 'home',
  setPage: (page) => set({ currentPage: page }),

  // ---------- 用户代号 ----------
  codename: '',
  setCodename: (name) => set({ codename: name }),

  // ---------- 场景进度 ----------
  currentSceneIndex: 0,
  currentQuestionIndex: 0,
  selectScene: (index) =>
    set({
      currentSceneIndex: index,
      currentQuestionIndex: 0,
      currentPage: 'game',
    }),

  // ---------- 答题数据 ----------
  answers: [],
  customInputs: {},
  setCustomInput: (key, value) =>
    set((s) => ({ customInputs: { ...s.customInputs, [key]: value } })),

  // ---------- 提交答案 ----------
  submitAnswer: (optionId, customInput) => {
    const state = get();
    const scene = state.getCurrentScene();
    const q = state.getCurrentQuestion();
    if (!scene || !q) return;

    let score = 0;
    let level: Level;
    let result: ScoringResult;
    let recordOptionId: string | undefined;
    let recordCustomInput: string | undefined;

    if (optionId) {
      const option = q.question.options.find((o) => o.id === optionId);
      if (!option) return;
      score = option.score;
      level = getOptionLevel(option.level);
      result = scorePresetOption(score);
      recordOptionId = optionId;
    } else if (customInput !== undefined && customInput.trim().length > 0) {
      const r = scoreCustomInput(customInput);
      score = r.score;
      level = r.level;
      result = r;
      recordCustomInput = customInput;
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
    };

    // 判断是否场景内最后一题
    const isLastInScene = q.questionIndex + 1 >= scene.questions.length;

    set({
      answers: [...state.answers, record],
      currentQuestionIndex: isLastInScene ? 0 : q.questionIndex + 1,
      currentPage: 'result',
    });
  },

  // ---------- 下一场景 ----------
  goToNextScene: () => {
    const { currentSceneIndex, getCompletedSceneIds } = get();
    // 找下一个未完成的场景
    const completed = getCompletedSceneIds();
    let nextIndex = currentSceneIndex + 1;
    while (nextIndex < scenes.length && completed.has(scenes[nextIndex].id)) {
      nextIndex++;
    }
    if (nextIndex >= scenes.length) {
      // 都完成 → 报告页
      set({ currentPage: 'report' });
    } else {
      set({ currentSceneIndex: nextIndex, currentQuestionIndex: 0, currentPage: 'select' });
    }
  },

  // ---------- 重置 ----------
  reset: () =>
    set({
      currentPage: 'home',
      currentSceneIndex: 0,
      currentQuestionIndex: 0,
      answers: [],
      customInputs: {},
    }),

  // ---------- 只读方法 ----------
  getCurrentScene: () => scenes[get().currentSceneIndex] ?? null,

  getCurrentQuestion: () => {
    const s = scenes[get().currentSceneIndex];
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
    // 用总分（百分制等价：直接用平均分）取 Level
    const level = (() => {
      // 用最高分的一题取 emoji
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
    const completed = scenes
      .map((s) => get().getCompletedSceneResult(s.id))
      .filter((r): r is SceneResult => !!r);
    if (completed.length === 0) {
      // 空结果（避免 NaN）
      return { totalScore: 0, averageScore: 0, level: getOptionLevel('low'), scenes: [] };
    }
    const totalScore = completed.reduce((sum, r) => sum + r.averageScore, 0);
    const avg = Math.round(totalScore / completed.length);
    // 找对应 Level
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
    };
  },

  getCompletedSceneIds: () => {
    const map = new Map<string, number>();
    for (const a of get().answers) {
      map.set(a.sceneId, (map.get(a.sceneId) ?? 0) + 1);
    }
    const ids = new Set<string>();
    for (const s of scenes) {
      const cnt = map.get(s.id) ?? 0;
      if (cnt >= s.questions.length) ids.add(s.id);
    }
    return ids;
  },
}));
