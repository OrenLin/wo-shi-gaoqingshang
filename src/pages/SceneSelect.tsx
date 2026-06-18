import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export default function SceneSelect() {
  const { selectScene, completedScenes, reset } = useGameStore();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCards(true), 80);
    return () => clearTimeout(t);
  }, []);

  const completedIds = new Set(completedScenes.map((r) => r.sceneId));

  const sceneStyles = [
    { bg: 'linear-gradient(135deg,#fecaca 0%, #fca5a5 60%, #f87171 100%)', emoji: '🧨', accent: '#ef4444' },
    { bg: 'linear-gradient(135deg,#fde68a 0%, #fcd34d 60%, #fb923c 100%)', emoji: '💼', accent: '#ea580c' },
    { bg: 'linear-gradient(135deg,#fed7aa 0%, #fdba74 60%, #f97316 100%)', emoji: '🍻', accent: '#c2410c' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4"
         style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)' }}>

      {/* 背景装饰 */}
      <div className="absolute inset-0 manga-stripes opacity-30 pointer-events-none" />
      <div className="absolute top-6 left-4 text-3xl animate-float-gentle opacity-70">⭐</div>
      <div className="absolute top-16 right-6 text-2xl animate-float-gentle opacity-70" style={{ animationDelay: '0.5s' }}>🎈</div>
      <div className="absolute bottom-8 left-8 text-3xl animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-20 right-4 text-2xl animate-float-gentle opacity-70" style={{ animationDelay: '1.5s' }}>🎯</div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* 头部：返回按钮 + 标题 */}
        <div className="flex items-start justify-between mb-6">
          <button
            onClick={reset}
            className="squishy bg-white text-[#1a1a2e] font-black text-sm rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] px-3 py-2"
          >
            ← 返回
          </button>
          <div className="text-right">
            <div className="inline-block bg-[#1a1a2e] text-white text-xs font-black rounded-full px-3 py-1 border-[2px] border-[#1a1a2e]">
              🔥 {completedIds.size} / 3
            </div>
          </div>
        </div>

        {/* 主标题 */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] leading-tight"
              style={{ WebkitTextStroke: '2px #1a1a2e', textShadow: '4px 4px 0 #fbbf24' }}>
            选择你的<span className="text-red-500">社死</span>现场
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
            <span className="text-sm font-bold text-[#1a1a2e]">👉 按顺序挑战，获得你的段位</span>
          </div>
        </div>

        {/* 场景卡片网格 */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-5">
          {scenes.map((scene, index) => {
            const style = sceneStyles[index] || sceneStyles[0];
            const isDone = completedIds.has(scene.id);

            return (
              <div
                key={scene.id}
                className={`relative transition-all duration-700 ease-out
                            ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  animation: showCards ? `pop-in 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 150}ms both` : undefined,
                }}
              >
                <button
                  disabled={isDone}
                  onClick={() => selectScene(index)}
                  className={`squishy relative w-full text-left rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 md:p-6 overflow-hidden ${isDone ? 'cursor-not-allowed' : ''}`}
                  style={{ background: style.bg }}
                >
                  {/* 序号贴纸 */}
                  <div className="absolute -top-3 -left-3 bg-yellow-300 text-[#1a1a2e] font-black text-sm rounded-2xl px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] rotate-[-8deg] z-20">
                    No. {index + 1}
                  </div>

                  {/* 已完成印章 */}
                  {isDone && (
                    <div className="absolute top-6 right-3 z-20">
                      <div className="bg-green-500 text-white font-black text-xs rounded-full border-[3px] border-[#1a1a2e] px-3 py-1 rotate-[15deg] shadow-[2px_2px_0_0_#1a1a2e]">
                        ✓ 已通关
                      </div>
                    </div>
                  )}

                  {/* 主emoji 大图标 */}
                  <div className="relative h-28 md:h-32 flex items-center justify-center mb-3">
                    <div className="text-7xl md:text-8xl animate-float-gentle" style={{ filter: 'drop-shadow(3px 5px 0 rgba(26,26,46,0.2))' }}>
                      {scene.emoji}
                    </div>
                    {/* 小装饰emoji */}
                    <div className="absolute top-1 left-1 text-2xl opacity-80">✨</div>
                    <div className="absolute bottom-2 right-2 text-xl opacity-80">💫</div>
                  </div>

                  {/* 标题 */}
                  <div className="bg-white/90 rounded-2xl p-3 md:p-4 border-[3px] border-[#1a1a2e]">
                    <h3 className="text-lg md:text-xl font-black text-[#1a1a2e] leading-tight">
                      {scene.title}
                    </h3>
                    <p className="text-[13px] text-[#1a1a2e]/70 font-semibold mt-1 leading-snug">
                      {scene.description}
                    </p>

                    {/* 人物标签 */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {scene.characters.slice(0, 3).map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-yellow-100 text-[#1a1a2e] text-[11px] font-bold px-2 py-0.5 rounded-full border-[2px] border-[#1a1a2e]">
                          <span>{c.emoji}</span>
                          <span>{c.name}</span>
                        </span>
                      ))}
                    </div>

                    {/* 开始按钮 */}
                    <div className={`mt-4 ${isDone ? '' : ''}`}>
                      {isDone ? (
                        <div className="w-full text-center py-2 bg-green-100 text-green-700 font-black rounded-xl border-[3px] border-[#1a1a2e]">
                          ✅ 已挑战完成
                        </div>
                      ) : (
                        <div className="w-full text-center py-2 bg-[#1a1a2e] text-white font-black rounded-xl border-[3px] border-[#1a1a2e]">
                          立即挑战 →
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 卡片底部光泽 */}
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/60 rounded-full pointer-events-none" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 底部激励 */}
        {completedIds.size === 3 ? (
          <div className="mt-10 text-center">
            <div className="inline-block bg-gradient-to-b from-yellow-300 to-orange-400 text-[#1a1a2e] font-black text-lg px-6 py-3 rounded-2xl border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e] animate-wiggle">
              🎉 全部通关！你已获得「社交大师」称号
            </div>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 text-[#1a1a2e] font-bold text-sm px-4 py-2 rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]">
              💡 小贴士：越搞笑的回应，情商等级越高哦
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
