import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import { getReportHistory, getReportStats } from '../utils/reportStorage';
import { calculateEQCoefficient, getUnlockedCount } from '../utils/eqTrajectory';
import ReportHistory from '../components/profile/ReportHistory';
import EQTrajectory from '../components/profile/EQTrajectory';
import PersonalAdvice from '../components/profile/PersonalAdvice';
import SurveyLink from '../components/ui/SurveyLink';

type Tab = 'history' | 'trajectory' | 'advice';

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
    { key: 'history', emoji: '📊', label: zh ? '报告历史' : 'Reports' },
    { key: 'trajectory', emoji: '📈', label: zh ? '情商轨迹' : 'Trajectory' },
    { key: 'advice', emoji: '💡', label: zh ? '个性化建议' : 'Advice' },
  ];

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

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-4 mb-4 animate-pop-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-[3px] border-[#1a1a2e] flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
              🧑
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-[#1a1a2e]/50">
                {zh ? '代号' : 'Codename'}
              </div>
              <div className="text-lg font-black text-[#1a1a2e] truncate">
                {codename || (zh ? '匿名高手' : 'Anonymous Pro')}
              </div>
            </div>
          </div>
          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t-[2px] border-dashed border-[#1a1a2e]/15">
            <div className="text-center">
              <div className="text-xl font-black text-amber-600">{stats.totalCount}</div>
              <div className="text-[9px] font-bold text-[#1a1a2e]/50">{zh ? '测评次数' : 'Tests'}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-indigo-600">{coefficient}</div>
              <div className="text-[9px] font-bold text-[#1a1a2e]/50">{zh ? '情商系数' : 'EQ Score'}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-emerald-600">{unlockedTitles}</div>
              <div className="text-[9px] font-bold text-[#1a1a2e]/50">{zh ? '称号' : 'Titles'}</div>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-1.5 mb-4 bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                audioManager.userTapped();
                audioManager.play('click');
                setActiveTab(tab.key);
              }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border-[2px] transition-all ${
                activeTab === tab.key
                  ? 'bg-amber-300 border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]'
                  : 'bg-white border-transparent'
              }`}
              aria-pressed={activeTab === tab.key}
            >
              <span className="text-lg" aria-hidden="true">{tab.emoji}</span>
              <span className={`text-[10px] font-black ${activeTab === tab.key ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/40'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 内容 */}
        <div className="mb-4">
          {activeTab === 'history' && <ReportHistory />}
          {activeTab === 'trajectory' && <EQTrajectory />}
          {activeTab === 'advice' && <PersonalAdvice />}
        </div>

        {/* 问卷链接 */}
        <SurveyLink variant="full" />
      </div>
    </div>
  );
}
