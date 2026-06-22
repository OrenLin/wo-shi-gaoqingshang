import React from 'react';
import { cn } from '../../lib/utils';

/**
 * 漫画风格按钮（粗描边 + Neo-Brutalism 阴影）
 * 统一交互：hover 抬起 / active 按下 / squishy 动画
 */
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: Variant;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-to-b from-orange-400 to-red-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]',
  secondary: 'bg-white text-[#1a1a2e] shadow-[inset_0_-2px_0_0_rgba(26,26,46,0.08)]',
  danger: 'bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]',
  ghost: 'bg-transparent text-[#1a1a2e] hover:bg-[#1a1a2e]/5',
};

export default function MangaButton({
  variant = 'primary',
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 px-5 py-3',
        'font-black text-base rounded-2xl border-[3px] border-[#1a1a2e]',
        'shadow-[4px_4px_0_0_#1a1a2e]',
        'transition-all duration-150 ease-out',
        'hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_0_#1a1a2e] hover:brightness-105',
        'active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#1a1a2e] active:brightness-95',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
