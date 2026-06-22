import { useGameStore, type PageName } from '../../store/gameStore';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';

export default function BottomNav() {
  const currentPage = useGameStore((s) => s.currentPage);
  const setPage = useGameStore((s) => s.setPage);
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);
  const zh = language === 'zh';

  // 判断当前高亮的 Tab
  // home → 首页
  // modules/select/game/result/report → 场景
  // profile → 我的
  const getActiveTab = (): 'home' | 'scenes' | 'profile' => {
    if (currentPage === 'home') return 'home';
    if (currentPage === 'profile') return 'profile';
    return 'scenes'; // modules, select, game, result, report
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: 'home' | 'scenes' | 'profile') => {
    audioManager.userTapped();
    audioManager.play('click');
    if (tab === 'home') setPage('home');
    else if (tab === 'scenes') setPage('modules');
    else setPage('profile');
  };

  const tabs = [
    { key: 'home' as const, icon: '🏠', label: zh ? '首页' : 'Home', target: 'home' as PageName },
    { key: 'scenes' as const, icon: '🎯', label: zh ? '场景' : 'Scenes', target: 'modules' as PageName },
    { key: 'profile' as const, icon: '👤', label: zh ? '我的' : 'Me', target: 'profile' as PageName },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[3px] border-[#1a1a2e] shadow-[0_-3px_0_0_#1a1a2e]"
      role="navigation"
      aria-label={zh ? '主导航' : 'Main navigation'}
    >
      <div className="flex items-stretch justify-around max-w-md mx-auto px-2 py-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg border-[3px] transition-all
                ${isActive
                  ? 'bg-amber-300 border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] -translate-y-[2px]'
                  : 'bg-white border-transparent hover:bg-amber-50'
                }`}
            >
              <span aria-hidden="true" className={`text-xl leading-none ${isActive ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-black ${isActive ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/50'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
