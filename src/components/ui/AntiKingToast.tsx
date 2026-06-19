// ======================================================================
// 抗压之王彩蛋气泡（支持双语）— 不打断操作
// ======================================================================
import { useEffect, useMemo } from 'react';
import { useI18n, pickLocalized } from '../../i18n';

interface Props {
  onClose?: () => void;
  auto?: boolean;
}

type Joke = { zh: string; en: string; emoji: string };

const JOKES: Joke[] = [
  {
    zh: '你这反击太猛了，对面直接社死了 🤣',
    en: 'Your comeback was devastating. They have no reply 🤣',
    emoji: '💀',
  },
  {
    zh: '大姑从此不敢再多问一句 😂',
    en: 'Auntie won\'t pester you again 😂',
    emoji: '🤫',
  },
  {
    zh: '王总默默关掉了钉钉 👀',
    en: 'Boss Wang silently closed DingTalk 👀',
    emoji: '🫣',
  },
  {
    zh: '全场陷入尴尬的沉默 🤐',
    en: 'An awkward silence falls on the room 🤐',
    emoji: '💭',
  },
  {
    zh: '刘总的酒突然就不香了 🍺',
    en: 'Mr. Liu\'s wine suddenly lost its charm 🍺',
    emoji: '🙃',
  },
  {
    zh: '亲戚们开始互相问收入了 👨‍👩‍👧‍👦',
    en: 'Relatives start asking each other about income 👨‍👩‍👧‍👦',
    emoji: '🔥',
  },
  {
    zh: '恭喜触发「以彼之道还施彼身」成就 🏆',
    en: 'Achievement unlocked: "Turn their words back at them" 🏆',
    emoji: '🏆',
  },
  {
    zh: '你的嘴比脑子快，但这次快对了 😎',
    en: 'Your tongue is faster than your brain — and nailed it 😎',
    emoji: '💪',
  },
];

const LABEL: { zh: string; en: string } = {
  zh: '⚡ 抗压之王名场面 ⚡',
  en: '⚡ Master of Pushback · Highlight ⚡',
};

const FOOTER: { zh: string; en: string } = {
  zh: '—— 你的嘴太狠了 🎯',
  en: '— You just won the conversation 🎯',
};

export default function AntiKingToast({ onClose, auto = false }: Props) {
  const { language } = useI18n();

  const joke = useMemo(
    () => JOKES[Math.floor(Math.random() * JOKES.length)],
    [],
  );

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => onClose?.(), 3800);
    return () => clearTimeout(timer);
  }, [auto, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[200] pointer-events-none animate-slide-down max-w-xs">
      <div className="relative bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400
                      rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e]
                      px-5 py-4">
        <div className="absolute -top-3 -left-3 bg-red-600 text-white font-black text-[11px] rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] whitespace-nowrap">
          {pickLocalized(LABEL, language)}
        </div>

        <div className="flex items-start gap-3 pt-2">
          <div className="text-3xl">{joke.emoji}</div>
          <div className="flex-1">
            <p className="text-white font-black text-sm leading-relaxed"
               style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.35)' }}>
              {pickLocalized({ zh: joke.zh, en: joke.en }, language)}
            </p>
            <p className="text-white/85 text-xs font-bold mt-1">
              {pickLocalized(FOOTER, language)}
            </p>
          </div>
        </div>

        {!auto && (
          <button
            onClick={onClose}
            className="absolute top-1 right-2 text-white/70 hover:text-white text-lg font-black pointer-events-auto"
          >×</button>
        )}
      </div>
    </div>
  );
}
