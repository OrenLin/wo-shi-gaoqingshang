// ======================================================================
// PageHeader — 统一的页面主标题组件
// 用于场景选择/工具箱/个人中心等列表页，保持视觉一致性
// ======================================================================
import React from 'react';
import { audioManager } from '../../utils/audioManager';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  rightSlot?: React.ReactNode;
  /** 主题色：amber(默认) / rose / sky */
  theme?: 'amber' | 'rose' | 'sky';
}

const THEME_CONFIG = {
  amber: {
    bg: 'from-amber-100 via-orange-100 to-rose-100',
    accent: '#fbbf24',
    chipBg: 'bg-amber-300',
  },
  rose: {
    bg: 'from-rose-100 via-pink-100 to-orange-100',
    accent: '#fb7185',
    chipBg: 'bg-rose-300',
  },
  sky: {
    bg: 'from-sky-100 via-blue-100 to-indigo-100',
    accent: '#38bdf8',
    chipBg: 'bg-sky-300',
  },
};

export default function PageHeader({
  emoji,
  title,
  subtitle,
  onBack,
  backLabel = '返回',
  rightSlot,
  theme = 'amber',
}: Props) {
  const cfg = THEME_CONFIG[theme];

  return (
    <div className={`mb-5`}>
      {/* 顶栏：返回按钮 + 右侧操作 */}
      <div className="flex items-center justify-between mb-4">
        {onBack ? (
          <button
            onClick={() => {
              audioManager.userTapped();
              audioManager.play('click');
              onBack();
            }}
            aria-label={backLabel}
            className={`inline-flex items-center gap-1.5 ${cfg.chipBg} border-[3px] border-[#1a1a2e] rounded-full px-4 py-2 shadow-[2px_2px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-all active:translate-y-[2px] active:shadow-[0_0_0_0_#1a1a2e] hover:-translate-y-[1px]`}
          >
            <span aria-hidden="true" className="text-base leading-none">←</span>
            <span className="text-xs">{backLabel}</span>
          </button>
        ) : (
          <div className="w-20" aria-hidden />
        )}
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </div>

      {/* 主标题区 */}
      <div className="text-center">
        <h1
          className="text-3xl font-black text-[#1a1a2e] leading-tight flex items-center justify-center gap-2"
          style={{ WebkitTextStroke: '1px #1a1a2e', textShadow: `3px 3px 0 ${cfg.accent}` }}
        >
          <span aria-hidden="true" className="text-3xl">{emoji}</span>
          {title}
        </h1>
        {subtitle && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 border-[2px] border-[#1a1a2e]/20 shadow-[2px_2px_0_0_#1a1a2e]/10">
            <span className="text-[11px] font-black text-[#1a1a2e]/70">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}
