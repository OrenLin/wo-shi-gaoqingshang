import { useEffect } from 'react';
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
  //  iOS Safari 关键：必须在用户手势（click/touch）的同步调用栈内
  //  创建 + resume AudioContext。首次任意点击都会同步启动音频。
  // ======================================================================
  useEffect(() => {
    const initAudio = () => {
      audioManager.ensureReady();      // 同步：创建/恢复 AudioContext（iOS 核心）
      audioManager.startBGM();          // 同步：调度 BGM 音符
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

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

      {/* 全局静音按钮 —— 每次点击都调用 ensureReady（避免 iOS 首次点击不认） */}
      <button
        onClick={() => {
          audioManager.ensureReady();
          audioManager.toggleMute();
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
