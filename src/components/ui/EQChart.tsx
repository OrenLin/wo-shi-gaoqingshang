// ======================================================================
// 迷你雷达图 —— 纯 SVG，无任何第三方依赖
// 展示玩家在 5 个情商维度的表现
// 维度基于游戏中的选项等级分布推导
// ======================================================================

interface RadarDim {
  key: string;
  label: { zh: string; en: string };
  color: string;       // 渐变色起点
  colorEnd: string;    // 渐变色终点
  value: number;       // 0-100
}

interface EQChartProps {
  dims: RadarDim[];
  language: 'zh' | 'en';
  show: boolean;
  title: string;
}

// 把角度和半径转换为 SVG 坐标（中心在 center）
function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// 生成五边形各层的顶点（用于背景网格）
function gridLevels(levels: number[], cx: number, cy: number, radius: number) {
  return levels.map((pct) => {
    const r = radius * (pct / 100);
    const pts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 5; i++) {
      pts.push(polarToXY(i * 72, r, cx, cy));
    }
    return pts;
  });
}

// 生成玩家数据的雷达区域顶点
function dataPoints(dims: RadarDim[], cx: number, cy: number, radius: number) {
  return dims.map((d, i) => {
    const r = radius * (d.value / 100);
    return polarToXY(i * 72, r, cx, cy);
  });
}

// 生成雷达图的轴线端点（用于标签定位）
function axisEndpoints(cx: number, cy: number, radius: number) {
  return Array.from({ length: 5 }, (_, i) => polarToXY(i * 72, radius, cx, cy));
}

