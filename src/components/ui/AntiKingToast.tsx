// ======================================================================
// 抗压之王彩蛋气泡（轻量 + 幽默 + 不打断操作）
// 触发：auto=true 时自动弹出，幽默文案+emoji，3秒后自动消失
// 使用：<AntiKingToast auto onClose={fn} />
// ======================================================================
import { useEffect, useRef } from 'react';

interface Props {
  onClose?: () => void;
  auto?: boolean;  // true=自动弹出并3秒消失
}

// 随机选一条幽默文案
const JOKES = [
  { text: '你这反击太猛了，对面直接社死了 🤣', emoji: '💀' },
  { text: '大姑从此不敢再多问一句 😂', emoji: '🤫' },
  { text: '王总默默关掉了钉钉 👀', emoji: '🫣' },
  { text: '全场陷入尴尬的沉默 🤐', emoji: '💭' },
  { text: '刘总的酒突然就不香了 🍺', emoji: '🙃' },
  { text: '亲戚们开始互相问收入了 👨‍👩‍👧‍👦', emoji: '🔥' },
  { text: '恭喜你触发「以彼之道还施彼身」成就！', emoji: '🏆' },
  { text: '你的嘴比脑子快，但这次快对了 😎', emoji: '💪' },
];

export default function AntiKingToast({ onClose, auto = false }: Props) {
  const joke = JOKES[Math.floor(Math.random() * JOKES.length)];

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => onClose?.(), 3200);
    return () => clearTimeout(timer);
  }, [auto, onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none animate-slide-down">
      <div className="relative bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400
                      rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e]
                      px-5 py-3 flex items-center gap-3 max-w-xs">
        {/* 顶部小标签 */}
        <div className="absolute -top-3 left-4 bg-red-600 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
          ⚡ 抗压之王名场面 ⚡
        </div>

        <div className="text-3xl flex-shrink-0 mt-1">{joke.emoji}</div>

        <div className="pt-3">
          <p className="text-white font-black text-sm leading-relaxed"
             style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
            {joke.text}
          </p>
          <p className="text-white/80 text-xs font-bold mt-0.5">—— 你的嘴太狠了 🎯
            {auto && <span className="ml-2 opacity-60">· {joke.emoji}</span>}
          </p>
        </div>

        {/* 关闭按钮（不auto时显示） */}
        {!auto && (
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 text-white/70 hover:text-white text-lg font-black pointer-events-auto"
          >×</button>
        )}
      </div>
    </div>
  );
}
