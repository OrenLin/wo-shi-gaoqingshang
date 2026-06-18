import { useGameStore } from '../store/gameStore';
import { scenes } from '../data';
import SceneCard from '../components/scene/SceneCard';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';

export default function SceneSelect() {
  const { selectScene, reset, getCompletedSceneIds } = useGameStore();
  const completedIds = getCompletedSceneIds();

  return (
    <div
      className="min-h-screen relative overflow-hidden py-8 px-4"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)' }}
    >
      <div className="absolute inset-0 manga-stripes opacity-30 pointer-events-none" />
      <FloatingEmojis
        items={[
          { emoji: '✨', top: '4%', left: '5%', delay: '0s' },
          { emoji: '🎉', top: '10%', right: '6%', delay: '0.4s', size: '2rem' },
          { emoji: '💫', bottom: '10%', left: '8%', delay: '0.8s' },
          { emoji: '🎯', bottom: '15%', right: '5%', delay: '1.2s', size: '2rem' },
        ]}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* 顶栏 */}
        <div className="flex items-start justify-between mb-6">
          <MangaButton variant="secondary" onClick={reset} className="!py-2 !px-4 !text-sm">← 首页</MangaButton>
          <div className="bg-[#1a1a2e] text-white text-xs font-black rounded-full px-3 py-1 border-[3px] border-[#1a1a2e]">
            🔥 已完成 {completedIds.size} / {scenes.length}
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] leading-tight"
              style={{ WebkitTextStroke: '2px #1a1a2e', textShadow: '4px 4px 0 #fbbf24' }}>
            选择你的<span className="text-red-500">社死</span>现场
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
            <span className="text-sm font-bold text-[#1a1a2e]">👉 按顺序挑战，解锁你的最终段位</span>
          </div>
        </div>

        {/* 场景卡网格 */}
        <div className="grid md:grid-cols-3 gap-6">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="animate-pop-in" style={{ animationDelay: `${index * 120}ms` }}>
              <SceneCard
                scene={scene}
                index={index}
                completed={completedIds.has(scene.id)}
                onClick={() => selectScene(index)}
              />
            </div>
          ))}
        </div>

        {/* 全部完成激励 */}
        {completedIds.size === scenes.length && (
          <div className="mt-10 text-center">
            <div className="inline-block bg-gradient-to-b from-yellow-300 to-orange-400 text-[#1a1a2e] font-black text-base md:text-lg px-6 py-3 rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] animate-wiggle">
              🎉 全部通关！你的社交段位已生成
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
