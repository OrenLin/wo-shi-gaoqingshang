import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Home() {
  const { setPage } = useGameStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const floating = [
    { emoji: '🧨', top: '8%', left: '6%', delay: '0s', size: '3rem' },
    { emoji: '💼', top: '18%', right: '8%', delay: '0.4s', size: '2.6rem' },
    { emoji: '🍻', bottom: '22%', left: '10%', delay: '0.8s', size: '2.8rem' },
    { emoji: '😎', top: '30%', left: '12%', delay: '1.2s', size: '2.4rem' },
    { emoji: '👑', bottom: '18%', right: '14%', delay: '0.2s', size: '2.8rem' },
    { emoji: '💀', bottom: '35%', right: '6%', delay: '1.6s', size: '2.4rem' },
    { emoji: '💬', top: '14%', left: '45%', delay: '0.6s', size: '2.2rem' },
    { emoji: '🔥', top: '48%', right: '20%', delay: '1s', size: '2.6rem' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-between py-10 px-5"
         style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 45%, #fbbf24 100%)' }}>

      {/* 漫画斜条纹装饰 */}
      <div className="absolute inset-0 manga-stripes opacity-40 pointer-events-none" />

      {/* 漂浮表情 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floating.map((f, i) => (
          <div
            key={i}
            className="absolute animate-float-gentle select-none"
            style={{
              top: f.top, bottom: f.bottom, left: f.left, right: f.right,
              fontSize: f.size,
              animationDelay: f.delay,
              filter: 'drop-shadow(2px 3px 0 rgba(26,26,46,0.15))',
            }}
          >
            {f.emoji}
          </div>
        ))}
      </div>

      {/* 顶部Logo */}
      <div className={`relative z-10 transition-all duration-700 ${ready ? 'opacity-100 -translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="inline-flex items-center gap-2 bg-white/80 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
          <span className="text-base">🧠</span>
          <span className="text-sm font-black text-[#1a1a2e] tracking-wide">情商测验 · 2025</span>
        </div>
      </div>

      {/* 主视觉区 */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative inline-block">
          {/* 主标题背景贴纸 */}
          <div className="absolute -top-5 -left-6 w-20 h-20 bg-pink-400 rounded-full opacity-60 animate-spin-slow -z-10" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-sky-400 rounded-full opacity-60 animate-spin-slow -z-10"
               style={{ animationDirection: 'reverse' }} />

          <h1 className="relative">
            <span className="block text-7xl md:text-8xl font-black text-[#1a1a2e] leading-none animate-wiggle"
                  style={{
                    textShadow: '4px 4px 0 #fbbf24, 8px 8px 0 rgba(26,26,46,0.2)',
                    WebkitTextStroke: '3px #1a1a2e',
                  }}>
              我是
            </span>
            <span className="block text-8xl md:text-9xl font-black leading-none mt-2 animate-wiggle"
                  style={{
                    background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #facc15 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextStroke: '3px #1a1a2e',
                    textShadow: '6px 6px 0 rgba(26,26,46,0.15)',
                    animationDelay: '0.2s',
                  }}>
              高情商
            </span>
          </h1>

          {/* 小徽章 */}
          <div className="absolute -top-3 -right-8 md:-right-14 bg-red-500 text-white font-black text-xs md:text-sm rounded-[14px] px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle rotate-[12deg]"
               style={{ animationDelay: '0.5s' }}>
            🔥 火爆全网
          </div>
        </div>

        {/* 副标题漫画框 */}
        <div className="mt-10 inline-block relative">
          <div className="relative bg-white border-[4px] border-[#1a1a2e] rounded-3xl px-6 py-4 shadow-[6px_6px_0_0_#1a1a2e]">
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-[4px] border-r-[4px] border-[#1a1a2e] rotate-45" />
            <p className="text-[15px] md:text-lg font-bold text-[#1a1a2e] whitespace-pre-line leading-relaxed">
              测测你的社死等级<span className="text-pink-500 mx-1">·</span>拒绝无效社交<span className="text-pink-500 mx-1">·</span>整顿职场
            </p>
          </div>
        </div>
      </div>

      {/* 底部开始按钮区 */}
      <div className={`relative z-10 w-full max-w-sm transition-all duration-1000 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
           style={{ transitionDelay: '300ms' }}>

        <button
          onClick={() => setPage('select')}
          className="w-full squishy group relative bg-gradient-to-b from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400
                     text-white font-black text-2xl py-5 rounded-[28px] border-[4px] border-[#1a1a2e]
                     shadow-[6px_6px_0_0_#1a1a2e] overflow-hidden"
        >
          <span className="relative z-10 inline-flex items-center gap-3">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
            开始挑战
            <span className="text-2xl">→</span>
          </span>
          {/* 高光条 */}
          <span className="absolute top-2 left-3 right-3 h-2 bg-white/40 rounded-full pointer-events-none" />
        </button>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 border-[2px] border-[#1a1a2e] rounded-full px-4 py-1.5 text-xs font-bold text-[#1a1a2e]">
            <span>⭐</span>
            3个经典社死场景
            <span className="opacity-40">|</span>
            5档情商段位
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-[#1a1a2e]/60">
          👇 看看你是 情商之神 还是 社交杀手
        </p>
      </div>
    </div>
  );
}
