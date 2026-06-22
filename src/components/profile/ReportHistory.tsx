import { useState, useMemo } from 'react';
import { useI18n } from '../../i18n';
import { useGameStore } from '../../store/gameStore';
import { getReportHistory, clearReportHistory, type StoredReport } from '../../utils/reportStorage';
import { audioManager } from '../../utils/audioManager';

type FilterKey = 'all' | 'eq-challenge' | 'academic';

export default function ReportHistory() {
  const language = useI18n((s) => s.language);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';

  const [reports, setReports] = useState<StoredReport[]>(() => getReportHistory());
  const [filter, setFilter] = useState<FilterKey>('all');
  const [desc, setDesc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = reports;
    if (filter !== 'all') {
      list = list.filter((r) => r.module === filter);
    }
    const sorted = [...list].sort((a, b) => {
      const ta = new Date(a.timestamp).getTime();
      const tb = new Date(b.timestamp).getTime();
      return desc ? tb - ta : ta - tb;
    });
    return sorted;
  }, [reports, filter, desc]);

  const handleClear = () => {
    if (confirm(zh ? '确定清空所有历史报告吗？此操作不可恢复。' : 'Clear all report history? This cannot be undone.')) {
      clearReportHistory();
      setReports([]);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: zh ? '全部' : 'All' },
    { key: 'eq-challenge', label: zh ? '情商挑战' : 'EQ Challenge' },
    { key: 'academic', label: zh ? '学术抗压' : 'Academic' },
  ];

  // 空状态
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-8 text-center animate-pop-in">
        <div className="text-5xl mb-3" aria-hidden="true">📋</div>
        <div className="font-black text-[#1a1a2e] mb-1">
          {zh ? '还没有报告' : 'No Reports Yet'}
        </div>
        <div className="text-sm font-bold text-[#1a1a2e]/50 mb-4">
          {zh ? '去挑战一个场景，生成你的第一份报告吧！' : 'Challenge a scene to generate your first report!'}
        </div>
        <button
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setPage('modules');
          }}
          className="bg-amber-300 text-[#1a1a2e] font-black text-sm rounded-full px-5 py-2 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] transition-transform active:scale-95 hover:scale-105"
        >
          {zh ? '🎯 去挑战' : '🎯 Start Challenge'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 筛选 + 排序工具栏 */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[11px] font-black rounded-full px-3 py-1 border-[2px] border-[#1a1a2e] transition-transform active:scale-95 ${
                filter === f.key
                  ? 'bg-amber-300 text-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]'
                  : 'bg-white text-[#1a1a2e]/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setDesc(!desc)}
            className="text-[11px] font-black rounded-full px-3 py-1 border-[2px] border-[#1a1a2e] bg-white text-[#1a1a2e]/60 transition-transform active:scale-95"
            aria-label={zh ? '切换排序' : 'Toggle sort order'}
          >
            {desc ? '↓ ' : '↑ '}{zh ? '时间' : 'Time'}
          </button>
          <button
            onClick={handleClear}
            className="text-[11px] font-black rounded-full px-3 py-1 border-[2px] border-[#1a1a2e] bg-rose-100 text-rose-700 transition-transform active:scale-95"
            aria-label={zh ? '清空历史' : 'Clear history'}
          >
            {zh ? '🗑️ 清空' : '🗑️ Clear'}
          </button>
        </div>
      </div>

      {/* 报告列表 */}
      {filtered.length === 0 ? (
        <div className="bg-white/70 rounded-2xl border-[3px] border-dashed border-[#1a1a2e]/20 p-6 text-center text-sm font-bold text-[#1a1a2e]/40">
          {zh ? '该模块暂无报告' : 'No reports for this module'}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r, i) => {
            const isExpanded = expandedId === r.id;
            const modName = zh ? r.moduleName.zh : r.moduleName.en;
            const lvlName = zh ? r.levelName.zh : r.levelName.en;
            // 与同模块上一条报告对比，计算趋势
            const sameModuleReports = reports.filter((rep) => rep.module === r.module);
            const sortedByTime = [...sameModuleReports].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            );
            const currentIdxInModule = sortedByTime.findIndex((rep) => rep.id === r.id);
            const prevReport = currentIdxInModule >= 0 && currentIdxInModule < sortedByTime.length - 1
              ? sortedByTime[currentIdxInModule + 1]
              : null;
            const diff = prevReport ? r.averageScore - prevReport.averageScore : 0;
            const hasTrend = prevReport !== null;
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] overflow-hidden animate-pop-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="text-3xl flex-shrink-0" aria-hidden="true">{r.levelEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-[#1a1a2e]">{modName}</span>
                      <span className="text-[10px] font-bold text-[#1a1a2e]/40">{formatDate(r.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-lg font-black text-amber-600">{r.averageScore}</span>
                      <span className="text-[11px] font-bold text-[#1a1a2e]/50">{lvlName}</span>
                      {hasTrend && diff !== 0 && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
                            diff > 0
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                              : 'bg-rose-100 text-rose-700 border-rose-300'
                          }`}
                          aria-label={zh ? `与上次相比${diff > 0 ? '提升' : '下降'} ${Math.abs(diff)} 分` : `${diff > 0 ? 'Up' : 'Down'} ${Math.abs(diff)} vs last`}
                        >
                          {diff > 0 ? '↑' : '↓'} {Math.abs(diff)}
                        </span>
                      )}
                      {hasTrend && diff === 0 && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-300">
                          = {zh ? '持平' : 'Same'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] font-bold text-[#1a1a2e]/40">{zh ? '击败' : 'Beat'}</div>
                    <div className="text-sm font-black text-emerald-600">{r.percentile.toFixed(1)}%</div>
                  </div>
                  <div className={`text-[#1a1a2e]/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
                    ▼
                  </div>
                </button>

                {/* 展开详情 */}
                {isExpanded && (
                  <div className="border-t-[2px] border-dashed border-[#1a1a2e]/15 p-3 bg-amber-50/50">
                    <div className="text-[10px] font-black text-[#1a1a2e]/50 mb-2">
                      {zh ? '情商五维数据' : 'EQ 5 Dimensions'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.dims.map((d) => (
                        <div
                          key={d.key}
                          className="inline-flex items-center gap-1 bg-white rounded-full px-2 py-1 border-[2px] border-[#1a1a2e]/20"
                        >
                          <span className="text-[10px] font-bold text-[#1a1a2e]/60">
                            {zh ? d.label.zh : d.label.en}
                          </span>
                          <span className="text-[10px] font-black text-[#1a1a2e]">{d.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-[#1a1a2e]/40">
                      {zh ? `完成 ${r.sceneCount} 个场景 · 代号：${r.codename || '匿名'}` : `${r.sceneCount} scenes · Codename: ${r.codename || 'Anonymous'}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
