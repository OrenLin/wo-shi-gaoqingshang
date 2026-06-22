import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import { getReportHistory, getReportStats } from '../utils/reportStorage';
import { calculateEQCoefficient, getUnlockedCount } from '../utils/eqTrajectory';
import ReportHistory from '../components/profile/ReportHistory';
import EQTrajectory from '../components/profile/EQTrajectory';
import EQPlan from '../components/profile/EQPlan';
import SurveyLink from '../components/ui/SurveyLink';

type Tab = 'history' | 'trajectory' | 'plan';

export default function Profile() {
  const language = useI18n((s) => s.language);
  const codename = useGameStore((s) => s.codename);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';

  const [activeTab, setActiveTab] = useState<Tab>('history');

  const reports = useMemo(() => getReportHistory(), []);
  const stats = useMemo(() => getReportStats(), []);
  const coefficient = useMemo(() => calculateEQCoefficient(reports), [reports]);
  const unlockedTitles = useMemo(() => getUnlockedCount(reports), [reports]);

  const tabs: { key: Tab; emoji: string; label: string }[] = [
    { key: 'history', emoji: '📊', label: zh ? '报告' : 'Reports' },
    { key: 'trajectory', emoji: '📈', label: zh ? '轨迹' : 'Trajectory' },
    { key: 'plan', emoji: '📚', label: zh ? '计划' : 'Plan' },
  ];

  // 成长等级判定
  const getGrowthLevel = (score: number) => {
    if (score >= 85) return { emoji: '👑', label: zh ? '情商之神' : 'EQ Deity', color: 'from-amber-300 to-yellow-400' };
    if (score >= 70) return { emoji: '🧙', label: zh ? '情商达人' : 'EQ Master', color: 'from-violet-300 to-purple-400' };
    if (score >= 50) return { emoji: '🎓', label: zh ? '进阶选手' : 'Adept', color: 'from-sky-300 to-blue-400' };
    if (score >= 30) return { emoji: '🌱', label: zh ? '初出茅庐' : 'Novice', color: 'from-emerald-300 to-teal-400' };
    return { emoji: '🥚', label: zh ? '潜力股' : 'Potential', color: 'from-rose-300 to-pink-400' };
  };
  const growthLevel = getGrowthLevel(coefficient);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* 顶部标题区 */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-black text-[#1a1a2e] flex items-center gap-2">
            <span aria-hidden="true">👤</span>
            {zh ? '个人中心' : 'My Profile'}
          </h1>
          <button
            onClick={() => {
              audioManager.userTapped();
              audioManager.play('click');
              setPage('home');
            }}
            aria-label={zh ? '返回首页' : 'Back to home'}
            className="inline-flex items-center gap-1 bg-white border-[3px] border-[#1a1a2e] rounded-full px-3 py-1.5 shadow-[2px_2px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-transform active:scale-95 hover:scale-105"
          >
            <span aria-hidden="true">←</span>
            {zh ? '首页' : 'Home'}
          </button>
        </div>

        {/* 用户信息卡片 —— 视觉升级 */}
        <div className="relative bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 rounded-[28px] border-[3px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 mb-4 overflow-hidden animate-pop-in">
          {/* 装饰元素 */}
          <div className="absolute top-2 right-3 text-2xl opacity-30 animate-float-gentle" aria-hidden="true">🌟</div>
          <div className="absolute bottom-2 left-3 text-xl opacity-20" aria-hidden="true">💫</div>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-amber-200/40" aria-hidden="true" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-rose-200/30" aria-hidden="true" />

          <div className="relative">
            {/* 头像 + 代号 + 成长等级 */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${growthLevel.color} border-[3px] border-[#1a1a2e] flex items-center justify-center text-3xl flex-shrink-0 shadow-[3px_3px_0_0_#1a1a2e] animate-float-gentle`} aria-hidden="true">
                {growthLevel.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-[#1a1a2e]/50">
                  {zh ? '代号' : 'Codename'}
                </div>
                <div className="text-lg font-black text-[#1a1a2e] truncate">
                  {codename || (zh ? '匿名高手' : 'Anonymous Pro')}
                </div>
                <div className="inline-flex items-center gap-1 mt-0.5 bg-white/80 backdrop-blur-sm text-[10px] font-black text-[#1a1a2e] px-2 py-0.5 rounded-full border-[2px] border-[#1a1a2e]/20">
                  {growthLevel.emoji} {growthLevel.label}
                </div>
              </div>
            </div>

            {/* 统计数据卡片化 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 text-center border-[2px] border-[#1a1a2e]/15 shadow-[2px_2px_0_0_#1a1a2e]/10">
                <div className="text-base mb-0.5" aria-hidden="true">📝</div>
                <div className="text-lg font-black text-amber-600 leading-none">{stats.totalCount}</div>
                <div className="text-[9px] font-bold text-[#1a1a2e]/50 mt-0.5">{zh ? '测评' : 'Tests'}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 text-center border-[2px] border-[#1a1a2e]/15 shadow-[2px_2px_0_0_#1a1a2e]/10">
                <div className="text-base mb-0.5" aria-hidden="true">🧠</div>
                <div className="text-lg font-black text-indigo-600 leading-none">{coefficient}</div>
                <div className="text-[9px] font-bold text-[#1a1a2e]/50 mt-0.5">{zh ? '情商系数' : 'EQ Score'}</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 text-center border-[2px] border-[#1a1a2e]/15 shadow-[2px_2px_0_0_#1a1a2e]/10">
                <div className="text-base mb-0.5" aria-hidden="true">🏆</div>
                <div className="text-lg font-black text-emerald-600 leading-none">{unlockedTitles}</div>
                <div className="text-[9px] font-bold text-[#1a1a2e]/50 mt-0.5">{zh ? '称号' : 'Titles'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 切换 —— 3 Tab + 弹簧动画 */}
        <div className="mb-4 bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-1.5">
          <div className="grid grid-cols-3 gap-1" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => {
                  audioManager.userTapped();
                  audioManager.play('click');
                  setActiveTab(tab.key);
                }}
                className={`relative flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl border-[2px] transition-all duration-300
                  ${activeTab === tab.key
                    ? 'bg-amber-300 border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] -translate-y-[2px]'
                    : 'bg-white border-transparent hover:bg-amber-50'
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                aria-pressed={activeTab === tab.key}
              >
                <span
                  className={`text-lg transition-transform duration-300 ${activeTab === tab.key ? 'scale-125' : ''}`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  aria-hidden="true"
                >
                  {tab.emoji}
                </span>
                <span className={`text-[10px] font-black whitespace-nowrap ${activeTab === tab.key ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/40'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 内容 —— 带滑入动画 */}
        <div key={activeTab} className="mb-4 animate-slide-in-right">
          {activeTab === 'history' && <ReportHistory />}
          {activeTab === 'trajectory' && <EQTrajectory />}
          {activeTab === 'plan' && <EQPlan />}
        </div>

        {/* 问卷链接 */}
        <SurveyLink variant="full" />
      </div>
    </div>
  );
}
