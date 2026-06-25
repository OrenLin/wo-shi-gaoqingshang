import { useEffect, useState } from 'react';
import { Analytics, track } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useGameStore } from './store/gameStore';
import { useI18n } from './i18n';
import { audioManager } from './utils/audioManager';
import Home from './pages/Home';
import SceneSelect from './pages/SceneSelect';
import Game from './pages/Game';
import Result from './pages/Result';
import FinalReport from './pages/FinalReport';
import SceneModules from './pages/SceneModules';
import Profile from './pages/Profile';
import Tools from './pages/Tools';
import BottomNav from './components/ui/BottomNav';
import { AccessibilityProvider } from './components/a11y/AccessibilityProvider';
import A11yControlPanel from './components/a11y/A11yControlPanel';

// URL 路径 → 页面映射（支持直接通过 URL 进入工具）
const pathPageMap: Record<string, 'tools'> = {
  '/contemplation': 'tools',
  '/divination': 'tools',
  '/philosophy': 'tools',
  '/anxiety': 'tools',
  '/woodfish': 'tools',
  '/debate': 'tools',
};

export default function App() {
  const { currentPage, setPage } = useGameStore();
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);

  // 初始化时根据 URL 路径设置页面
  useEffect(() => {
    const path = window.location.pathname;
    const targetPage = pathPageMap[path];
    if (targetPage && currentPage !== targetPage) {
      setPage(targetPage);
    }
  }, []);

  // 订阅音频管理器状态变化（用于刷新按钮图标）
  const [audioTick, setAudioTick] = useState(0);
  useEffect(() => {
    return audioManager.subscribe(() => setAudioTick((n) => n + 1));
  }, []);

  // ======================================================================
  //  iOS / 微信音频解锁：audioManager.init() 安装了持久的手势监听器
  //  用户点击右上角音频按钮时才真正解锁
  //  另外 audioManager 内部也会监听 visibilitychange，从后台切回时尝试 resume
  // ======================================================================
  useEffect(() => {
    audioManager.init();
  }, []);

  // 页面切换时发送 tracking 事件
  useEffect(() => {
    track('page_view', { page: currentPage });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':     return <Home />;
      case 'modules':  return <SceneModules />;
      case 'select':   return <SceneSelect />;
      case 'game':     return <Game />;
      case 'result':   return <Result />;
      case 'report':   return <FinalReport />;
      case 'profile':  return <Profile />;
      case 'tools':    return <Tools />;
      default:         return <Home />;
    }
  };

  // 抽签工具由 Tools 内部 activeTool 状态控制渲染（全屏沉浸式），
  // 但当用户从抽签返回时 currentPage 仍是 'tools'，此时 Tools 会重新挂载。
  // 注意：Tools 内部切换到 Divination 时，Divination 使用 fixed 布局，
  // 不能被带 transform 的容器包裹（否则 fixed 失效），所以这里对 tools
  // 页面不做 page-enter 动画包裹。

  // 音频按钮显示的文字 & 状态
  // —— audioTick 确保状态变化时按钮重新渲染
  const audioState = audioManager.state;
  const showAudioHint = !audioState.unlocked;

  return (
    <AccessibilityProvider>
      <div className="App" lang={language === 'zh' ? 'zh-CN' : 'en'}>
        {/* 主内容区域 — role="main" + id="main-content" 是 skip-link 的跳转目标 */}
        <main
          id="main-content"
          role="main"
          className={currentPage === 'tools' ? '' : 'pb-20'}
        >
          {currentPage === 'tools' ? (
            renderPage()
          ) : (
            <div key={currentPage} className="animate-page-enter">
              {renderPage()}
            </div>
          )}
        </main>

        {/* 底部导航栏 */}
        <BottomNav />

        {/* Vercel Analytics：自动统计访问者与页面浏览 */}
        <Analytics />
        {/* Vercel Speed Insights：自动收集 Web Vitals / 性能指标 */}
        <SpeedInsights />

        {/* 无障碍控制中心 — 右下角固定悬浮轮椅按钮 */}
        <A11yControlPanel />

        {/* 全局音频控制按钮 —— 始终可见，用户点击即同步栈内解锁音频 */}
        <button
          onClick={() => {
            // === 关键：在用户手势同步栈内 ===
            if (showAudioHint) {
              // 用户还没解锁过：只解锁+启动BGM，不要toggle！
              audioManager.userTapped();
            } else {
              // 已解锁：正常切换静音状态
              const muted = audioManager.toggle();
              track('audio_toggle', { muted: muted ? 'on' : 'off' });
            }
          }}
          aria-label={
            showAudioHint
              ? language === 'zh'
                ? '点击开启声音'
                : 'Click to enable sound'
              : audioState.muted
                ? language === 'zh'
                  ? '已静音，点击开启声音'
                  : 'Muted. Click to enable sound'
                : language === 'zh'
                  ? '声音已开启，点击静音'
                  : 'Sound on. Click to mute'
          }
          aria-pressed={showAudioHint ? undefined : audioState.muted}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full
                      border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]
                      font-black text-[11px] md:text-sm
                      transition-transform active:scale-90 hover:scale-105
                      ${showAudioHint
                        ? 'bg-yellow-300 animate-wiggle animate-pulse'
                        : audioState.muted
                          ? 'bg-white'
                          : 'bg-emerald-300'}`}
        >
          {showAudioHint ? (
            <>
              <span aria-hidden="true" className="text-lg">🔊</span>
              <span className="text-[#1a1a2e]">{t('audio.enable')}</span>
            </>
          ) : audioState.muted ? (
            <>
              <span aria-hidden="true" className="text-lg">🔇</span>
              <span className="hidden sm:inline text-[#1a1a2e]">{t('audio.muted')}</span>
            </>
          ) : (
            <>
              <span aria-hidden="true" className="text-lg">🎵</span>
              <span className="hidden sm:inline text-[#1a1a2e]">{t('audio.on')}</span>
            </>
          )}
        </button>
      </div>
    </AccessibilityProvider>
  );
}
