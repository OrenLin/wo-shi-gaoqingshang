// 场景汇总：统一导出，供 store 和页面使用
// ---- 新增场景时，在这里 import 并加入 scenes 数组即可
import familyDinner from './scenes/family-dinner';
import workplace from './scenes/workplace';
import businessDinner from './scenes/business-dinner';
import type { Scene } from './types';

export const scenes: Scene[] = [familyDinner, workplace, businessDinner];

// 便捷工具：按ID取场景
export function getSceneById(id: string): Scene | undefined {
  return scenes.find((s) => s.id === id);
}

// 便捷工具：总题数（用于进度展示）
export function totalQuestions(): number {
  return scenes.reduce((sum, s) => sum + s.questions.length, 0);
}
