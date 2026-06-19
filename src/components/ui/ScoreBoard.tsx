// ======================================================================
// ScoreBoard — 融合分数 + 雷达图 + Beat% 的炫酷模块
// 纯 SVG，无任何第三方依赖
// ======================================================================

interface RadarDim {
  key: string;
  label: { zh: string; en: string };
  color: string;
  colorEnd: string;
  value: number;
}

interface ScoreBoardProps {
  score: number;
  percentile: number;
  dims: RadarDim[];
  language: 'zh' | 'en';
  levelName: string;
  levelEmoji: string;
  show: boolean;
  beatTitle: string;       // 🌍 你的表现已超越
  beatSubtitle: string;    // 全球玩家 / of players worldwide
  scoreLabel: string;      // 综合得分 / Total Score
  boardTitle: string;      // 🏆 EQ SCOREBOARD
}

function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function ScoreBoard({
  score,
  percentile,
  dims,
  language,
  levelName,
  levelEmoji,
  show,
  beatTitle,
  beatSubtitle,
  scoreLabel,
  boardTitle,
}: ScoreBoardProps) {
  // ============== 雷达图 SVG 配置 ==============
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 84;

  const gridPcts = [25, 50, 75, 100];
  const pts = dims.map((d, i) => polarToXY(i * 72, radius * (d.value / 100), cx, cy));
  const axes = dims.map((_, i) => polarToXY(i * 72, radius, cx, cy));
  const grids = gridPcts.map((pct) =>
    dims.map((_, i) => polarToXY(i * 72, radius * (pct / 100), cx, cy)),
  );
  const playerPtsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');

  // 分数数字拆分（做数字翻转动画）
  const scoreInt = Math.floor(score);
  const scoreDec = Math.round((score - scoreInt) * 10);

  return (
    <div className="relative mb-5 animate-pop-in">
      {/* 卡片主容器 */}
      <div
        className="relative overflow-hidden rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e]"
        style={{
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
        }}
      >
        {/* 霓虹装饰角 */}
        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-2 left-2 w-8 h-1 bg-amber-400 rounded-full opacity-80" />
          <div className="absolute top-2 left-2 w-1 h-8 bg-amber-400 rounded-full opacity-80" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-2 right-2 w-8 h-1 bg-rose-400 rounded-full opacity-80" />
          <div className="absolute top-2 right-2 w-1 h-8 bg-rose-400 rounded-full opacity-80" />
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-2 left-2 w-8 h-1 bg-violet-400 rounded-full opacity-80" />
          <div className="absolute bottom-2 left-2 w-1 h-8 bg-violet-400 rounded-full opacity-80" />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute bottom-2 right-2 w-8 h-1 bg-emerald-400 rounded-full opacity-80" />
          <div className="absolute bottom-2 right-2 w-1 h-8 bg-emerald-400 rounded-full opacity-80" />
        </div>

        {/* 标题行 */}
        <div className="flex items-center justify-center gap-2 pt-5 pb-3 px-5">
          <span aria-hidden="true" className="text-2xl animate-wiggle">{levelEmoji}</span>
          <h3
            className="text-white font-black text-base md:text-lg"
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.5), 2px 2px 0 rgba(0,0,0,0.3)' }}
          >
            {boardTitle}
          </h3>
          <span className="text-white/50 font-black text-xs hidden md:inline">
            · {levelName}
          </span>
        </div>

        {/* 主体三列布局：桌面端横排 | 移动端竖排 */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-1 px-4 md:px-5 pb-4">
          {/* =============== 左列：综合得分 =============== */}
          <div className="flex flex-col items-center justify-center flex-1 md:w-1/3">
            <div className="text-amber-400 font-black text-[10px] md:text-xs tracking-widest mb-1 uppercase">
              {scoreLabel}
            </div>

            {/* 分数数字（做霓虹效果） */}
            <div className="relative">
              <div className="text-6xl md:text-7xl font-black text-white leading-none"
                style={{
                  textShadow:
                    '0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.4), 0 0 40px rgba(251,191,36,0.2), 3px 3px 0 rgba(251,191,36,0.15)',
                }}
              >
                {scoreInt}.{scoreDec}
              </div>
              {/* 数字下方装饰条 */}
              <div className="flex gap-1 mt-2 justify-center">
                <div className="h-1 w-10 bg-amber-400 rounded-full opacity-90"
                  style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.3s' }}
                />
                <div className="h-1 w-6 bg-orange-400 rounded-full opacity-70"
                  style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.4s' }}
                />
                <div className="h-1 w-3 bg-rose-400 rounded-full opacity-50"
                  style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.5s' }}
                />
              </div>
            </div>

            <div className="text-white/40 font-black text-[10px] mt-2 tracking-wider">
              {language === 'zh' ? '满分 100' : 'OUT OF 100'}
            </div>
          </div>

          {/* =============== 中列：雷达图 =============== */}
          <div className="relative flex items-center justify-center flex-1 md:w-1/3">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="overflow-visible"
            >
              <defs>
                <filter id="radar-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="radar-fill-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,191,36,0.55)" />
                  <stop offset="50%" stopColor="rgba(244,114,114,0.4)" />
                  <stop offset="100%" stopColor="rgba(167,139,250,0.45)" />
                </linearGradient>
                <linearGradient id="radar-stroke-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* 背景网格 */}
              {grids.map((poly, gi) => (
                <polygon
                  key={gi}
                  points={poly.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1}
                  strokeDasharray={gi < grids.length - 1 ? '3,3' : 'none'}
                />
              ))}

              {/* 轴线 */}
              {axes.map((pt, i) => (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
              ))}

              {/* 数据区域（带描边动画） */}
              <g filter="url(#radar-glow)">
                <polygon
                  points={playerPtsStr}
                  fill="url(#radar-fill-2)"
                  stroke="url(#radar-stroke-2)"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 500,
                    strokeDashoffset: show ? 0 : 500,
                    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.2s',
                  }}
                />
              </g>

              {/* 数据点 */}
              {pts.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill={dims[i].colorEnd}
                  stroke="#1a1a2e"
                  strokeWidth={1}
                  style={{
                    r: show ? 4 : 0,
                    opacity: show ? 1 : 0,
                    transition: `r 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.9 + i * 0.08}s,
                                 opacity 0.4s ease ${0.9 + i * 0.08}s`,
                  }}
                />
              ))}

              {/* 中心霓虹点 */}
              <circle
                cx={cx}
                cy={cy}
                r={3}
                fill="rgba(255,255,255,0.5)"
                style={{
                  r: show ? 3 : 0,
                  opacity: show ? 0.6 : 0,
                  transition: 'r 0.5s ease 0.3s, opacity 0.5s ease 0.3s',
                }}
              />
            </svg>
          </div>

          {/* =============== 右列：Beat% =============== */}
          <div className="flex flex-col items-center justify-center flex-1 md:w-1/3">
            <div className="text-emerald-400 font-black text-[10px] md:text-xs tracking-widest mb-1 uppercase">
              🌍 {beatTitle}
            </div>

            {/* 大百分比数字 */}
            <div className="relative">
              <div className="text-6xl md:text-7xl font-black text-white leading-none"
                style={{
                  textShadow:
                    '0 0 10px rgba(52,211,153,0.6), 0 0 20px rgba(52,211,153,0.4), 0 0 40px rgba(52,211,153,0.2), 3px 3px 0 rgba(16,185,129,0.15)',
                }}
              >
                {percentile.toFixed(1)}%
              </div>
              {/* 数字下方装饰条 */}
              <div className="flex gap-1 mt-2 justify-center">
                <div className="h-1 w-10 bg-emerald-400 rounded-full opacity-90"
                  style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'right', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.3s' }}
                />
                <div className="h-1 w-6 bg-teal-400 rounded-full opacity-70"
                  style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'right', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.4s' }}
                />
                <div className="h-1 w-3 bg-cyan-400 rounded-full opacity-50"
                  style={{ transform: show ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'right', transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.5s' }}
                />
              </div>
            </div>

            <div className="text-white/40 font-black text-[10px] mt-2 tracking-wider">
              {beatSubtitle}
            </div>
          </div>
        </div>

        {/* =============== 底部：5 维度迷你标签 =============== */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 px-3 pb-4 pt-1 border-t border-white/10">
          {dims.map((dim, i) => (
            <div
              key={dim.key}
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 bg-white/5 border border-white/15"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(6px)',
                transition: `opacity 0.4s ease ${1.1 + i * 0.06}s,
                             transform 0.4s ease ${1.1 + i * 0.06}s`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${dim.color}, ${dim.colorEnd})` }}
              />
              <span className="text-white/90 text-[10px] md:text-[11px] font-black">
                {dim.label[language]}
              </span>
              <span className="text-white/60 text-[10px] md:text-[11px] font-black">
                {dim.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
