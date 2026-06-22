// 场景汇总：统一导出，供 store 和页面使用
// ---- 新增场景时，在这里 import 并加入 scenes 数组即可
import familyDinner from './scenes/family-dinner';
import workplace from './scenes/workplace';
import businessDinner from './scenes/business-dinner';
import thesisDefense from './scenes/academic/thesis-defense';
import advisorTalk from './scenes/academic/advisor-talk';
import graduationCeremony from './scenes/academic/graduation-ceremony';
import type { Scene, ModuleConfig, SceneModule } from './types';

// 原有场景（情商挑战模块）
const eqScenes: Scene[] = [familyDinner, workplace, businessDinner];

// 学术抗压模块
const academicScenes: Scene[] = [thesisDefense, advisorTalk, graduationCeremony];

// 向后兼容：所有场景汇总
export const scenes: Scene[] = [...eqScenes, ...academicScenes];

// 模块配置
export const sceneModules: ModuleConfig[] = [
  {
    id: 'eq-challenge',
    title: { zh: '情商挑战', en: 'EQ Challenge' },
    emoji: '🧠',
    description: { zh: '职场·家庭·酒局三大社死现场', en: 'Workplace · Family · Dinner — three social-death arenas' },
    bgColor: 'from-amber-400/80 via-orange-400/60 to-red-500/70',
    accentColor: 'amber',
    scenes: eqScenes,
  },
  {
    id: 'academic',
    title: { zh: '学术抗压', en: 'Academic Pressure' },
    emoji: '🎓',
    description: { zh: '答辩·导师·毕业三大生存考验', en: 'Defense · Advisor · Graduation — three survival trials' },
    bgColor: 'from-indigo-500/80 via-blue-400/60 to-cyan-500/70',
    accentColor: 'indigo',
    scenes: academicScenes,
  },
];

// 便捷工具：按ID取场景
export function getSceneById(id: string): Scene | undefined {
  return scenes.find((s) => s.id === id);
}

// 便捷工具：按模块ID取场景列表
export function getScenesByModule(moduleId: SceneModule): Scene[] {
  const mod = sceneModules.find((m) => m.id === moduleId);
  return mod?.scenes ?? [];
}

// 便捷工具：按模块ID取模块配置
export function getModuleById(moduleId: SceneModule): ModuleConfig | undefined {
  return sceneModules.find((m) => m.id === moduleId);
}

// 便捷工具：总题数（用于进度展示）
export function totalQuestions(): number {
  return scenes.reduce((sum, s) => sum + s.questions.length, 0);
}
