import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export default function Result() {
  const { completedScenes, goToNextScene, getCurrentScene } = useGameStore();
  const [showResult, setShowResult] = useState(false);

  const latestResult = completedScenes[completedScenes.length - 1];
  const currentScene = getCurrentScene();

  useEffect(() => {
    const timer = setTimeout(() => setShowResult(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!latestResult || !currentScene) {
    return <div>加载中...</div>;
  }

  const { result, selectedOptionId, customInput, score } = latestResult;
  const selectedOption = currentScene.options.find(o => o.id === selectedOptionId);

  const levelColors = {
    anti: 'from-orange-500 to-red-600',
    god: 'from-yellow-400 to-orange-500',
    high: 'from-green-400 to-emerald-500',
    medium: 'from-yellow-400 to-amber-500',
    low: 'from-red-400 to-rose-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 结果卡片 */}
        <div
          className={`bg-white rounded-3xl p-8 shadow-2xl mb-6 transition-all duration-700 ${
            showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* 分数展示 */}
          <div className="text-center mb-8">
            <div className={`inline-flex px-8 py-4 rounded-2xl bg-gradient-to-br ${levelColors[result.level.name === '抗压之王' ? 'anti' : result.level.name === '情商之神' ? 'god' : result.level.name === '情商达人' ? 'high' : result.level.name === '及格选手' ? 'medium' : 'low']} text-white shadow-lg mb-4`}>
              <div className="text-6xl mr-4">{result.level.emoji}</div>
              <div className="text-left">
                <div className="text-sm opacity-90 mb-1">情商评分</div>
                <div className="text-5xl font-bold">{score}分</div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {result.level.name}
            </h3>
            <p className="text-gray-600">{result.level.description}</p>
          </div>

          {/* 点评 */}
          <div className="bg-purple-50 rounded-xl p-6 mb-6">
            <div className="text-3xl mb-3 text-center">💬</div>
            <p className="text-gray-700 text-center leading-relaxed font-medium">
              {result.comment}
            </p>
          </div>

          {/* 小贴士 */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="text-2xl mb-2 text-center">💡</div>
            <p className="text-gray-700 text-center text-sm">
              {result.tips}
            </p>
          </div>

          {/* 用户回答 */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              你的回答：
            </h4>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
              {customInput || selectedOption?.content}
            </div>
          </div>

          {/* 高情商示范（如果是低分） */}
          {result.level.name === '社交杀手' && (
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-purple-700 mb-3">
                👑 情商之神会这么说：
              </h4>
              <p className="text-gray-700">
                {currentScene.options.find(o => o.level === 'god')?.content}
              </p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          {completedScenes.length < 3 ? (
            <>
              <button
                onClick={goToNextScene}
                className="w-full py-4 bg-white text-purple-700 rounded-xl text-xl font-bold
                         hover:bg-purple-100 transition-all shadow-xl"
              >
                继续挑战下一个场景 →
              </button>
              <button
                onClick={() => useGameStore.getState().setPage('select')}
                className="w-full py-3 bg-white/20 text-white rounded-xl font-medium
                         hover:bg-white/30 transition-all"
              >
                返回场景选择
              </button>
            </>
          ) : (
            <>
              <button
                onClick={goToNextScene}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white
                         rounded-xl text-xl font-bold hover:opacity-90 transition-all shadow-xl"
              >
                🎉 查看我的情商鉴定报告
              </button>
              <button
                onClick={() => useGameStore.getState().setPage('select')}
                className="w-full py-3 bg-white/20 text-white rounded-xl font-medium
                         hover:bg-white/30 transition-all"
              >
                返回场景选择
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
