// ======================================================================
// eqTrajectory.ts — 情商轨迹计算 + 称号解锁逻辑
// ======================================================================

import type { StoredReport } from './reportStorage';

// ---------- 趋势类型 ----------
export type Trend = 'up' | 'stable' | 'down';

// ---------- 称号接口 ----------
export interface EQTitle {
  id: string;
  emoji: string;
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
  /** 解锁条件判断函数 */
  check: (reports: StoredReport[]) => boolean;
}

// ---------- 所有称号定义 ----------
export const EQ_TITLES: EQTitle[] = [
  {
    id: 'first-step',
    emoji: '🥇',
    title: { zh: '初出茅庐', en: 'First Steps' },
    desc: { zh: '完成 1 次情商测评', en: 'Complete 1 EQ assessment' },
    check: (r) => r.length >= 1,
  },
  {
    id: 'pressure-king',
    emoji: '🔥',
    title: { zh: '抗压之王', en: 'Pressure King' },
    desc: { zh: '学术抗压模块获得满分 100', en: 'Score 100 in Academic module' },
    check: (r) => r.some((rep) => rep.module === 'academic' && rep.averageScore >= 100),
  },
  {
    id: 'data-lover',
    emoji: '📊',
    title: { zh: '数据控', en: 'Data Enthusiast' },
    desc: { zh: '完成 5 次测评', en: 'Complete 5 assessments' },
    check: (r) => r.length >= 5,
  },
  {
    id: 'dual-face',
    emoji: '🎭',
    title: { zh: '双面人生', en: 'Dual Persona' },
    desc: { zh: '两个模块各完成至少 1 次', en: 'Complete both modules at least once' },
    check: (r) => {
      const mods = new Set(r.map((rep) => rep.module));
      return mods.has('eq-challenge') && mods.has('academic');
    },
  },
  {
    id: 'eq-deity',
    emoji: '👑',
    title: { zh: '情商之神', en: 'EQ Deity' },
    desc: { zh: '任意模块获得 ≥90 分', en: 'Score ≥90 in any module' },
    check: (r) => r.some((rep) => rep.averageScore >= 90),
  },
  {
    id: 'persistent',
    emoji: '🔄',
    title: { zh: '持之以恒', en: 'Persistent' },
    desc: { zh: '完成 10 次测评', en: 'Complete 10 assessments' },
    check: (r) => r.length >= 10,
  },
  {
    id: 'social-butterfly',
    emoji: '🦋',
    title: { zh: '社交蝴蝶', en: 'Social Butterfly' },
    desc: { zh: '情商挑战模块获得 ≥70 分', en: 'Score ≥70 in EQ Challenge' },
    check: (r) => r.some((rep) => rep.module === 'eq-challenge' && rep.averageScore >= 70),
  },
  {
    id: 'survivor',
    emoji: '🛡️',
    title: { zh: '社死幸存者', en: 'Social Death Survivor' },
    desc: { zh: '完成 3 次测评且均分 <40', en: 'Complete 3 assessments with avg <40' },
    check: (r) => {
      if (r.length < 3) return false;
      const avg = r.reduce((s, rep) => s + rep.averageScore, 0) / r.length;
      return avg < 40;
    },
  },
];

// ---------- 计算情商系数（加权平均） ----------
// 最近 3 次权重：0.5 / 0.3 / 0.2（越近权重越高）
// 超过 3 次的只取最近 3 次
export function calculateEQCoefficient(reports: StoredReport[]): number {
  if (reports.length === 0) return 0;
  // 按时间正序排列（旧→新），取最近 3 次
  const sorted = [...reports].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const recent = sorted.slice(-3);
  const weights = recent.length === 1 ? [1] : recent.length === 2 ? [0.4, 0.6] : [0.2, 0.3, 0.5];
  let sum = 0;
  recent.forEach((r, i) => {
    sum += r.averageScore * weights[i];
  });
  return Math.round(sum);
}

// ---------- 计算趋势 ----------
export function calculateTrend(reports: StoredReport[]): Trend {
  if (reports.length < 2) return 'stable';
  const sorted = [...reports].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  const diff = last.averageScore - prev.averageScore;
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

// ---------- 获取已解锁和未解锁的称号 ----------
export interface TitleWithStatus extends EQTitle {
  unlocked: boolean;
}

export function getTitlesWithStatus(reports: StoredReport[]): TitleWithStatus[] {
  return EQ_TITLES.map((title) => ({
    ...title,
    unlocked: title.check(reports),
  }));
}

// ---------- 获取已解锁称号数量 ----------
export function getUnlockedCount(reports: StoredReport[]): number {
  return EQ_TITLES.filter((t) => t.check(reports)).length;
}
