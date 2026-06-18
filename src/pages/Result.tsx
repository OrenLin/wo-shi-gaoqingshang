import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export default function Result() {
  const { completedScenes, goToNextScene, getCurrentScene } = useGameStore();
  const [show, setShow] = useState(false);

  const latest = completedScenes[completedScenes.length - 1];
  const currentScene = getCurrentScene();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!latest || !currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(180deg,#fef3c7 0%, #fbbf24 100%)' }}>
        <div className="text-6xl animate-bounce">🎴</div>
      </div>
    );
  }

  const { result, selectedOptionId, customInput, score } = latest;
  const selectedOption = currentScene.options.find((o) => o.id === selectedOptionId);

  const levelConfig = {
    '抗压之王': { emoji: '🔥', gradient: 'from-red-500 via-orange-500 to-red-600', bg: 'linear-gradient(135deg,#fecaca 0%, #f87171 60%, #ef4444 100%)', desc: '整顿职场，拒绝内耗！老板听了都沉默...' },
    '情商之神': { emoji: '👑', gradient: 'from-yellow-300 via-amber-400 to-orange-500', bg: 'linear-gradient(135deg,#fef9c3 0%, #fde047 60%, #eab308 100%)', desc: '社交天花板，行走的人际关系教科书！' },
    '情商达人': { emoji: '😎', gradient: 'from-teal-400 via-emerald-500 to-green-600', bg: 'linear-gradient(135deg,#ccfbf1 0%, #6ee7b7 60%, #10b981 100%)', desc: '八面玲珑，大多数场合游刃有余～' },
    '及格选手': { emoji: '😅', gradient: 'from-yellow-400 via-amber-500 to-orange-500', bg: 'linear-gradient(135deg,#fef3c7 0%, #fcd34d 60%, #f59e0b 100%)', desc: '不功不过，偶尔踩雷，再接再厉！' },
    '社交杀手': { emoji: '💀', gradient: 'from-gray-500 via-gray-600 to-gray-700', bg: 'linear-gradient(135deg,#e5e7eb 0%, #9ca3af 60%, #4b5563 100%)', desc: '建议闭关修炼，先从微笑开始...' },
  };

  const config = levelConfig[result.level.name as keyof typeof levelConfig] || levelConfig['及格选手'];

  const nextSceneIndex = scenes.findIndex((s) => s.id === currentScene.id) + 1;
  const hasNext = nextSceneIndex < scenes.length;

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4"
         style={{ background: config.bg }}>

      {/* 装饰 */}
      <div className="absolute inset-0 manga-stripes opacity-20 pointer-events-none" />
      <div className="absolute top-10 left-5 text-4xl opacity-60 animate-float-gentle">✨</div>
      <div className="absolute top-20 right-8 text-3xl opacity-60 animate-float-gentle" style={{ animationDelay: '0.5s' }}>🎉</div>
      <div className="absolute bottom-16 left-10 text-3xl opacity-60 animate-float-gentle" style={{ animationDelay: '1s' }}>💫</div>
      <div className="absolute bottom-24 right-6 text-4xl opacity-60 animate-float-gentle" style={{ animationDelay: '1.5s' }}>🎯</div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* 场景标签 */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
            <span className="text-xl">{currentScene.emoji}</span>
            <span className="font-black text-sm text-[#1a1a2e]">{currentScene.title} · 挑战完成！</span>
          </div>
        </div>

        {/* 主结果卡片 */}
        <div className={`bg-white rounded-[32px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] p-6 md:p-8 mb-5 transition-all duration-700 relative overflow-hidden
                        ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          {/* 分数徽章 */}
          <div className="text-center mb-5">
            <div className={`inline-block relative bg-gradient-to-br ${config.gradient} text-white
                            rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e]
                            px-6 md:px-10 py-5 md:py-6 animate-pop-in`}>
              <div className="text-7xl md:text-8xl leading-none mb-2 font-black drop-shadow-md"
                   style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.25)' }}>
                {score}
              </div>
              <div className="text-sm md:text-base font-black opacity-90">
                情商得分 / 100
              </div>
            </div>
          </div>

          {/* 段位 + emoji 大图 */}
          <div className="text-center mb-5">
            <div className="inline-flex flex-col items-center gap-2 animate-pop-in" style={{ animationDelay: '150ms' }}>
              <div className="text-7xl md:text-8xl animate-wiggle" style={{ filter: 'drop-shadow(3px 4px 0 rgba(26,26,46,0.25))' }}>
                {config.emoji}
              </div>
              <div className="text-3xl md:text-4xl font-black text-[#1a1a2e] leading-tight"
                   style={{ WebkitTextStroke: '1px #1a1a2e', textShadow: '3px 3px 0 #fbbf24' }}>
                {result.level.name}
              </div>
              <div className="text-sm md:text-base font-bold text-[#1a1a2e]/70 mt-1">
                {result.level.description}
              </div>
            </div>
          </div>

          {/* 搞笑点评 */}
          <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl border-[3px] border-[#1a1a2e] p-5 mb-4">
            <div className="absolute -top-3 -left-3 bg-pink-400 text-white font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] rotate-[-6deg] animate-wiggle">
              💬 解说
            </div>
            <p className="text-[#1a1a2e] text-base md:text-lg font-bold leading-relaxed mt-1">
              「{result.comment}」
            </p>
          </div>

          {/* 小贴士 */}
          <div className="relative bg-blue-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 mb-4">
            <div className="text-center">
              <span className="inline-block text-2xl mb-1">💡</span>
              <p className="text-[#1a1a2e] text-sm md:text-base font-bold">{result.tips}</p>
            </div>
          </div>

          {/* 用户回答 */}
          <div className="border-t-[3px] border-[#1a1a2e]/20 pt-4">
            <div className="text-xs font-black text-[#1a1a2e]/60 mb-2 tracking-wide">👉 你的回答</div>
            <div className="bg-[#1a1a2e]/5 rounded-2xl border-[2px] border-[#1a1a2e]/15 p-4">
              <p className="text-[#1a1a2e] text-sm md:text-base font-bold leading-relaxed">
                {customInput || selectedOption?.content}
              </p>
            </div>
          </div>

          {/* 如果低情商，展示高情商示范 */}
          {result.level.name === '社交杀手' && (
            <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-[3px] border-[#1a1a2e] p-5">
              <div className="text-center mb-2">
                <span className="inline-block text-3xl animate-bounce">👑</span>
              </div>
              <h4 className="text-[#1a1a2e] font-black text-center text-base md:text-lg mb-2">
                情商之神会这么说：
              </h4>
              <p className="text-[#1a1a2e] text-sm md:text-base font-bold leading-relaxed text-center">
                {currentScene.options.find((o) => o.level === 'god')?.content}
              </p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          {hasNext ? (
            <button
              onClick={goToNextScene}
              className="squishy w-full py-4 md:py-5 bg-gradient-to-b from-orange-400 to-red-500 text-white
                        font-black text-xl md:text-2xl rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] relative overflow-hidden"
            >
              <span className="relative z-10 inline-flex items-center gap-3 justify-center">
                <span className="text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>🚀</span>
                下一关：{scenes[nextSceneIndex]?.emoji} {scenes[nextSceneIndex]?.title} →
              </span>
              <span className="absolute top-2 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
            </button>
          ) : (
            <button
              onClick={goToNextScene}
              className="squishy w-full py-4 md:py-5 bg-gradient-to-b from-yellow-300 to-orange-500 text-white
                        font-black text-xl md:text-2xl rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] relative overflow-hidden animate-wiggle"
            >
              <span className="relative z-10 inline-flex items-center gap-3 justify-center">
                <span className="text-3xl">🎉</span>
                查看我的最终鉴定报告！
                <span className="text-3xl">🏆</span>
              </span>
              <span className="absolute top-2 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
            </button>
          )}

          <button
            onClick={() => useGameStore.getState().setPage('select')}
            className="squishy w-full py-3 bg-white/95 text-[#1a1a2e] font-black rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e]"
          >
            返回场景选择
          </button>
        </div>

        <div className="mt-5 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] text-xs font-black text-[#1a1a2e]">
            进度：{completedScenes.length} / {scenes.length}
          </div>
        </div>
      </div>
    </div>
  );
}
