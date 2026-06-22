// ============================================================
// Divination — 沉浸式抽签减压工具
// 设计理念：进入禅意空间，与 App 漫画风格形成反差
// 布局：竖屏上下分栏（竹筒 38% + 解签面板 62%）
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../utils/audioManager';
import {
  drawRandomLot,
  saveDivinationRecord,
  getTodayDrawCount,
  LEVEL_CONFIG,
  ELEMENT_CONFIG,
  type DivinationLot,
} from '../../utils/divinationLots';

type Phase = 'idle' | 'shaking' | 'revealing' | 'revealed';

export default function Divination() {
  const language = useI18n((s) => s.language);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';

  const [phase, setPhase] = useState<Phase>('idle');
  const [currentLot, setCurrentLot] = useState<DivinationLot | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const [karma, setKarma] = useState(0);

  useEffect(() => {
    setDrawCount(getTodayDrawCount());
    // 缘分 = 历史抽签次数
    try {
      const history = JSON.parse(localStorage.getItem('eq_divination_history') || '[]');
      setKarma(history.length);
    } catch {}
  }, []);

  const handleDraw = useCallback(() => {
    if (phase === 'shaking' || phase === 'revealing') return;

    audioManager.userTapped();
    audioManager.play('click');
    setPhase('shaking');

    // 摇签 1.5s
    setTimeout(() => {
      const lot = drawRandomLot();
      setCurrentLot(lot);
      setPhase('revealing');

      // 升签 1.2s
      setTimeout(() => {
        setPhase('revealed');
        audioManager.play('success');

        // 记录
        saveDivinationRecord({
          lotId: lot.id,
          level: lot.level,
          number: lot.number,
          timestamp: Date.now(),
        });
        setDrawCount(getTodayDrawCount());
        try {
          const history = JSON.parse(localStorage.getItem('eq_divination_history') || '[]');
          setKarma(history.length);
        } catch {}
      }, 1200);
    }, 1500);
  }, [phase]);

  const levelCfg = currentLot ? LEVEL_CONFIG[currentLot.level] : null;
  const elemCfg = currentLot ? ELEMENT_CONFIG[currentLot.element] : null;

  return (
    <div
      className="fixed inset-0 overflow-hidden divination-root"
      style={{
        background: `
          radial-gradient(ellipse 120% 60% at 50% 0%, rgba(245,235,210,0.4) 0%, transparent 50%),
          radial-gradient(ellipse 80% 50% at 20% 85%, rgba(90,141,94,0.12) 0%, transparent 45%),
          radial-gradient(ellipse 80% 50% at 80% 80%, rgba(61,40,23,0.08) 0%, transparent 45%),
          linear-gradient(180deg, #e8e0d0 0%, #ddd5c5 40%, #c8c0a8 100%)
        `,
      }}
    >
      {/* ===== 背景层：水墨山水 ===== */}
      <div className="absolute inset-0 pointer-events-none divination-bg-enter">
        {/* 远山 */}
        <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-25" viewBox="0 0 375 300" preserveAspectRatio="xMidYMax slice">
          <path d="M0,300 L0,180 Q50,140 100,160 Q150,130 200,150 Q250,120 300,145 Q350,130 375,150 L375,300 Z" fill="#5a6b5a" opacity="0.4" />
          <path d="M0,300 L0,220 Q60,190 120,205 Q180,180 240,200 Q300,175 375,195 L375,300 Z" fill="#4a5b4a" opacity="0.5" />
          <path d="M0,300 L0,250 Q70,235 140,245 Q210,230 280,242 Q340,235 375,245 L375,300 Z" fill="#3a4b3a" opacity="0.6" />
        </svg>
        {/* 中景竹林 */}
        <svg className="absolute bottom-0 left-0 w-full h-2/5 opacity-15" viewBox="0 0 375 200" preserveAspectRatio="xMidYMax slice">
          {[20, 50, 340, 360].map((x, i) => (
            <g key={i}>
              <rect x={x} y={i % 2 === 0 ? 40 : 60} width="3" height={i % 2 === 0 ? 160 : 140} fill="#4a7c4e" opacity="0.4" />
              <ellipse cx={x + 1} cy={i % 2 === 0 ? 35 : 55} rx="8" ry="3" fill="#5a8d5e" opacity="0.3" transform={`rotate(${i % 2 === 0 ? -15 : 15} ${x + 1} ${i % 2 === 0 ? 35 : 55})`} />
            </g>
          ))}
        </svg>
        {/* 顶部竹叶画框 */}
        <svg className="absolute top-0 left-0 w-full h-24 opacity-30" viewBox="0 0 375 80" preserveAspectRatio="xMidYMid slice">
          <g fill="#5a8d5e" opacity="0.5">
            <ellipse cx="30" cy="20" rx="18" ry="4" transform="rotate(-30 30 20)" />
            <ellipse cx="55" cy="12" rx="20" ry="4" transform="rotate(-20 55 12)" />
            <ellipse cx="340" cy="18" rx="18" ry="4" transform="rotate(25 340 18)" />
            <ellipse cx="315" cy="10" rx="20" ry="4" transform="rotate(15 315 10)" />
          </g>
        </svg>
        {/* 暗纹书法底 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: zh
              ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ctext x='50' y='80' font-size='60' fill='%23000' font-family='serif'%3E禅%3C/text%3E%3Ctext x='120' y='160' font-size='50' fill='%23000' font-family='serif'%3E缘%3C/text%3E%3C/svg%3E")`
              : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ctext x='30' y='80' font-size='40' fill='%23000' font-family='serif' font-style='italic'%3EZen%3C/text%3E%3Ctext x='100' y='160' font-size='35' fill='%23000' font-family='serif' font-style='italic'%3ECalm%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* ===== 顶部导航 ===== */}
      <div
        className="relative z-20 flex items-center justify-between px-4 pt-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setPage('tools');
          }}
          aria-label={zh ? '返回工具箱' : 'Back to tools'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border-[2px] border-[#3d2817]/30 bg-white/40 backdrop-blur-sm font-bold text-xs text-[#3d2817] transition-transform active:scale-95 hover:bg-white/60"
        >
          <span aria-hidden="true">←</span>
          {zh ? '工具' : 'Tools'}
        </button>
        <div className="flex items-center gap-2">
          {/* 缘分计数 */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border-[2px] border-[#3d2817]/30 bg-white/40 backdrop-blur-sm">
            <span className="text-sm" aria-hidden="true">🌸</span>
            <span className="text-[10px] font-black text-[#3d2817]">{zh ? '缘' : 'Karma'}</span>
            <span className="text-xs font-black text-[#c89b3c]">{karma}</span>
          </div>
          {/* 今日抽签次数 */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border-[2px] border-[#3d2817]/30 bg-white/40 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-[#3d2817]/60">{zh ? `今日 ${drawCount}` : `Today ${drawCount}`}</span>
          </div>
        </div>
      </div>

      {/* ===== 主内容区 ===== */}
      <div className="relative z-10 flex flex-col" style={{ height: 'calc(100vh - 60px - env(safe-area-inset-top))' }}>
        {/* ===== 上部：竹筒交互区（38%） ===== */}
        <div className="flex items-end justify-center" style={{ flex: '0 0 36%' }}>
          <BambooTube phase={phase} lot={currentLot} levelChar={levelCfg?.shortLabel.zh ?? ''} onDraw={handleDraw} zh={zh} />
        </div>

        {/* ===== 下部：解签面板（62%） ===== */}
        <div className="flex-1 px-4 pb-4 overflow-hidden" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {phase === 'idle' && <IdlePanel zh={zh} onDraw={handleDraw} />}
          {(phase === 'shaking') && <ShakingPanel zh={zh} />}
          {(phase === 'revealing' || phase === 'revealed') && currentLot && levelCfg && elemCfg && (
            <InterpretationPanel
              lot={currentLot}
              levelCfg={levelCfg}
              elemCfg={elemCfg}
              zh={zh}
              revealed={phase === 'revealed'}
              onRedraw={handleDraw}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 竹筒组件（SVG + CSS 动画）
// ============================================================
function BambooTube({
  phase,
  lot,
  levelChar,
  onDraw,
  zh,
}: {
  phase: Phase;
  lot: DivinationLot | null;
  levelChar: string;
  onDraw: () => void;
  zh: boolean;
}) {
  const isShaking = phase === 'shaking';
  const isRevealing = phase === 'revealing';

  return (
    <div className="relative flex flex-col items-center" style={{ marginBottom: '-10px' }}>
      {/* 光晕（revealing 时显示） */}
      {isRevealing && lot && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none divination-glow"
          style={{
            background: `radial-gradient(circle, ${LEVEL_CONFIG[lot.level].glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* 粒子效果（revealing 时显示） */}
      {isRevealing && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-40 h-32 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full divination-particle"
              style={{
                left: `${15 + i * 9}%`,
                bottom: '0%',
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                background: i % 2 === 0 ? 'rgba(200,155,60,0.6)' : 'rgba(255,255,255,0.5)',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 竹筒 SVG */}
      <button
        onClick={onDraw}
        disabled={phase === 'shaking' || phase === 'revealing'}
        aria-label={zh ? '点击竹筒抽签' : 'Tap bamboo tube to draw a lot'}
        className={`relative ${isShaking ? 'divination-shake' : ''} ${phase === 'idle' ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'} transition-transform`}
        style={{ transformOrigin: 'bottom center' }}
      >
        <svg width="180" height="240" viewBox="0 0 180 240" className="overflow-visible">
          <defs>
            {/* 竹身渐变 */}
            <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3d6b41" />
              <stop offset="12%" stopColor="#5a8d5e" />
              <stop offset="35%" stopColor="#6b9d6f" />
              <stop offset="50%" stopColor="#7aad7e" />
              <stop offset="65%" stopColor="#6b9d6f" />
              <stop offset="88%" stopColor="#4a7c4e" />
              <stop offset="100%" stopColor="#2d5b31" />
            </linearGradient>
            {/* 木签渐变 */}
            <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9a7a5a" />
              <stop offset="50%" stopColor="#c9a878" />
              <stop offset="100%" stopColor="#8a7050" />
            </linearGradient>
            {/* 选中签渐变（更亮） */}
            <linearGradient id="selWoodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b89868" />
              <stop offset="50%" stopColor="#e8c898" />
              <stop offset="100%" stopColor="#a08858" />
            </linearGradient>
            {/* 麻绳渐变 */}
            <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b7355" />
              <stop offset="50%" stopColor="#a08868" />
              <stop offset="100%" stopColor="#6b5b40" />
            </linearGradient>
            {/* 筒口暗影 */}
            <radialGradient id="openingGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="70%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#2a2a1a" />
            </radialGradient>
          </defs>

          {/* 地面阴影 */}
          <ellipse cx="90" cy="238" rx="55" ry="5" fill="rgba(0,0,0,0.18)" />

          {/* ===== 木签组（筒口后方） ===== */}
          <g className={isShaking ? 'divination-lots-jitter' : ''}>
            {/* 背景虚化签 */}
            <rect x="48" y="80" width="6" height="70" rx="2" fill="url(#woodGrad)" transform="rotate(-10 51 115)" opacity="0.5" filter="blur(1.2px)" />
            <rect x="62" y="70" width="6" height="80" rx="2" fill="url(#woodGrad)" transform="rotate(-5 65 110)" opacity="0.65" filter="blur(0.6px)" />
            <rect x="115" y="72" width="6" height="78" rx="2" fill="url(#woodGrad)" transform="rotate(5 118 111)" opacity="0.6" filter="blur(0.8px)" />
            <rect x="128" y="82" width="6" height="68" rx="2" fill="url(#woodGrad)" transform="rotate(11 131 116)" opacity="0.45" filter="blur(1.5px)" />

            {/* 选中签（中央，清晰，更高） */}
            <g className={isRevealing || phase === 'revealed' ? 'divination-lot-rise' : ''}>
              <rect x="83" y="45" width="10" height="105" rx="3" fill="url(#selWoodGrad)" />
              {/* 签头倒角高光 */}
              <rect x="83" y="45" width="10" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
              {/* 签身文字 */}
              {lot && (
                <text
                  x="88"
                  y="68"
                  textAnchor="middle"
                  fontSize="7"
                  fill="#3d2817"
                  fontWeight="bold"
                  fontFamily="'STKaiti', 'KaiTi', serif"
                >
                  {levelChar}
                </text>
              )}
              {/* 木纹细节 */}
              <line x1="86" y1="50" x2="86" y2="148" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
              <line x1="90" y1="50" x2="90" y2="148" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
            </g>
          </g>

          {/* ===== 竹筒主体 ===== */}
          {/* 筒口（暗色椭圆） */}
          <ellipse cx="90" cy="150" rx="42" ry="6" fill="url(#openingGrad)" />
          <ellipse cx="90" cy="148" rx="40" ry="4" fill="#0a0a0a" opacity="0.6" />

          {/* 筒身 */}
          <path d="M 48 150 L 48 240 L 132 240 L 132 150 Z" fill="url(#bambooGrad)" />

          {/* 纵向纤维纹理 */}
          <g opacity="0.2">
            {[58, 66, 74, 82, 90, 98, 106, 114, 122].map((x) => (
              <line key={x} x1={x} y1="150" x2={x} y2="240" stroke="#2a4c2e" strokeWidth="0.4" />
            ))}
          </g>

          {/* 竹节横纹 1 */}
          <rect x="46" y="178" width="88" height="2.5" fill="#2d5b31" opacity="0.7" />
          <rect x="46" y="180.5" width="88" height="1.5" fill="#8cbd8e" opacity="0.4" />

          {/* 麻绳绑带 */}
          <rect x="44" y="200" width="92" height="13" fill="url(#ropeGrad)" />
          {/* 绳纹斜线 */}
          <g opacity="0.35">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <line
                key={i}
                x1={44 + i * 8}
                y1="200"
                x2={44 + i * 8 + 6}
                y2="213"
                stroke="#5a4a30"
                strokeWidth="0.8"
              />
            ))}
          </g>
          {/* 绳结 */}
          <circle cx="90" cy="206.5" r="4" fill="#6b5b40" />
          <circle cx="90" cy="206.5" r="2.5" fill="#8b7355" />

          {/* 竹节横纹 2 */}
          <rect x="46" y="225" width="88" height="2.5" fill="#2d5b31" opacity="0.7" />
          <rect x="46" y="227.5" width="88" height="1.5" fill="#8cbd8e" opacity="0.4" />

          {/* 左侧高光 */}
          <rect x="48" y="150" width="6" height="90" fill="rgba(255,255,255,0.12)" rx="2" />
          {/* 右侧暗影 */}
          <rect x="126" y="150" width="6" height="90" fill="rgba(0,0,0,0.2)" rx="2" />
        </svg>
      </button>

      {/* 提示文字 */}
      {phase === 'idle' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-[#3d2817]/50 divination-hint-pulse">
          {zh ? '👆 轻触竹筒 · 诚心摇签' : '👆 Tap the tube · Draw with intention'}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 空闲面板
// ============================================================
function IdlePanel({ zh, onDraw }: { zh: boolean; onDraw: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center divination-panel-enter">
      <div className="text-center px-6">
        <div className="text-4xl mb-3 opacity-40" aria-hidden="true">禅</div>
        <div className="text-sm font-bold text-[#3d2817]/50 leading-relaxed mb-2" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>
          {zh ? '心静则万物莫不自得' : 'A quiet mind sees all things clearly'}
        </div>
        <div className="text-[11px] font-bold text-[#3d2817]/35 leading-relaxed mb-6">
          {zh
            ? '抽签不是为了预知未来\n而是借古人的智慧照见当下的心境'
            : 'Drawing lots is not to predict the future\nbut to see your present mind through ancient wisdom'}
        </div>
        <button
          onClick={onDraw}
          className="px-8 py-3 rounded-full border-[2px] border-[#3d2817] bg-[#5a8d5e] text-white font-black text-sm shadow-[3px_3px_0_0_#3d2817] transition-all active:translate-y-[2px] active:shadow-[1px_1px_0_0_#3d2817] hover:bg-[#4a7c4e] divination-breathe"
        >
          {zh ? '🎋 开始摇签' : '🎋 Begin Drawing'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 摇签中面板
// ============================================================
function ShakingPanel({ zh }: { zh: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center divination-panel-enter">
      <div className="text-center">
        <div className="text-3xl mb-3 animate-bounce" style={{ animationDuration: '0.8s' }} aria-hidden="true">
          🎋
        </div>
        <div className="text-sm font-black text-[#3d2817]/60" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>
          {zh ? '竹筒摇动中…' : 'Shaking the bamboo…'}
        </div>
        <div className="mt-2 text-[10px] font-bold text-[#3d2817]/35">
          {zh ? '签与签碰撞，缘分正在落定' : 'Lots are settling, fate is being woven'}
        </div>
        {/* 摇签进度点 */}
        <div className="flex gap-1.5 mt-4 justify-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#5a8d5e] divination-dot-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 解签面板
// ============================================================
function InterpretationPanel({
  lot,
  levelCfg,
  elemCfg,
  zh,
  revealed,
  onRedraw,
}: {
  lot: DivinationLot;
  levelCfg: typeof LEVEL_CONFIG['supreme'];
  elemCfg: typeof ELEMENT_CONFIG['wood'];
  zh: boolean;
  revealed: boolean;
  onRedraw: () => void;
}) {
  const poemLines = (zh ? lot.poem.zh : lot.poem.en).split('\n');

  return (
    <div className="h-full flex flex-col divination-panel-enter">
      {/* 木框笺纸 */}
      <div
        className="flex-1 flex flex-col overflow-hidden divination-scroll-unfold"
        style={{
          borderRadius: '4px',
          border: '3px solid #3d2817',
          boxShadow: '0 4px 12px rgba(61,40,23,0.2), inset 0 0 0 1px #7a5d47',
          background: `
            linear-gradient(135deg, rgba(245,235,210,0.95) 0%, rgba(237,228,208,0.95) 50%, rgba(230,220,200,0.95) 100%)
          `,
        }}
      >
        {/* 四角回纹雕花 */}
        <CornerOrnament className="top-0 left-0" />
        <CornerOrnament className="top-0 right-0 rotate-90" />
        <CornerOrnament className="bottom-0 left-0 -rotate-90" />
        <CornerOrnament className="bottom-0 right-0 rotate-180" />

        {/* 纸张纹理 */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* 内容区 */}
        <div className="relative flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: 'thin' }}>
          {/* 标题行 */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs font-black text-[#3d2817]/50 tracking-widest" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>
              {zh ? '解 签' : 'INTERPRET'}
            </div>
            <div className="text-[10px] font-bold text-[#3d2817]/40">
              {zh ? `第 ${lot.number} 签` : `Lot No. ${lot.number}`}
            </div>
          </div>

          {/* 签级 + 印章 */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div
                className="text-2xl font-black leading-none"
                style={{
                  color: levelCfg.accentColor,
                  fontFamily: "'STKaiti', 'KaiTi', serif",
                  textShadow: `0 0 12px ${levelCfg.glowColor}`,
                }}
              >
                {zh ? levelCfg.label.zh : levelCfg.label.en}
              </div>
              <div className="mt-1 text-[10px] font-bold text-[#3d2817]/40">
                {elemCfg.char} · {zh ? elemCfg.label.zh : elemCfg.label.en}
              </div>
              <div className="text-[9px] font-bold text-[#3d2817]/30">
                {zh ? elemCfg.desc.zh : elemCfg.desc.en}
              </div>
            </div>
            {/* 红色印章 */}
            <div
              className={`relative w-11 h-11 flex items-center justify-center ${revealed ? 'divination-seal-stamp' : 'opacity-0'}`}
              style={{
                background: levelCfg.accentColor === '#c89b3c' ? '#a93226' : '#a93226',
                borderRadius: '4px',
                border: '2px solid #8b2820',
                boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              <span
                className="text-white font-black text-lg leading-none"
                style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}
              >
                {levelCfg.sealChar}
              </span>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="h-px bg-[#3d2817]/15 mb-2.5" />

          {/* 签诗 */}
          <div className="mb-3">
            <div className="text-[10px] font-black text-[#3d2817]/40 mb-1.5 tracking-wider">
              {zh ? '◇ 签诗' : '◇ POEM'}
            </div>
            <div
              className="text-[13px] leading-[1.9] text-[#3d2817]/85 whitespace-pre-line"
              style={{ fontFamily: "'STKaiti', 'KaiTi', Georgia, serif" }}
            >
              {poemLines.map((line, i) => (
                <div key={i} className="divination-text-fade" style={{ animationDelay: `${i * 0.15}s` }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* 分隔线 */}
          <div className="h-px bg-[#3d2817]/15 mb-2.5" />

          {/* 签语 */}
          <div className="mb-3">
            <div className="text-[10px] font-black text-[#3d2817]/40 mb-1.5 tracking-wider">
              {zh ? '◇ 签语' : '◇ WISDOM'}
            </div>
            <div
              className="text-[12px] leading-[1.85] text-[#3d2817]/75 divination-text-fade"
              style={{ fontFamily: "'STSong', 'SimSun', Georgia, serif", animationDelay: '0.6s' }}
            >
              {zh ? lot.interpretation.zh : lot.interpretation.en}
            </div>
          </div>

          {/* 祝福语 */}
          <div
            className="text-center py-2 px-3 rounded-lg divination-text-fade"
            style={{
              background: `${levelCfg.glowColor}`,
              animationDelay: '0.9s',
            }}
          >
            <div className="text-[11px] font-black" style={{ color: levelCfg.accentColor, fontFamily: "'STKaiti', 'KaiTi', serif" }}>
              {zh ? `「${lot.blessing.zh}」` : `"${lot.blessing.en}"`}
            </div>
          </div>
        </div>

        {/* 底部操作区 */}
        <div
          className="relative flex items-center justify-between px-4 py-2.5 border-t-[2px] border-[#3d2817]/15"
          style={{ background: 'rgba(61,40,23,0.04)' }}
        >
          {/* 铜钱（装饰性缘分显示） */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #c89b3c 0%, #a07820 100%)',
                border: '1.5px solid #6b5010',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
              }}
            >
              <div className="w-2 h-2 bg-[#6b5010]" style={{ borderRadius: '1px' }} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-bold text-[#3d2817]/40">{zh ? '缘分' : 'Karma'}</span>
              <span className="text-xs font-black text-[#c89b3c]">+1</span>
            </div>
          </div>

          {/* 再抽一签按钮 */}
          <button
            onClick={onRedraw}
            disabled={!revealed}
            className={`px-5 py-2 rounded-lg border-[2px] font-black text-xs transition-all ${
              revealed
                ? 'border-[#3d2817] bg-[#5a8d5e] text-white shadow-[2px_2px_0_0_#3d2817] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#3d2817] hover:bg-[#4a7c4e]'
                : 'border-[#3d2817]/20 bg-[#3d2817]/10 text-[#3d2817]/30'
            }`}
          >
            {zh ? '🔄 再抽一签' : '🔄 Draw Again'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 四角回纹雕花装饰
// ============================================================
function CornerOrnament({ className }: { className: string }) {
  return (
    <svg
      className={`absolute w-5 h-5 opacity-30 pointer-events-none ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="#3d2817"
      strokeWidth="1.2"
    >
      <path d="M 2 2 L 2 8 L 8 8 L 8 4 L 4 4" />
      <path d="M 2 12 L 2 18 L 6 18" />
    </svg>
  );
}
