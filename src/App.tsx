import { useGameStore } from './store/gameStore';
import Home from './pages/Home';
import SceneSelect from './pages/SceneSelect';
import Game from './pages/Game';
import Result from './pages/Result';
import FinalReport from './pages/FinalReport';

export default function App() {
  const { currentPage } = useGameStore();

  // 根据当前页面状态渲染对应组件
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'select':
        return <SceneSelect />;
      case 'game':
        return <Game />;
      case 'result':
        return <Result />;
      case 'report':
        return <FinalReport />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}
