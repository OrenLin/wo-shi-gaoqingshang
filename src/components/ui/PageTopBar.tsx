import React from 'react';
import MangaButton from '../ui/MangaButton';

/**
 * 带返回按钮的页面顶部栏
 */
interface Props {
  title?: string;
  onBack?: () => void;
  backText?: string;
  rightSlot?: React.ReactNode;
}

export default function PageTopBar({ title, onBack, backText = '← 返回', rightSlot }: Props) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      {onBack ? (
        <MangaButton variant="secondary" onClick={onBack} className="!py-2 !px-4 !text-sm">
          {backText}
        </MangaButton>
      ) : (
        <div className="w-[72px]" aria-hidden />
      )}
      {title && (
        <div className="flex-1 text-center -mt-1">
          <span className="inline-flex items-center gap-2 bg-white text-[#1a1a2e] rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] px-4 py-1.5 font-black text-sm">
            {title}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 justify-end w-[72px]">{rightSlot}</div>
    </div>
  );
}
