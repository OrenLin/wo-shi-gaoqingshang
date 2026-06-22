import { useGameStore, type PageName } from '../../store/gameStore';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';

type TabKey = 'home' | 'scenes' | 'tools' | 'profile';

export default function BottomNav() {
  const currentPage = useGameStore((s) => s.currentPage);
  const setPage = useGameStore((s) => s.setPage);
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';

  // 判断当前高亮的 Tab
  const getActiveTab = (): TabKey => {
    if (currentPage === 'home') return 'home';
    if (currentPage === 'profile') return 'profile';
    if (currentPage === 'tools') return 'tools';
    return 'scenes'; // modules, select, game, result, report
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: TabKey) => {
    audioManager.userTapped();
    audioManager.play('click');
    if (tab === 'home') setPage('home');
    else if (tab === 'scenes') setPage('modules');
    else if (tab === 'tools') setPage('tools');
    else setPage('profile');
  };

  const tabs: { key: TabKey; icon: string; label: string; target: PageName }[] = [
    { key: 'home', icon: '🏠', label: zh ? '首页' : 'Home', target: 'home' },
    { key: 'scenes', icon: '🎯', label: zh ? '场景' : 'Scenes', target: 'modules' },
    { key: 'tools', icon: '🧰', label: zh ? '工具' : 'Tools', target: 'tools' },
    { key: 'profile', icon: '👤', label: zh ? '我的' : 'Me', target: 'profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[3px] border-[#1a1a2e] shadow-[0_-3px_0_0_#1a1a2e]"
      role="navigation"
      aria-label={zh ? '主导航' : 'Main navigation'}
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto px-2 py-1"
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
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg border-[3px] transition-all duration-300
                ${isActive
                  ? 'bg-amber-300 border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] -translate-y-[3px]'
                  : 'bg-white border-transparent hover:bg-amber-50'
                }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <span
                aria-hidden="true"
                className={`text-xl leading-none transition-transform duration-300 ${isActive ? 'scale-125 rotate-3' : ''}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                {tab.icon}
              </span>
              <span className={`text-[10px] font-black ${isActive ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/50'}`}>
                {tab.label}
              </span>
              {/* 激活指示条 */}
              {isActive && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pop-in"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
