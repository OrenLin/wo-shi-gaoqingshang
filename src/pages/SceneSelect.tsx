import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export default function SceneSelect() {
  const { selectScene, completedScenes } = useGameStore();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const completedSceneIds = completedScenes.map(r => r.sceneId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            选择挑战场景
          </h2>
          <p className="text-purple-100">
            已有 {completedSceneIds.length}/3 个场景完成
          </p>
        </div>

        {/* 场景卡片 */}
        <div className="grid md:grid-cols-3 gap-6">
          {scenes.map((scene, index) => {
            const isCompleted = completedSceneIds.includes(scene.id);

            return (
              <div
                key={scene.id}
                className={`bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl
                           hover:shadow-2xl transition-all duration-500 cursor-pointer
                           hover:scale-105 ${isCompleted ? 'opacity-70' : ''}
                           ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 0.15}s`
                }}
                onClick={() => !isCompleted && selectScene(index)}
              >
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
                    ✓
                  </div>
                )}

                {/* 场景图标 */}
                <div className="text-6xl mb-4 text-center">
                  {scene.emoji}
                </div>

                {/* 场景标题 */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {scene.title}
                </h3>

                {/* 场景描述 */}
                <p className="text-gray-600 text-sm text-center mb-4">
                  {scene.description}
                </p>

                {/* 人物标签 */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {scene.characters.map((char, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                    >
                      {char.emoji} {char.name}
                    </span>
                  ))}
                </div>

                {/* 状态标签 */}
                <div className="text-center">
                  {isCompleted ? (
                    <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                      ✓ 已完成
                    </span>
                  ) : (
                    <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      立即挑战 →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 进度提示 */}
        {completedSceneIds.length > 0 && completedSceneIds.length < 3 && (
          <div className="mt-8 text-center">
            <p className="text-purple-100 text-sm">
              完成所有场景，解锁你的情商鉴定报告 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
