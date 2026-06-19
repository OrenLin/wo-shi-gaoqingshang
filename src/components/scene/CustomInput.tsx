import { useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
  badgeText?: string;
  countHint?: (len: number, max: number) => React.ReactNode;
  qualityHint?: (len: number) => React.ReactNode;
  tipText?: React.ReactNode;
}

/**
 * 自由发挥输入框（大字、漫画边框、字数提示）
 */
export default function CustomInput({
  value,
  onChange,
  maxLength = 200,
  placeholder = '写下你最想说的话... 越搞笑，段位可能越高哦 👀',
  badgeText = '✨ 自由发挥',
  countHint,
  qualityHint,
  tipText,
}: Props) {
  const len = value.length;
  const pct = Math.round((len / maxLength) * 100);

  return (
    <div className="relative bg-white rounded-[24px] border-[3px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e] p-5">
      <div className="absolute -top-3 -right-3 bg-blue-400 text-white font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] rotate-[6deg]">
        {badgeText}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        className="w-full h-32 p-4 border-[3px] border-[#1a1a2e] rounded-2xl
                   bg-gradient-to-br from-yellow-50/70 to-white
                   text-[#1a1a2e] text-base font-bold leading-relaxed
                   placeholder:text-[#1a1a2e]/40
                   focus:outline-none focus:ring-4 focus:ring-yellow-300
                   resize-none transition-all"
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="font-black text-xs text-[#1a1a2e]/70">
          {countHint ? countHint(len, maxLength) : (
            <>✏️ {len} / {maxLength} 字</>
          )}
          {qualityHint ? qualityHint(len) : (
            len >= 30 && <span className="ml-2 text-green-600">✓ 有内味儿了！</span>
          )}
        </div>
        <div className="flex-1 mx-4 h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden border border-[#1a1a2e]/30">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[11px] font-bold text-[#1a1a2e]/50">
          {tipText ?? <>💡 真诚必杀</>}
        </div>
      </div>
    </div>
  );
}
