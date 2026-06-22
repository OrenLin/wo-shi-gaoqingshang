import { useState } from 'react';
import { DEBATE_TECHNIQUES, loadDebateProgress, toggleDebateLearned } from '../../utils/debateSkills';
import { audioManager } from '../../utils/audioManager';
import { useI18n, pickLocalized } from '../../i18n';

export default function DebateSkills() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';
  const [learned, setLearned] = useState<string[]>(loadDebateProgress());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleLearned = (id: string) => {
    audioManager.userTapped();
    audioManager.play('click');
    setLearned(toggleDebateLearned(id));
  };

  const handleExpand = (id: string) => {
    audioManager.userTapped();
    audioManager.play('click');
    setExpandedId(expandedId === id ? null : id);
  };

  const learnedCount = learned.length;
  const totalCount = DEBATE_TECHNIQUES.length;
  const progressPct = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="space-y-4">
      {/* 顶部进度卡片 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 text-white animate-pop-in">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-base font-black mb-1">
              {zh ? '🎯 辩论技巧训练营' : '🎯 Debate Skills Bootcamp'}
            </div>
            <div className="text-[11px] font-bold opacity-90">
              {zh ? '8 个专业技巧，快速提升说服力' : '8 pro techniques, boost persuasion'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black">{learnedCount}/{totalCount}</div>
            <div className="text-[10px] font-bold opacity-75">{zh ? '已学习' : 'Learned'}</div>
          </div>
        </div>
        {/* 进度条 */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-300 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {learnedCount === totalCount && (
          <div className="mt-3 text-center bg-white/20 rounded-xl py-2 animate-pop-in">
            <span className="text-sm font-black">🏆 {zh ? '恭喜！全部技巧已掌握！' : 'Congrats! All mastered!'}</span>
          </div>
        )}
      </div>

      {/* 技巧列表 */}
      <div className="space-y-3">
        {DEBATE_TECHNIQUES.map((tech, idx) => {
          const isLearned = learned.includes(tech.id);
          const isExpanded = expandedId === tech.id;
          return (
            <div
              key={tech.id}
              className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] overflow-hidden animate-pop-in"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              {/* 卡片头部（可点击展开） */}
              <button
                onClick={() => handleExpand(tech.id)}
                className="w-full text-left p-4 flex items-center gap-3"
                aria-expanded={isExpanded}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-full border-[3px] border-[#1a1a2e] flex items-center justify-center text-xl
                  ${isLearned ? 'bg-emerald-400' : 'bg-amber-100'}`}>
                  {isLearned ? '✓' : tech.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-black ${isLearned ? 'text-emerald-700' : 'text-[#1a1a2e]'}`}>
                      {pickLocalized(tech.title, language)}
                    </span>
                    {isLearned && (
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-300">
                        {zh ? '已学' : 'Done'}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-[#1a1a2e]/50">
                    {pickLocalized(tech.category, language)}
                  </div>
                </div>
                <span className={`text-[#1a1a2e]/40 text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              </button>

              {/* 展开内容 */}
              {isExpanded && (
                <div className="border-t-[2px] border-dashed border-[#1a1a2e]/15 p-4 space-y-3 animate-pop-in">
                  {/* 原则 */}
                  <div className="bg-emerald-50 rounded-xl p-3 border-[2px] border-[#1a1a2e]/10">
                    <div className="text-[10px] font-black text-emerald-700 mb-1">
                      📚 {zh ? '核心原则' : 'Principle'}
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed whitespace-pre-line">
                      {pickLocalized(tech.principle, language)}
                    </div>
                  </div>

                  {/* 示例 */}
                  <div className="bg-amber-50 rounded-xl p-3 border-[2px] border-[#1a1a2e]/10">
                    <div className="text-[10px] font-black text-amber-700 mb-1">
                      💬 {zh ? '实战示例' : 'Example'}
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed whitespace-pre-line">
                      {pickLocalized(tech.example, language)}
                    </div>
                  </div>

                  {/* 技巧 */}
                  <div className="bg-sky-50 rounded-xl p-3 border-[2px] border-[#1a1a2e]/10">
                    <div className="text-[10px] font-black text-sky-700 mb-1">
                      💡 {zh ? '实战技巧' : 'Pro Tip'}
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed">
                      {pickLocalized(tech.tip, language)}
                    </div>
                  </div>

                  {/* 标记已学习按钮 */}
                  <button
                    onClick={() => handleToggleLearned(tech.id)}
                    className={`w-full py-2.5 rounded-xl border-[3px] border-[#1a1a2e] font-black text-sm transition-all
                      ${isLearned
                        ? 'bg-white text-[#1a1a2e]/60 hover:bg-rose-50'
                        : 'bg-emerald-400 text-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] hover:-translate-y-0.5 active:translate-y-0'}`}
                  >
                    {isLearned
                      ? (zh ? '↩️ 取消标记' : '↩️ Unmark')
                      : (zh ? '✅ 标记为已掌握' : '✅ Mark as Mastered')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
