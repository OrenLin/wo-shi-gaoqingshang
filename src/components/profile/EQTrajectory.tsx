import { useState, useMemo } from 'react';
import { useI18n } from '../../i18n';
import { useGameStore } from '../../store/gameStore';
import { getReportHistory, type StoredReport } from '../../utils/reportStorage';
import { calculateEQCoefficient, calculateTrend, getTitlesWithStatus, getUnlockedCount } from '../../utils/eqTrajectory';
import { audioManager } from '../../utils/audioManager';

// 最小二乘法线性回归 —— 用于成长曲线趋势预测
function linearRegression(pts: { x: number; y: number }[]): { slope: number; intercept: number } {
  const n = pts.length;
  if (n < 2) return { slope: 0, intercept: pts[0]?.y ?? 0 };
  const sumX = pts.reduce((s, p) => s + p.x, 0);
  const sumY = pts.reduce((s, p) => s + p.y, 0);
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-9) return { slope: 0, intercept: sumY / n };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function EQTrajectory() {
  const language = useI18n((s) => s.language);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';

  const reports = useMemo(() => getReportHistory(), []);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const coefficient = useMemo(() => calculateEQCoefficient(reports), [reports]);
  const trend = useMemo(() => calculateTrend(reports), [reports]);
  const titles = useMemo(() => getTitlesWithStatus(reports), [reports]);
  const unlockedCount = useMemo(() => getUnlockedCount(reports), [reports]);

  // 趋势箭头和颜色
  const trendInfo = {
    up: { icon: '↑', color: 'text-emerald-600', label: zh ? '上升中' : 'Rising' },
    stable: { icon: '→', color: 'text-amber-600', label: zh ? '平稳' : 'Stable' },
    down: { icon: '↓', color: 'text-rose-600', label: zh ? '下降' : 'Declining' },
  };
  const ti = trendInfo[trend];

  // 空状态
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-8 text-center animate-pop-in">
        <div className="text-5xl mb-3" aria-hidden="true">📈</div>
        <div className="font-black text-[#1a1a2e] mb-1">
          {zh ? '暂无轨迹数据' : 'No Trajectory Data'}
        </div>
        <div className="text-sm font-bold text-[#1a1a2e]/50 mb-4">
          {zh ? '完成至少 1 次测评后，这里会显示你的情商成长曲线' : 'Complete at least 1 assessment to see your EQ growth curve'}
        </div>
        <button
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setPage('modules');
          }}
          className="bg-amber-300 text-[#1a1a2e] font-black text-sm rounded-full px-5 py-2 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] transition-transform active:scale-95 hover:scale-105"
        >
          {zh ? '🎯 去测评' : '🎯 Start Assessment'}
        </button>
      </div>
    );
  }

  // SVG 折线图数据（按时间正序）
  const chartReports = [...reports].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const chartWidth = 300;
  const chartHeight = 120;
  const padding = { top: 15, right: 15, bottom: 25, left: 30 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  // 仅当数据点 ≥ 3 时启用趋势预测（延伸 2 个预测点）
  const showPrediction = chartReports.length >= 3;
  const predictCount = showPrediction ? 2 : 0;
  const totalSlots = Math.max(chartReports.length + predictCount, 1);

  const xForIndex = (i: number) =>
    padding.left + (totalSlots === 1 ? innerW / 2 : (i / (totalSlots - 1)) * innerW);
  const yForScore = (score: number) =>
    padding.top + innerH - (Math.max(0, Math.min(100, score)) / 100) * innerH;

  const points = chartReports.map((r, i) => ({
    x: xForIndex(i),
    y: yForScore(r.averageScore),
    report: r,
  }));

  // 线性回归拟合（基于 index ↔ score）
  const regressionInput = chartReports.map((r, i) => ({ x: i, y: r.averageScore }));
  const { slope, intercept } = linearRegression(regressionInput);

  // 预测点（夹紧到 0~100）
  const predictionPoints = showPrediction
    ? Array.from({ length: predictCount }, (_, k) => {
        const idx = chartReports.length + k;
        const predictedScore = Math.max(0, Math.min(100, slope * idx + intercept));
        return {
          x: xForIndex(idx),
          y: yForScore(predictedScore),
          predictedScore: Math.round(predictedScore),
          idx,
        };
      })
    : [];

  // 趋势线（从首个实际点延伸到最后一个预测点）
  const trendStartIdx = 0;
  const trendEndIdx = chartReports.length - 1 + predictCount;
  const trendLine = {
    x1: xForIndex(trendStartIdx),
    y1: yForScore(Math.max(0, Math.min(100, intercept))),
    x2: xForIndex(trendEndIdx),
    y2: yForScore(Math.max(0, Math.min(100, slope * trendEndIdx + intercept))),
  };

  // 预测区间带状（±8 分的半透明带，仅预测段）
  const bandWidth = 8;
  const lastActual = points[points.length - 1];
  const lastPredict = predictionPoints[predictionPoints.length - 1];
  const predictBand = showPrediction && lastActual && lastPredict
    ? {
        x1: lastActual.x,
        y1Top: yForScore(Math.max(0, Math.min(100, (slope * (chartReports.length - 1) + intercept) + bandWidth))),
        y1Bot: yForScore(Math.max(0, Math.min(100, (slope * (chartReports.length - 1) + intercept) - bandWidth))),
        x2: lastPredict.x,
        y2Top: yForScore(Math.max(0, Math.min(100, (slope * trendEndIdx + intercept) + bandWidth))),
        y2Bot: yForScore(Math.max(0, Math.min(100, (slope * trendEndIdx + intercept) - bandWidth))),
      }
    : null;

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="space-y-3">
      {/* 情商系数卡片 */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 animate-pop-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold opacity-80 mb-1">
              {zh ? '综合情商系数' : 'EQ Coefficient'}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black leading-none">{coefficient}</span>
              <span className="text-sm font-bold opacity-70">/100</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-black ${ti.color === 'text-emerald-600' ? 'text-emerald-300' : ti.color === 'text-rose-600' ? 'text-rose-300' : 'text-amber-300'}`}>
              {ti.icon}
            </div>
            <div className="text-[10px] font-bold opacity-80">{ti.label}</div>
          </div>
        </div>
        <div className="mt-3 text-[11px] font-bold opacity-70">
          {zh
            ? `基于最近 ${Math.min(reports.length, 3)} 次测评加权计算 · 共 ${reports.length} 次`
            : `Based on recent ${Math.min(reports.length, 3)} assessments · ${reports.length} total`}
        </div>
      </div>

      {/* 成长曲线 SVG */}
      {reports.length >= 2 && (
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-4 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-black text-[#1a1a2e]/60">
              {zh ? '📊 成长曲线' : '📊 Growth Curve'}
            </div>
            {showPrediction && (
              <div className="text-[10px] font-black text-purple-600 bg-purple-50 rounded-full px-2 py-0.5 border border-purple-200 flex items-center gap-1">
                <span aria-hidden="true">🔮</span>
                {zh ? '趋势预测' : 'Forecast'}
              </div>
            )}
          </div>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" role="img" aria-label={zh ? '情商成长曲线' : 'EQ growth curve'}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="predictBandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Y 轴刻度线 */}
            {[0, 25, 50, 75, 100].map((v) => {
              const y = padding.top + innerH - (v / 100) * innerH;
              return (
                <g key={v}>
                  <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#1a1a2e" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
                  <text x={padding.left - 5} y={y + 3} textAnchor="end" fontSize="8" fill="#1a1a2e" opacity="0.4" fontWeight="bold">{v}</text>
                </g>
              );
            })}
            {/* 预测区间带状（仅预测段） */}
            {predictBand && (
              <path
                d={`M ${predictBand.x1} ${predictBand.y1Top} L ${predictBand.x2} ${predictBand.y2Top} L ${predictBand.x2} ${predictBand.y2Bot} L ${predictBand.x1} ${predictBand.y1Bot} Z`}
                fill="url(#predictBandGradient)"
              />
            )}
            {/* 趋势线（实际段实线 + 预测段虚线） */}
            {showPrediction && (
              <>
                {/* 实际段趋势线（淡） */}
                <line
                  x1={trendLine.x1}
                  y1={trendLine.y1}
                  x2={points[points.length - 1].x}
                  y2={points[points.length - 1].y}
                  stroke="#a855f7"
                  strokeWidth="1"
                  opacity="0.35"
                />
                {/* 预测段趋势线（虚线） */}
                <line
                  x1={points[points.length - 1].x}
                  y1={points[points.length - 1].y}
                  x2={trendLine.x2}
                  y2={trendLine.y2}
                  stroke="#a855f7"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />
              </>
            )}
            {/* 折线 */}
            <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* 折线下方渐变填充 */}
            {points.length >= 2 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`}
                fill="url(#chartGradient)"
                opacity="0.2"
              />
            )}
            {/* 数据点 */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIdx === i ? 5 : 3.5}
                  fill="#fff"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                />
                {/* X 轴日期标签 */}
                <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="7" fill="#1a1a2e" opacity="0.4" fontWeight="bold">
                  {formatDate(p.report.timestamp)}
                </text>
              </g>
            ))}
            {/* 预测点（虚线圆 + 预测分值） */}
            {predictionPoints.map((p, i) => (
              <g key={`pred-${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill="#faf5ff"
                  stroke="#a855f7"
                  strokeWidth="1.8"
                  strokeDasharray="2 1.5"
                />
                <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="7.5" fill="#a855f7" fontWeight="bold">
                  {p.predictedScore}
                </text>
                <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="6.5" fill="#a855f7" opacity="0.7" fontWeight="bold">
                  {zh ? '预测' : 'FCST'}
                </text>
              </g>
            ))}
            {/* 悬浮提示 */}
            {hoverIdx !== null && points[hoverIdx] && (
              <g>
                <rect
                  x={Math.min(Math.max(points[hoverIdx].x - 35, 5), chartWidth - 75)}
                  y={points[hoverIdx].y - 28}
                  width="70"
                  height="20"
                  rx="4"
                  fill="#1a1a2e"
                />
                <text
                  x={Math.min(Math.max(points[hoverIdx].x, 40), chartWidth - 40)}
                  y={points[hoverIdx].y - 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#fbbf24"
                  fontWeight="bold"
                >
                  {points[hoverIdx].report.averageScore}分 · {formatDate(points[hoverIdx].report.timestamp)}
                </text>
              </g>
            )}
          </svg>
          {/* 预测说明 */}
          {showPrediction && (
            <div className="mt-2 text-[10px] font-bold text-[#1a1a2e]/45 leading-relaxed flex items-center gap-1.5">
              <span aria-hidden="true">🔮</span>
              {zh
                ? '基于最小二乘法线性回归预测未来 2 次测评趋势，仅供参考'
                : 'Linear-regression forecast for next 2 assessments, for reference only'}
            </div>
          )}
        </div>
      )}

      {/* 称号展示区 */}
      <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-4 animate-pop-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-black text-[#1a1a2e]/60">
            {zh ? '🏆 称号收藏' : '🏆 Title Collection'}
          </div>
          <div className="text-[10px] font-black text-amber-600 bg-amber-100 rounded-full px-2 py-0.5 border border-amber-300">
            {unlockedCount}/{titles.length}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {titles.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border-[2px] p-2.5 flex items-center gap-2 transition-all ${
                t.unlocked
                  ? 'bg-amber-50 border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]'
                  : 'bg-slate-50 border-[#1a1a2e]/15'
              }`}
            >
              <div className={`text-2xl flex-shrink-0 ${t.unlocked ? '' : 'opacity-30 grayscale'}`} aria-hidden="true">
                {t.unlocked ? t.emoji : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-black truncate ${t.unlocked ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/30'}`}>
                  {zh ? t.title.zh : t.title.en}
                </div>
                <div className={`text-[9px] font-bold leading-tight ${t.unlocked ? 'text-[#1a1a2e]/50' : 'text-[#1a1a2e]/25'}`}>
                  {zh ? t.desc.zh : t.desc.en}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
