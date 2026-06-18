import { create } from 'zustand';
import { scenes, Scene, getLevel, Level } from '../data/scenes';
import { scoreCustomInput, scorePresetOption, ScoringResult } from '../utils/scoring';

interface SceneResult {
  sceneId: string;
  score: number;
  level: Level;
  result: ScoringResult;
  selectedOptionId?: string;
  customInput?: string;
}

interface GameState {
  // 状态
  currentPage: 'home' | 'select' | 'game' | 'result' | 'report';
  currentSceneIndex: number;
  completedScenes: SceneResult[];
  customInputs: { [sceneId: string]: string };
  isRecording: boolean;

  // 方法
  setPage: (page: 'home' | 'select' | 'game' | 'result' | 'report') => void;
  selectScene: (index: number) => void;
  submitAnswer: (sceneId: string, optionId?: string, customInput?: string) => SceneResult;
  goToNextScene: () => void;
  setCustomInput: (sceneId: string, input: string) => void;
  setRecording: (isRecording: boolean) => void;
  getCurrentScene: () => Scene | null;
  getFinalReport: () => {
    totalScore: number;
    averageScore: number;
    level: Level;
    scenes: SceneResult[];
  };
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentPage: 'home',
  currentSceneIndex: 0,
  completedScenes: [],
  customInputs: {},
  isRecording: false,

  setPage: (page) => set({ currentPage: page }),

  selectScene: (index) => set({
    currentSceneIndex: index,
    currentPage: 'game'
  }),

  submitAnswer: (sceneId, optionId, customInput) => {
    let result: SceneResult;

    if (optionId) {
      // 预设选项评分
      const scene = scenes.find(s => s.id === sceneId);
      const option = scene?.options.find(o => o.id === optionId);
      const scoringResult = scorePresetOption(option?.score || 0);

      result = {
        sceneId,
        score: option?.score || 0,
        level: scoringResult.level,
        result: scoringResult,
        selectedOptionId: optionId
      };
    } else if (customInput) {
      // 自定义输入评分
      const scoringResult = scoreCustomInput(customInput);

      result = {
        sceneId,
        score: scoringResult.score,
        level: scoringResult.level,
        result: scoringResult,
        customInput
      };
    } else {
      throw new Error('必须提供选项ID或自定义输入');
    }

    set(state => ({
      completedScenes: [...state.completedScenes, result],
      currentPage: 'result'
    }));

    return result;
  },

  goToNextScene: () => {
    const { currentSceneIndex, completedScenes } = get();

    // 检查是否还有未完成的场景
    const remainingScenes = scenes.filter(
      scene => !completedScenes.some(r => r.sceneId === scene.id)
    );

    if (remainingScenes.length > 0) {
      // 找到下一个未完成的场景索引
      const nextScene = scenes.find(
        scene => !completedScenes.some(r => r.sceneId === scene.id)
      );
      const nextIndex = scenes.findIndex(s => s.id === nextScene?.id);

      set({
        currentSceneIndex: nextIndex >= 0 ? nextIndex : 0,
        currentPage: 'select'
      });
    } else {
      // 所有场景都完成了，进入报告页
      set({ currentPage: 'report' });
    }
  },

  setCustomInput: (sceneId, input) => set(state => ({
    customInputs: { ...state.customInputs, [sceneId]: input }
  })),

  setRecording: (isRecording) => set({ isRecording }),

  getCurrentScene: () => {
    const { currentSceneIndex } = get();
    return scenes[currentSceneIndex] || null;
  },

  getFinalReport: () => {
    const { completedScenes } = get();

    const totalScore = completedScenes.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round(totalScore / completedScenes.length);
    const level = getLevel(averageScore);

    return {
      totalScore,
      averageScore,
      level,
      scenes: completedScenes
    };
  },

  reset: () => set({
    currentPage: 'home',
    currentSceneIndex: 0,
    completedScenes: [],
    customInputs: {},
    isRecording: false
  })
}));
