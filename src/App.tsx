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

  // 首次用户交互时初始化音频（浏览器限制：需要用户手势才能播放音频）
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioManager.startBGM();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
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

      {/* 全局静音按钮 */}
      <button
        onClick={() => audioManager.toggleMute()}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-white border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]
                   flex items-center justify-center text-lg font-black transition-transform active:scale-90
                   hover:scale-105"
        title={audioManager.isMuted ? '开启声音' : '静音'}
      >
        {audioManager.isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