export default function EQChart({ dims, language, show, title }: EQChartProps) {
  const size = 280;   // SVG 总尺寸
  const cx = size / 2;
  const cy = size / 2;
  const radius = 108; // 数据区最大半径

  // 背景网格层级：20%, 40%, 60%, 80%, 100%
  const gridPcts = [20, 40, 60, 80, 100];
  const grids = gridLevels(gridPcts, cx, cy, radius);
  const axes = axisEndpoints(cx, cy, radius);

  // 玩家数据的雷达区域
  const playerPts = dataPoints(dims, cx, cy, radius);
  const playerPtsStr = playerPts.map((p) => `${p.x},${p.y}`).join(' ');

  // 数据点的坐标（用于圆点标记）
  const dotPts = playerPts.map((p) => ({ cx: p.x, cy: p.y }));

  // 雷达区域颜色（基于维度）
  const fillColor = 'rgba(251, 191, 36, 0.25)'; // amber 半透明
  const strokeColor = '#f59e0b';

  return (
    <div className="flex flex-col items-center mb-5">
      {/* 标题 */}
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-rose-400 text-white font-black text-xs rounded-full px-4 py-1.5 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] animate-pop-in">
          {title}
        </span>
      </div>

      {/* SVG 雷达图 */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            {/* 外发光滤镜 */}
            <filter id="chart-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 玩家数据区域渐变 */}
            <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(251,191,36,0.5)" />
              <stop offset="50%" stopColor="rgba(244,114,114,0.35)" />
              <stop offset="100%" stopColor="rgba(167,139,250,0.35)" />
            </linearGradient>

            {/* 外发光线条渐变 */}
            <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* 数据点发光 */}
            <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 背景五边形网格 */}
          {grids.map((pts, gi) => {
            const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
            return (
              <polygon
                key={gi}
                points={poly}
                fill="none"
                stroke={gi === grids.length - 1 ? '#e5e7eb' : '#f3f4f6'}
                strokeWidth={gi === grids.length - 1 ? 2 : 1}
                strokeDasharray={gi < grids.length - 1 ? '4,4' : 'none'}
                opacity={0.6}
              />
            );
          })}

          {/* 轴线 */}
          {axes.map((pt, i) => (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke="#e5e7eb"
              strokeWidth={1.5}
              opacity={0.5}
            />
          ))}

          {/* 玩家数据区域（带动画） */}
          <g filter="url(#chart-glow)">
            {/* 填充区域 */}
            <polygon
              points={playerPtsStr}
              fill="url(#radar-fill)"
              stroke="url(#radar-stroke)"
              strokeWidth={3}
              strokeLinejoin="round"
              style={{
                // SVG 描边动画：stroke-dashoffset 从总长度到 0
                strokeDasharray: 600,
                strokeDashoffset: show ? 0 : 600,
                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </g>

          {/* 数据点 + 动画弹出 */}
          {dotPts.map((pt, i) => {
            const dim = dims[i];
            return (
              <g key={i}>
                {/* 外发光圈 */}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={7}
                  fill={dim.color}
                  opacity={0.3}
                  filter="url(#dot-glow)"
                  style={{
                    r: show ? 7 : 0,
                    opacity: show ? 0.3 : 0,
                    transition: `r 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.8 + i * 0.1}s,
                                 opacity 0.4s ease ${0.8 + i * 0.1}s`,
                  }}
                />
                {/* 实心点 */}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={4.5}
                  fill={dim.colorEnd}
                  stroke="#1a1a2e"
                  strokeWidth={1.5}
                  style={{
                    r: show ? 4.5 : 0,
                    opacity: show ? 1 : 0,
                    transition: `r 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${1.0 + i * 0.1}s,
                                 opacity 0.35s ease ${1.0 + i * 0.1}s`,
                  }}
                />
              </g>
            );
          })}

          {/* 维度标签 */}
          {dims.map((dim, i) => {
            const pt = axes[i];
            const labelRadius = radius + 18;
            const lx = cx + labelRadius * Math.cos(((i * 72 - 90) * Math.PI) / 180);
            const ly = cy + labelRadius * Math.sin(((i * 72 - 90) * Math.PI) / 180);

            // 标签文字对齐
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (i === 0) textAnchor = 'middle';
            else if (i === 1 || i === 4) textAnchor = 'start';
            else textAnchor = 'end';

            const label = pickLocalized(dim.label, language);

            return (
              <g key={i}>
                {/* 标签背景 */}
                <rect
                  x={lx - 30}
                  y={ly - 9}
                  width={60}
                  height={18}
                  rx={9}
                  fill={dim.colorEnd}
                  opacity={show ? 0.9 : 0}
                  style={{
                    opacity: show ? 0.9 : 0,
                    transition: `opacity 0.4s ease ${1.2 + i * 0.1}s`,
                  }}
                />
                {/* 标签文字 */}
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor={textAnchor}
                  fontSize={10}
                  fontWeight="900"
                  fill="#1a1a2e"
                  fontFamily="inherit"
                  style={{
                    opacity: show ? 1 : 0,
                    transition: `opacity 0.4s ease ${1.2 + i * 0.1}s`,
                  }}
                >
                  {label}
                </text>

                {/* 分值标签（雷达区域外侧） */}
                <text
                  x={pt.x + (pt.x > cx ? 8 : pt.x < cx ? -8 : 0)}
                  y={pt.y + (pt.y > cy ? 14 : pt.y < cy ? -6 : 4)}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight="900"
                  fill={dim.colorEnd}
                  fontFamily="inherit"
                  style={{
                    opacity: show ? 1 : 0,
                    transition: `opacity 0.4s ease ${1.0 + i * 0.1}s`,
                  }}
                >
                  {dim.value}
                </text>
              </g>
            );
          })}

          {/* 中心光晕 */}
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill="white"
            opacity={show ? 0.6 : 0}
            filter="url(#dot-glow)"
            style={{
              r: show ? 6 : 0,
              opacity: show ? 0.6 : 0,
              transition: `r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s,
                           opacity 0.5s ease 0.3s`,
            }}
          />
        </svg>
      </div>

      {/* 维度小标签（下方横排） */}
      <div className="flex flex-wrap justify-center gap-2 mt-3 max-w-xs">
        {dims.map((dim, i) => (
          <div
            key={i}
            className="flex items-center gap-1 bg-white border-[2px] border-[#1a1a2e] rounded-full px-2.5 py-1 shadow-[2px_2px_0_0_#1a1a2e]"
            style={{
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.4s ease ${1.4 + i * 0.08}s,
                           transform 0.4s ease ${1.4 + i * 0.08}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${dim.color}, ${dim.colorEnd})` }}
            />
            <span className="text-[10px] font-black text-[#1a1a2e]">
              {pickLocalized(dim.label, language)}
            </span>
            <span className="text-[10px] font-black text-[#1a1a2e]/60">{dim.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 工具函数：避免重复引入 pickLocalized
function pickLocalized<T extends { zh: string; en: string }>(
  val: string | T,
  lang: 'zh' | 'en',
): string {
  if (typeof val === 'string') return val;
  return val[lang] ?? val.zh;
}
