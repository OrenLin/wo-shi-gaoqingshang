import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export default function FinalReport() {
  const { getFinalReport, reset } = useGameStore();
  const [showReport, setShowReport] = useState(false);

  const report = getFinalReport();

  useEffect(() => {
    const timer = setTimeout(() => setShowReport(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const levelColors = {
    '抗压之王': 'from-orange-500 to-red-600',
    '情商之神': 'from-yellow-400 to-orange-500',
    '情商达人': 'from-green-400 to-emerald-500',
    '及格选手': 'from-yellow-400 to-amber-500',
    '社交杀手': 'from-red-400 to-rose-500'
  };

  const handleShare = () => {
    // 生成分享文案
    const shareText = `我在"我是高情商"挑战中获得 ${report.averageScore} 分，段位：${report.level.name} ${report.level.emoji}！你也来试试？`;

    // 尝试复制到剪贴板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('分享文案已复制到剪贴板！');
      });
    } else {
      alert(shareText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 主报告卡片 */}
        <div
          className={`bg-white rounded-3xl p-8 shadow-2xl mb-6 transition-all duration-700 ${
            showReport ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🧠</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              情商鉴定报告
            </h2>
            <p className="text-gray-600">恭喜完成所有挑战！</p>
          </div>

          {/* 综合评分 */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex px-8 py-6 rounded-2xl bg-gradient-to-br ${levelColors[report.level.name]} text-white shadow-lg mb-4`}
            >
              <div className="text-7xl mr-6">{report.level.emoji}</div>
              <div className="text-left">
                <div className="text-sm opacity-90 mb-1">综合情商评分</div>
                <div className="text-6xl font-bold">{report.averageScore}</div>
                <div className="text-sm opacity-90 mt-1">总分 {report.totalScore}</div>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {report.level.name}
            </h3>
            <p className="text-gray-600">{report.level.description}</p>
          </div>

          {/* 各场景得分 */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
              各场景表现
            </h4>
            <div className="space-y-4">
              {report.scenes.map((sceneResult, index) => {
                const scene = scenes.find(s => s.id === sceneResult.sceneId);
                return (
                  <div
                    key={sceneResult.sceneId}
                    className="bg-gray-50 rounded-xl p-4"
                    style={{
                      transitionDelay: `${index * 200}ms`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{scene?.emoji}</span>
                        <span className="font-bold text-gray-800">
                          {scene?.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{sceneResult.level.emoji}</span>
                        <span className="text-2xl font-bold text-purple-700">
                          {sceneResult.score}分
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          sceneResult.score === 100
                            ? 'bg-gradient-to-r from-orange-500 to-red-600'
                            : sceneResult.score >= 90
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : sceneResult.score >= 70
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                            : sceneResult.score >= 40
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                        style={{
                          width: showReport ? `${sceneResult.score}%` : '0%',
                          transitionDelay: `${index * 200 + 500}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 激励文案 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
            <p className="text-gray-700 font-medium">
              {report.averageScore === 100
                ? '🔥 抗压之王！整顿职场，拒绝内耗！老板听了都想打人！💪'
                : report.averageScore >= 90
                ? '🎉 太厉害了！你就是社交天花板！'
                : report.averageScore >= 70
                ? '💪 很不错！继续保持，你离情商之神不远了！'
                : report.averageScore >= 40
                ? '📚 还有进步空间，多练练你也能成为高情商达人！'
                : '🤝 别灰心，情商是可以学习的，下次一定会更好！'}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white
                     rounded-xl text-xl font-bold hover:opacity-90 transition-all shadow-xl"
          >
            📤 分享给好友挑战
          </button>

          <button
            onClick={reset}
            className="w-full py-4 bg-white text-purple-700 rounded-xl text-xl font-bold
                     hover:bg-purple-100 transition-all shadow-xl"
          >
            🔄 重新挑战
          </button>

          <p className="text-center text-purple-100 text-sm">
            感谢参与"我是高情商"挑战！
          </p>
        </div>
      </div>
    </div>
  );
}
