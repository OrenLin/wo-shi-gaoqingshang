import { levelEmoji, levelGradient, levelLabel } from '../../data/levels';
import type { OptionLevel } from '../../data/types';

/**
 * 等级徽章（选择后展示：🔥 抗压之王 / 👑 情商之神 等）
 */
interface Props {
  level: OptionLevel;
  size?: 'sm' | 'md';
}

export default function LevelBadge({ level, size = 'md' }: Props) {
  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl border-[3px] border-[#1a1a2e]
                  shadow-[3px_3px_0_0_#1a1a2e] font-black text-white
                  bg-gradient-to-r ${levelGradient[level]} ${padding}`}
    >
      <span className="text-lg animate-bounce" style={{ animationDuration: '1.2s' }}>
        {levelEmoji[level]}
      </span>
      <span>{levelLabel[level]}</span>
    </div>
  );
}
