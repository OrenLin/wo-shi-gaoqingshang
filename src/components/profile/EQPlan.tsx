import { useState, useEffect } from 'react';
import {
  PLAN_STAGES,
  loadPlanProgress,
  toggleTask,
  resetPlan,
  getStageProgress,
  getOverallProgress,
  getAllTaskIds,
  type PlanStage,
} from '../../utils/eqPlan';
import { audioManager } from '../../utils/audioManager';
import { useI18n, pickLocalized } from '../../i18n';

export default function EQPlan() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';
  const [progress, setProgress] = useState(loadPlanProgress());
  const [expandedStage, setExpandedStage] = useState<string | null>(PLAN_STAGES[0]?.id ?? null);

  // 刷新进度
  const refresh = () => setProgress(loadPlanProgress());

  const overall = getOverallProgress();

  const handleToggle = (stageId: string, taskId: string) => {
    audioManager.userTapped();
    audioManager.play('click');
    toggleTask(stageId, taskId);
    refresh();
  };

  const handleReset = () => {
    if (!confirm(zh ? '确定要重置整个计划吗？所有打卡记录将清空。' : 'Reset the entire plan? All check-in records will be cleared.')) return;
    audioManager.userTapped();
    audioManager.play('click');
    resetPlan();
    refresh();
  };

  // 计算环形进度
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall.pct / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* 顶部总进度卡片 */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 text-white animate-pop-in">
        <div className="flex items-center gap-4">
          {/* 环形进度图 */}
          <div className="relative flex-shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
              <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r={radius} fill="none" stroke="#fbbf24" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black">{overall.pct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-black mb-1">
              {zh ? '📚 情商提升计划' : '📚 EQ Improvement Plan'}
            </div>
            <div className="text-xs font-bold opacity-90 mb-2">
              {zh ? `约 4 周 · ${overall.doneStages}/${overall.totalStages} 阶段完成` : `~4 weeks · ${overall.doneStages}/${overall.totalStages} stages done`}
            </div>
            <div className="text-[11px] font-bold opacity-75">
              {zh ? `已完成 ${overall.doneTasks}/${overall.totalTasks} 项任务` : `${overall.doneTasks}/${overall.totalTasks} tasks completed`}
            </div>
          </div>
        </div>
      </div>

      {/* 阶段列表（时间线布局） */}
      <div className="relative">
        {/* 左侧时间线竖线 */}
        <div className="absolute left-[22px] top-2 bottom-2 w-[3px] bg-[#1a1a2e]/15" aria-hidden="true" />

        <div className="space-y-3">
          {PLAN_STAGES.map((stage, idx) => {
            const stageProgress = getStageProgress(stage.id);
            const isCompleted = progress.completedStages.includes(stage.id);
            const isExpanded = expandedStage === stage.id;
            const stageState: 'done' | 'active' | 'pending' = isCompleted
              ? 'done'
              : stageProgress.done > 0
              ? 'active'
              : 'pending';

            return (
              <div
                key={stage.id}
                className="relative pl-12 animate-pop-in"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* 时间线圆点 */}
                <div
                  className={`absolute left-0 top-3 w-11 h-11 rounded-full border-[3px] border-[#1a1a2e] flex items-center justify-center text-lg font-black shadow-[2px_2px_0_0_#1a1a2e]
                    ${stageState === 'done' ? 'bg-emerald-400 text-white' : stageState === 'active' ? 'bg-amber-300 text-[#1a1a2e] animate-pulse' : 'bg-white text-[#1a1a2e]/40'}`}
                  aria-hidden="true"
                >
                  {stageState === 'done' ? '✓' : stage.emoji}
                </div>

                {/* 阶段卡片 */}
                <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] overflow-hidden">
                  <button
                    onClick={() => {
                      audioManager.userTapped();
                      audioManager.play('click');
                      setExpandedStage(isExpanded ? null : stage.id);
                    }}
                    className="w-full text-left p-4"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-sm text-[#1a1a2e]">
                        {pickLocalized(stage.title, language)}
                      </span>
                      <span className="text-[10px] font-black bg-amber-200 text-[#1a1a2e] px-2 py-0.5 rounded-full border-[2px] border-[#1a1a2e] flex-shrink-0">
                        {pickLocalized(stage.duration, language)}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/60 mb-2">
                      {pickLocalized(stage.description, language)}
                    </div>
                    {/* 阶段进度条 */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                          style={{ width: `${stageProgress.pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-[#1a1a2e]/60 flex-shrink-0">
                        {stageProgress.done}/{stageProgress.total}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border-[2px] border-emerald-300">
                        ✅ {zh ? '阶段已完成' : 'Stage Complete'}
                      </div>
                    )}
                  </button>

                  {/* 展开内容 */}
                  {isExpanded && (
                    <div className="border-t-[2px] border-dashed border-[#1a1a2e]/15 p-4 space-y-3 animate-pop-in">
                      {/* 理论基础 */}
                      <div className="bg-purple-50 rounded-xl p-3 border-[2px] border-[#1a1a2e]/15">
                        <div className="text-[10px] font-black text-purple-700 mb-1">
                          {zh ? '🎓 理论基础' : '🎓 Theory'}
                        </div>
                        <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed">
                          {pickLocalized(stage.theory, language)}
                        </div>
                      </div>

                      {/* 书籍任务 */}
                      <div>
                        <div className="text-[11px] font-black text-[#1a1a2e] mb-2">
                          📖 {zh ? '专业书籍' : 'Books'}
                        </div>
                        <div className="space-y-2">
                          {stage.books.map((book, i) => {
                            const taskId = `book-${i}`;
                            const done = progress.tasks[`${stage.id}:${taskId}`];
                            return (
                              <TaskItem
                                key={taskId}
                                done={!!done}
                                onToggle={() => handleToggle(stage.id, taskId)}
                                emoji="📖"
                                title={pickLocalized(book.title, language)}
                                subtitle={`${pickLocalized(book.author, language)} · ${pickLocalized(book.category, language)}`}
                                desc={pickLocalized(book.why, language)}
                                zh={zh}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* 影视推荐 */}
                      <div>
                        <div className="text-[11px] font-black text-[#1a1a2e] mb-2">
                          🎬 {zh ? '影视推荐' : 'Media'}
                        </div>
                        <div className="space-y-2">
                          {stage.media.map((m, i) => {
                            const taskId = `media-${i}`;
                            const done = progress.tasks[`${stage.id}:${taskId}`];
                            return (
                              <TaskItem
                                key={taskId}
                                done={!!done}
                                onToggle={() => handleToggle(stage.id, taskId)}
                                emoji={m.type === 'movie' ? '🎥' : '📺'}
                                title={pickLocalized(m.title, language)}
                                subtitle={m.type === 'movie' ? (zh ? '电影' : 'Movie') : (zh ? '电视剧' : 'TV Series')}
                                desc={pickLocalized(m.why, language)}
                                zh={zh}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* 实践目标 */}
                      <div>
                        <div className="text-[11px] font-black text-[#1a1a2e] mb-2">
                          🎯 {zh ? '实践目标' : 'Goals'}
                        </div>
                        <div className="space-y-2">
                          {stage.goals.map((g, i) => {
                            const taskId = `goal-${i}`;
                            const done = progress.tasks[`${stage.id}:${taskId}`];
                            return (
                              <TaskItem
                                key={taskId}
                                done={!!done}
                                onToggle={() => handleToggle(stage.id, taskId)}
                                emoji="🎯"
                                title={pickLocalized(g, language)}
                                zh={zh}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={handleReset}
        className="w-full py-2 text-[11px] font-bold text-[#1a1a2e]/50 hover:text-rose-600 transition-colors"
      >
        🔄 {zh ? '重置计划' : 'Reset Plan'}
      </button>
    </div>
  );
}

interface TaskItemProps {
  done: boolean;
  onToggle: () => void;
  emoji: string;
  title: string;
  subtitle?: string;
  desc?: string;
  zh: boolean;
}

function TaskItem({ done, onToggle, emoji, title, subtitle, desc, zh }: TaskItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-3 rounded-xl border-[2px] transition-all flex items-start gap-2
        ${done
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-white border-[#1a1a2e]/15 hover:border-[#1a1a2e]/40'}`}
    >
      <div className={`flex-shrink-0 w-5 h-5 rounded-md border-[2px] border-[#1a1a2e] flex items-center justify-center text-[10px] font-black
        ${done ? 'bg-emerald-400 text-white' : 'bg-white text-transparent'}`}>
        ✓
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[12px] font-black leading-tight ${done ? 'text-emerald-700 line-through' : 'text-[#1a1a2e]'}`}>
          <span className="mr-1">{emoji}</span>{title}
        </div>
        {subtitle && (
          <div className="text-[10px] font-bold text-[#1a1a2e]/50 mt-0.5">{subtitle}</div>
        )}
        {desc && (
          <div className="text-[10px] font-bold text-[#1a1a2e]/60 mt-1 leading-relaxed">{desc}</div>
        )}
      </div>
    </button>
  );
}
