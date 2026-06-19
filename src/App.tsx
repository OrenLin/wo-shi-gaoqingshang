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

export default function App() {
  const { currentPage } = useGameStore();
  const t = useI18n((s) => s.t);

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
      case 'select':   return <SceneSelect />;
      case 'game':     return <Game />;
      case 'result':   return <Result />;
      case 'report':   return <FinalReport />;
      default:         return <Home />;
    }
  };

  // 音频按钮显示的文字 & 状态
  // —— audioTick 确保状态变化时按钮重新渲染
  const audioState = audioManager.state;
  const showAudioHint = !audioState.unlocked;

  return (
    <div className="App">
      {renderPage()}
      {/* Vercel Analytics：自动统计访问者与页面浏览 */}
      <Analytics />
      {/* Vercel Speed Insights：自动收集 Web Vitals / 性能指标 */}
      <SpeedInsights />

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
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full
                    border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]
                    font-black text-[11px] md:text-sm
                    transition-transform active:scale-90 hover:scale-105
                    ${showAudioHint
                      ? 'bg-yellow-300 animate-wiggle animate-pulse'
                      : audioState.muted
                        ? 'bg-white'
                        : 'bg-emerald-300'}`}
        title={audioState.muted ? t('audio.enable') : t('audio.muted')}
      >
        {showAudioHint ? (
          <>
            <span className="text-lg">🔊</span>
            <span className="text-[#1a1a2e]">{t('audio.enable')}</span>
          </>
        ) : audioState.muted ? (
          <>
            <span className="text-lg">🔇</span>
            <span className="hidden sm:inline text-[#1a1a2e]">{t('audio.muted')}</span>
          </>
        ) : (
          <>
            <span className="text-lg">🎵</span>
            <span className="hidden sm:inline text-[#1a1a2e]">{t('audio.on')}</span>
          </>
        )}
      </button>
    </div>
  );
}
