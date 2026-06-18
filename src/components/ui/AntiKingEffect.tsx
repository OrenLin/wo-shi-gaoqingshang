// ======================================================================
// 抗压之王特效动画
// 触发条件：用户选择了 anti（抗压之王）选项
// 效果：两个卡通小人对战，胜利者 vs 尴尬流汗方
// ======================================================================
import { useEffect, useRef } from 'react';

interface Props {
  onComplete?: () => void;
}

export default function AntiKingEffect({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
    >
      {/* 黑色半透明遮罩 */}
      <div className="absolute inset-0 bg-black/60 animate-[fadeIn_0.3s_ease]" />

      {/* 舞台 */}
      <div className="relative flex items-center justify-center gap-4 md:gap-10">

        {/* ===== 胜利小人（我方）===== */}
        <div
          className="relative flex flex-col items-center animate-[slideInLeft_0.5s_cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: 'translateX(-120%)' }}
        >
          {/* 身体 */}
          <div className="relative w-20 h-24 md:w-28 md:h-32">
            {/* 头 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 md:w-20 md:h-20 rounded-full bg-yellow-300 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e]"
                 style={{ animation: 'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.3s both' }}>
              {/* 墨镜 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-5 h-3 md:w-7 md:h-4 bg-[#1a1a2e] rounded-sm" />
                <div className="w-5 h-3 md:w-7 md:h-4 bg-[#1a1a2e] rounded-sm" />
              </div>
              {/* 嘴 */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 border-b-3 border-[#1a1a2e] rounded-b-full" />
            </div>
            {/* 身体 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-14 md:w-16 md:h-20 bg-blue-500 rounded-t-xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e]"
                 style={{ animation: 'bounceIn 0.4s ease 0.4s both' }}>
              {/* 领带 */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-6 bg-red-500 rounded-b-sm border-[2px] border-[#1a1a2e]" />
            </div>
            {/* 手（胜利手势） */}
            <div className="absolute top-10 -left-4 w-6 h-6 md:w-8 md:h-8 bg-yellow-300 rounded-full border-[3px] border-[#1a1a2e]"
                 style={{ transform: 'rotate(-30deg)', animation: 'bounceIn 0.4s ease 0.5s both' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-5 md:h-6 bg-yellow-300 border-[2px] border-[#1a1a2e] rounded-t-full" />
            </div>
            <div className="absolute top-10 -right-4 w-6 h-6 md:w-8 md:h-8 bg-yellow-300 rounded-full border-[3px] border-[#1a1a2e]"
                 style={{ transform: 'rotate(30deg)', animation: 'bounceIn 0.4s ease 0.5s both' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-5 md:h-6 bg-yellow-300 border-[2px] border-[#1a1a2e] rounded-t-full" />
            </div>
          </div>
          {/* 标签 */}
          <div className="mt-3 bg-red-500 text-white font-black text-xs md:text-sm px-3 py-1.5 rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] animate-[bounceIn_0.4s_ease_0.6s_both]"
               style={{ transform: 'translateX(-120%)' }}>
            抗压之王
          </div>
        </div>

        {/* ===== VS ===== */}
        <div className="relative flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-black text-white animate-[bounceIn_0.5s_ease_0.5s_both]"
               style={{ textShadow: '3px 3px 0 #1a1a2e' }}>
            ⚡VS⚡
          </div>
        </div>

        {/* ===== 流汗尴尬小人（NPC/亲戚）===== */}
        <div
          className="relative flex flex-col items-center animate-[slideInRight_0.5s_cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: 'translateX(120%)' }}
        >
          {/* 身体 */}
          <div className="relative w-20 h-24 md:w-28 md:h-32">
            {/* 头 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray-300 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e]"
                 style={{ animation: 'shakeIn 0.4s ease 0.3s both' }}>
              {/* 尴尬眼神 */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#1a1a2e] rounded-full" />
                <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#1a1a2e] rounded-full" />
              </div>
              {/* 尴尬嘴 */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 border-b-3 border-[#1a1a2e] rounded-b-full opacity-60" />
              {/* 汗滴 */}
              <div className="absolute -top-1 -right-2 text-2xl animate-[drip_1s_ease-in-out_infinite]"
                   style={{ animationDelay: '0.2s' }}>💦</div>
              <div className="absolute -top-1 -left-2 text-xl animate-[drip_1s_ease-in-out_infinite]"
                   style={{ animationDelay: '0.7s' }}>💦</div>
            </div>
            {/* 身体 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-14 md:w-16 md:h-20 bg-gray-400 rounded-t-xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e]"
                 style={{ animation: 'shakeIn 0.4s ease 0.4s both' }}>
              {/* 问号 */}
              <div className="absolute -top-6 right-1/4 text-2xl md:text-3xl font-black animate-[bounce_1s_ease-in-out_infinite]">⁉️</div>
            </div>
            {/* 手（尴尬姿势） */}
            <div className="absolute top-8 -left-3 w-5 h-5 md:w-7 md:h-7 bg-gray-300 rounded-full border-[3px] border-[#1a1a2e]"
                 style={{ transform: 'rotate(15deg)', animation: 'shakeIn 0.4s ease 0.5s both' }} />
            <div className="absolute top-8 -right-3 w-5 h-5 md:w-7 md:h-7 bg-gray-300 rounded-full border-[3px] border-[#1a1a2e]"
                 style={{ transform: 'rotate(-15deg)', animation: 'shakeIn 0.4s ease 0.5s both' }} />
          </div>
          {/* 标签 */}
          <div className="mt-3 bg-gray-500 text-white font-black text-xs md:text-sm px-3 py-1.5 rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_#1a1a2e] animate-[bounceIn_0.4s_ease_0.6s_both]">
            被反杀
          </div>
        </div>
      </div>

      {/* 底部字幕 */}
      <div className="absolute bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 text-center animate-[fadeInUp_0.6s_ease_0.8s_both]">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-lg md:text-2xl px-6 py-3 rounded-2xl border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_#1a1a2e] whitespace-nowrap"
             style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
          ⚡ 抗压之王·完美反杀 ⚡
        </div>
      </div>
    </div>
  );
}
