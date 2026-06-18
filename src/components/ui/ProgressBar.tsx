interface Props {
  current: number;       // 当前题号（从1开始）
  total: number;          // 总题数
  label?: string;
}

/**
 * 场景内的进度条（展示当前是第几题）
 */
export default function ProgressBar({ current, total, label }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-black text-sm text-[#1a1a2e]">
          {label ?? `第 ${current} / ${total} 题`}
        </span>
        <span className="font-black text-sm text-[#1a1a2e]/60">{pct}%</span>
      </div>
      <div className="h-3 bg-[#1a1a2e]/10 rounded-full overflow-hidden border-2 border-[#1a1a2e]/60">
        <div
          className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
