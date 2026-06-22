import { useState, useMemo } from 'react';
import { useI18n } from '../../i18n';
import { useGameStore } from '../../store/gameStore';
import { getReportHistory, type StoredReport } from '../../utils/reportStorage';
import { calculateEQCoefficient, calculateTrend, getTitlesWithStatus, getUnlockedCount } from '../../utils/eqTrajectory';
import { audioManager } from '../../utils/audioManager';

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

  const points = chartReports.map((r, i) => {
    const x = padding.left + (chartReports.length === 1 ? innerW / 2 : (i / (chartReports.length - 1)) * innerW);
    const y = padding.top + innerH - (r.averageScore / 100) * innerH;
    return { x, y, report: r };
  });

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
          <div className="text-xs font-black text-[#1a1a2e]/60 mb-2">
            {zh ? '📊 成长曲线' : '📊 Growth Curve'}
          </div>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" role="img" aria-label={zh ? '情商成长曲线' : 'EQ growth curve'}>
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
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
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
