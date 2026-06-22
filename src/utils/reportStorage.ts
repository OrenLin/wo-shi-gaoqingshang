// ======================================================================
// reportStorage.ts — 报告持久化工具
// 将完成的报告快照保存到 localStorage，供个人中心报告历史使用
// ======================================================================

import type { Level, Localized, SceneModule } from '../data/types';

// ---------- 存储的报告快照结构 ----------
export interface StoredReport {
  /** 唯一 ID（时间戳） */
  id: string;
  /** ISO 时间字符串 */
  timestamp: string;
  /** 模块 ID */
  module: SceneModule;
  /** 模块名（双语） */
  moduleName: { zh: string; en: string };
  /** 平均分 0-100 */
  averageScore: number;
  /** 段位 emoji */
  levelEmoji: string;
  /** 段位名（双语） */
  levelName: { zh: string; en: string };
  /** 击败百分比 */
  percentile: number;
  /** 5 维数据 */
  dims: {
    key: string;
    label: { zh: string; en: string };
    value: number;
  }[];
  /** 完成场景数 */
  sceneCount: number;
  /** 玩家代号 */
  codename: string;
}

const STORAGE_KEY = 'eq_reports';

// ---------- 保存报告 ----------
export function saveReport(params: {
  module: SceneModule;
  moduleName: { zh: string; en: string };
  averageScore: number;
  level: Level;
  percentile: number;
  dims: { key: string; label: { zh: string; en: string }; value: number }[];
  sceneCount: number;
  codename: string;
}): void {
  try {
    const reports = getReportHistory();
    const now = Date.now();
    // 去重：同模块 5 秒内不重复保存
    const recent = reports.find(
      (r) =>
        r.module === params.module &&
        Math.abs(now - parseInt(r.id)) < 5000,
    );
    if (recent) return;

    const report: StoredReport = {
      id: String(now),
      timestamp: new Date(now).toISOString(),
      module: params.module,
      moduleName: params.moduleName,
      averageScore: params.averageScore,
      levelEmoji: params.level.emoji,
      levelName:
        typeof params.level.name === 'string'
          ? { zh: params.level.name, en: params.level.name }
          : params.level.name,
      percentile: params.percentile,
      dims: params.dims,
      sceneCount: params.sceneCount,
      codename: params.codename,
    };
    reports.unshift(report); // 最新的放前面
    // 限制最多保存 100 条
    const trimmed = reports.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save report:', e);
  }
}

// ---------- 读取所有历史报告（按时间倒序） ----------
export function getReportHistory(): StoredReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const reports = JSON.parse(raw) as StoredReport[];
    // 确保倒序
    return reports.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  } catch (e) {
    console.warn('Failed to read report history:', e);
    return [];
  }
}

// ---------- 清空所有历史报告 ----------
export function clearReportHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear report history:', e);
  }
}

// ---------- 报告统计 ----------
export interface ReportStats {
  /** 总测评次数 */
  totalCount: number;
  /** 各模块次数 */
  moduleCounts: Record<SceneModule, number>;
  /** 所有报告的平均分 */
  averageScore: number;
  /** 最高分 */
  bestScore: number;
}

export function getReportStats(): ReportStats {
  const reports = getReportHistory();
  if (reports.length === 0) {
    return {
      totalCount: 0,
      moduleCounts: { 'eq-challenge': 0, academic: 0 },
      averageScore: 0,
      bestScore: 0,
    };
  }
  const moduleCounts: Record<SceneModule, number> = {
    'eq-challenge': 0,
    academic: 0,
  };
  let totalScore = 0;
  let bestScore = 0;
  for (const r of reports) {
    moduleCounts[r.module] = (moduleCounts[r.module] ?? 0) + 1;
    totalScore += r.averageScore;
    if (r.averageScore > bestScore) bestScore = r.averageScore;
  }
  return {
    totalCount: reports.length,
    moduleCounts,
    averageScore: Math.round(totalScore / reports.length),
    bestScore,
  };
}
