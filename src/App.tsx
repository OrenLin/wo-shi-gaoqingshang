import { useEffect } from 'react';
import { Analytics, track } from '@vercel/analytics/react';
import { useGameStore } from './store/gameStore';
import { audioManager } from './utils/audioManager';
import Home from './pages/Home';
import SceneSelect from './pages/SceneSelect';
import Game from './pages/Game';
import Result from './pages/Result';
import FinalReport from './pages/FinalReport';

export default function App() {
  const { currentPage } = useGameStore();

  // ======================================================================
  //  iOS Safari 关键：必须在用户手势的同步调用栈内
  //  创建 + resume AudioContext。首次任意点击/触摸即启动 BGM。
  //  BGM 通过 setInterval 持续调度，页面可见性变化时自动恢复。
  // ======================================================================
  useEffect(() => {
    const initAudio = () => {
      audioManager.ensureReady();
      audioManager.startBGM();
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    // 页面切换到后台后再回来，确保 AudioContext 恢复
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        audioManager.ensureReady();
        if (!audioManager.isMuted && !audioManager.isBgmPlaying) {
          audioManager.startBGM();
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
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

  return (
    <div className="App">
      {renderPage()}
      {/* Vercel Analytics：自动统计访问者与页面浏览 */}
      <Analytics />

      {/* 全局静音按钮 —— 每次点击都调用 ensureReady（避免 iOS 首次点击不认） */}
      <button
        onClick={() => {
          audioManager.ensureReady();
          const muted = audioManager.toggleMute();
          track('audio_toggle', { muted: muted ? 'on' : 'off' });
        }}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-white border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]
                   flex items-center justify-center text-lg font-black transition-transform active:scale-90
                   hover:scale-105"
        title={audioManager.isMuted ? '点击开启声音' : '点击静音'}
      >
        {audioManager.isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
