import React from 'react';
import { cn } from '../../lib/utils';

/**
 * 漫画风格按钮（粗描边 + Neo-Brutalism 阴影）
 * 统一交互：hover 抬起 / active 按下 / squishy 动画
 */
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-to-b from-orange-400 to-red-500 text-white',
  secondary: 'bg-white text-[#1a1a2e]',
  danger: 'bg-gradient-to-b from-red-500 to-red-700 text-white',
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
        'transition-transform duration-150',
        'hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_0_#1a1a2e]',
        'active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#1a1a2e]',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
