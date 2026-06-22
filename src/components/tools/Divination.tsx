// ============================================================
// Divination — 沉浸式抽签减压工具 v1.9.2
// 设计理念：进入禅意空间，水墨山水 + 庭院竹林 + 飘落竹叶
// 布局：竖屏 flex（顶栏 + 竹筒区 + 解签面板），底部操作区始终可见
// 3D 质感竹筒 + 渐变融入背景的解签面板
// ============================================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useI18n } from '../../i18n';
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

interface DivinationProps {
  onBack: () => void;
}

export default function Divination({ onBack }: DivinationProps) {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';

  const [phase, setPhase] = useState<Phase>('idle');
  const [currentLot, setCurrentLot] = useState<DivinationLot | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const [karma, setKarma] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    setDrawCount(getTodayDrawCount());
    try {
      const history = JSON.parse(localStorage.getItem('eq_divination_history') || '[]');
      setKarma(history.length);
    } catch {}
    return clearTimers;
  }, [clearTimers]);

  // ===== 核心：摇签流程（修复再抽一签 bug） =====
  const startShakingFlow = useCallback(() => {
    setPhase('shaking');

    // 摇签 1.2s（缩短，避免太慢）
    const t1 = setTimeout(() => {
      const lot = drawRandomLot();
      setCurrentLot(lot);
      setPhase('revealing');

      // 升签 0.9s（缩短）
      const t2 = setTimeout(() => {
        setPhase('revealed');
        audioManager.play('success');

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
      }, 900);
      timersRef.current.push(t2);
    }, 1200);
    timersRef.current.push(t1);
  }, []);

  const handleDraw = useCallback(() => {
    if (phase === 'shaking' || phase === 'revealing') return;

    audioManager.userTapped();
    audioManager.play('click');

    // 如果已抽过签，先重置到 idle 再开始新一轮（让动画有过渡）
    if (phase === 'revealed') {
      setCurrentLot(null);
      setPhase('idle');
      const t0 = setTimeout(() => {
        audioManager.play('click');
        startShakingFlow(); // ← 关键修复：继续启动摇签流程
      }, 300);
      timersRef.current.push(t0);
      return;
    }

    startShakingFlow();
  }, [phase, startShakingFlow]);

  const handleBack = useCallback(() => {
    audioManager.userTapped();
    audioManager.play('click');
    clearTimers();
    onBack();
  }, [clearTimers, onBack]);

  const levelCfg = currentLot ? LEVEL_CONFIG[currentLot.level] : null;
  const elemCfg = currentLot ? ELEMENT_CONFIG[currentLot.element] : null;

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col divination-root divination-bg-enter"
      style={{
        background: `
          radial-gradient(ellipse 140% 50% at 50% 0%, rgba(245,235,210,0.5) 0%, transparent 55%),
          radial-gradient(ellipse 90% 40% at 15% 90%, rgba(90,141,94,0.15) 0%, transparent 50%),
          radial-gradient(ellipse 90% 40% at 85% 85%, rgba(61,40,23,0.1) 0%, transparent 50%),
          linear-gradient(180deg, #ece4d4 0%, #ddd5c5 35%, #c8c0a8 70%, #b8b098 100%)
        `,
      }}
    >
      {/* ===== 背景层：水墨山水 + 庭院竹林 ===== */}
      <BackdropScene />

      {/* ===== 飘落竹叶特效 ===== */}
      <FloatingLeaves />

      {/* ===== 顶部导航（固定，不随滚动） ===== */}
      <header
        className="relative z-30 flex items-center justify-between px-4 flex-shrink-0"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))', paddingBottom: '0.5rem' }}
      >
        <button
          onClick={handleBack}
          aria-label={zh ? '返回工具箱' : 'Back to tools'}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-[2px] border-[#3d2817]/25 bg-white/60 backdrop-blur-md font-bold text-xs text-[#3d2817] transition-all active:scale-95 hover:bg-white/80 shadow-[0_2px_8px_rgba(61,40,23,0.12)]"
        >
          <span aria-hidden="true" className="text-base leading-none">←</span>
          {zh ? '工具' : 'Tools'}
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border-[2px] border-[#3d2817]/25 bg-white/60 backdrop-blur-md">
            <span className="text-sm" aria-hidden="true">🌸</span>
            <span className="text-[10px] font-black text-[#3d2817]">{zh ? '缘' : 'Karma'}</span>
            <span className="text-xs font-black text-[#c89b3c]">{karma}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border-[2px] border-[#3d2817]/25 bg-white/60 backdrop-blur-md">
            <span className="text-[10px] font-bold text-[#3d2817]/60">{zh ? `今日 ${drawCount}` : `Today ${drawCount}`}</span>
          </div>
        </div>
      </header>

      {/* ===== 主内容区（flex-1 撑满，底部操作区始终可见） ===== */}
      <main className="relative z-10 flex flex-col flex-1 px-4 min-h-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* ===== 上部：竹筒交互区（缩小比例，留更多空间给面板） ===== */}
        <div className="flex items-end justify-center flex-shrink-0" style={{ height: '32vh', minHeight: '180px' }}>
          <BambooTube phase={phase} lot={currentLot} levelChar={levelCfg?.shortLabel.zh ?? ''} sealChar={levelCfg?.sealChar ?? ''} onDraw={handleDraw} zh={zh} />
        </div>

        {/* ===== 提示文字（独立行，不与竹筒重叠） ===== */}
        {phase === 'idle' && (
          <div className="text-center flex-shrink-0 py-1">
            <span className="text-[11px] font-bold text-[#3d2817]/50 divination-hint-pulse">
              {zh ? '👆 轻触竹筒 · 诚心摇签' : '👆 Tap the tube · Draw with intention'}
            </span>
          </div>
        )}

        {/* ===== 下部：解签面板（flex-1，内部滚动，底部操作区固定可见） ===== */}
        <div className="flex-1 flex flex-col min-h-0 pb-2">
          {phase === 'idle' && <IdlePanel zh={zh} onDraw={handleDraw} />}
          {phase === 'shaking' && <ShakingPanel zh={zh} />}
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
      </main>
    </div>
  );
}

// ============================================================
// 背景场景：水墨山水 + 庭院竹林（浅色衬底，清晰可见）
// ============================================================
function BackdropScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* ===== 顶部竹叶画框（清晰） ===== */}
      <svg className="absolute top-0 left-0 w-full h-16 opacity-40" viewBox="0 0 375 64" preserveAspectRatio="xMidYMid slice">
        <g fill="#4a7c4e">
          <ellipse cx="25" cy="18" rx="20" ry="4.5" transform="rotate(-30 25 18)" opacity="0.7" />
          <ellipse cx="52" cy="10" rx="22" ry="4" transform="rotate(-20 52 10)" opacity="0.6" />
          <ellipse cx="80" cy="20" rx="18" ry="4" transform="rotate(-35 80 20)" opacity="0.5" />
          <ellipse cx="345" cy="16" rx="20" ry="4.5" transform="rotate(25 345 16)" opacity="0.7" />
          <ellipse cx="318" cy="8" rx="22" ry="4" transform="rotate(15 318 8)" opacity="0.6" />
          <ellipse cx="290" cy="22" rx="18" ry="4" transform="rotate(30 290 22)" opacity="0.5" />
          {/* 竹枝 */}
          <path d="M 0 30 Q 30 25, 60 28 Q 90 22, 100 26" fill="none" stroke="#4a7c4e" strokeWidth="1.2" opacity="0.4" />
          <path d="M 375 28 Q 340 24, 310 27 Q 280 22, 270 25" fill="none" stroke="#4a7c4e" strokeWidth="1.2" opacity="0.4" />
        </g>
      </svg>

      {/* ===== 远山层（水墨淡彩，清晰可见） ===== */}
      <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-35" viewBox="0 0 375 300" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="farMountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7a8b7a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5a6b5a" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M0,300 L0,160 Q50,110 100,135 Q150,100 200,125 Q250,90 300,120 Q350,95 375,115 L375,300 Z" fill="url(#farMountain)" />
      </svg>

      {/* ===== 中山层 + 云雾 ===== */}
      <svg className="absolute bottom-0 left-0 w-full h-2/5 opacity-40" viewBox="0 0 375 250" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="midMountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a6b5a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3a4b3a" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M0,250 L0,180 Q60,145 120,160 Q180,135 240,155 Q300,125 375,150 L375,250 Z" fill="url(#midMountain)" />
        {/* 山间云雾 */}
        <ellipse cx="90" cy="168" rx="45" ry="7" fill="white" opacity="0.4" />
        <ellipse cx="250" cy="162" rx="55" ry="8" fill="white" opacity="0.35" />
        <ellipse cx="180" cy="175" rx="35" ry="5" fill="white" opacity="0.3" />
      </svg>

      {/* ===== 近山层 + 庭院小桥 ===== */}
      <svg className="absolute bottom-0 left-0 w-full h-1/3 opacity-45" viewBox="0 0 375 200" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="nearMountain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a4b3a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2a3b2a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d="M0,200 L0,150 Q70,130 140,142 Q210,125 280,140 Q340,130 375,140 L375,200 Z" fill="url(#nearMountain)" />
        {/* 庭院小桥 */}
        <path d="M 110 168 Q 150 148, 190 168" fill="none" stroke="#5a4a3a" strokeWidth="2" opacity="0.5" />
        <line x1="115" y1="168" x2="115" y2="176" stroke="#5a4a3a" strokeWidth="1.2" opacity="0.4" />
        <line x1="135" y1="162" x2="135" y2="172" stroke="#5a4a3a" strokeWidth="1" opacity="0.35" />
        <line x1="165" y1="162" x2="165" y2="172" stroke="#5a4a3a" strokeWidth="1" opacity="0.35" />
        <line x1="185" y1="168" x2="185" y2="176" stroke="#5a4a3a" strokeWidth="1.2" opacity="0.4" />
        {/* 水面波纹 */}
        <path d="M 100 178 Q 120 176, 140 178 Q 160 180, 180 178 Q 200 176, 220 178" fill="none" stroke="#5a6b7a" strokeWidth="0.8" opacity="0.3" />
      </svg>

      {/* ===== 底部竹林（左右两侧，清晰可见） ===== */}
      <svg className="absolute bottom-0 left-0 w-full h-2/5 opacity-35" viewBox="0 0 375 200" preserveAspectRatio="xMidYMax slice">
        {/* 左侧竹丛 */}
        {[10, 25, 40, 5, 33].map((x, i) => {
          const h = 130 + (i % 3) * 35;
          const y = 200 - h;
          return (
            <g key={`l${i}`} opacity={0.5 + (i % 2) * 0.2}>
              {/* 竹竿 */}
              <rect x={x} y={y} width="4" height={h} fill="#4a7c4e" />
              {/* 竹节 */}
              <rect x={x - 1} y={y + h * 0.25} width="6" height="2.5" fill="#2d5b31" opacity="0.7" />
              <rect x={x - 1} y={y + h * 0.5} width="6" height="2.5" fill="#2d5b31" opacity="0.7" />
              <rect x={x - 1} y={y + h * 0.75} width="6" height="2.5" fill="#2d5b31" opacity="0.7" />
              {/* 竹叶簇 */}
              <ellipse cx={x + 3} cy={y + 3} rx="12" ry="3.5" fill="#5a8d5e" opacity="0.6" transform={`rotate(${-35 + i * 12} ${x + 3} ${y + 3})`} />
              <ellipse cx={x - 1} cy={y + 12} rx="10" ry="3" fill="#5a8d5e" opacity="0.5" transform={`rotate(${25 + i * 10} ${x - 1} ${y + 12})`} />
              <ellipse cx={x + 4} cy={y + 20} rx="11" ry="3" fill="#5a8d5e" opacity="0.45" transform={`rotate(${-20 + i * 8} ${x + 4} ${y + 20})`} />
            </g>
          );
        })}
        {/* 右侧竹丛 */}
        {[328, 343, 358, 320, 350].map((x, i) => {
          const h = 120 + (i % 3) * 40;
          const y = 200 - h;
          return (
            <g key={`r${i}`} opacity={0.5 + (i % 2) * 0.2}>
              <rect x={x} y={y} width="4" height={h} fill="#4a7c4e" />
              <rect x={x - 1} y={y + h * 0.25} width="6" height="2.5" fill="#2d5b31" opacity="0.7" />
              <rect x={x - 1} y={y + h * 0.5} width="6" height="2.5" fill="#2d5b31" opacity="0.7" />
              <rect x={x - 1} y={y + h * 0.75} width="6" height="2.5" fill="#2d5b31" opacity="0.7" />
              <ellipse cx={x + 3} cy={y + 3} rx="12" ry="3.5" fill="#5a8d5e" opacity="0.6" transform={`rotate(${35 - i * 12} ${x + 3} ${y + 3})`} />
              <ellipse cx={x + 5} cy={y + 12} rx="10" ry="3" fill="#5a8d5e" opacity="0.5" transform={`rotate(${-25 - i * 10} ${x + 5} ${y + 12})`} />
              <ellipse cx={x + 2} cy={y + 20} rx="11" ry="3" fill="#5a8d5e" opacity="0.45" transform={`rotate(${20 + i * 8} ${x + 2} ${y + 20})`} />
            </g>
          );
        })}
      </svg>

      {/* ===== 石灯笼装饰（左下角，清晰） ===== */}
      <svg className="absolute bottom-3 left-1 w-11 h-18 opacity-35" viewBox="0 0 44 72">
        <ellipse cx="22" cy="69" rx="14" ry="3" fill="#3d2817" opacity="0.4" />
        <rect x="16" y="62" width="12" height="6" fill="#5a4a3a" opacity="0.8" />
        <rect x="18" y="52" width="8" height="10" fill="#6a5a4a" opacity="0.8" />
        <path d="M 12 36 L 32 36 L 28 52 L 16 52 Z" fill="#8a7a5a" opacity="0.75" />
        <rect x="14" y="34" width="16" height="3" fill="#5a4a3a" opacity="0.8" />
        <rect x="16" y="24" width="12" height="10" fill="#6a5a4a" opacity="0.8" />
        <rect x="18" y="16" width="8" height="8" fill="#5a4a3a" opacity="0.8" />
        {/* 灯光 */}
        <circle cx="22" cy="44" r="3.5" fill="#fbbf24" opacity="0.5" />
        <circle cx="22" cy="44" r="2" fill="#fef3c7" opacity="0.4" />
      </svg>

      {/* ===== 右下角苔石装饰 ===== */}
      <svg className="absolute bottom-2 right-1 w-16 h-10 opacity-30" viewBox="0 0 64 40">
        <ellipse cx="20" cy="32" rx="16" ry="8" fill="#5a6b5a" opacity="0.5" />
        <ellipse cx="40" cy="34" rx="12" ry="6" fill="#4a5b4a" opacity="0.5" />
        <ellipse cx="15" cy="28" rx="4" ry="2" fill="#5a8d5e" opacity="0.4" />
        <ellipse cx="48" cy="31" rx="3" ry="1.5" fill="#5a8d5e" opacity="0.4" />
      </svg>

      {/* ===== 水墨晕染（底部，增加层次） ===== */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(58,75,58,0.06) 50%, rgba(58,75,58,0.12) 100%)',
        }}
      />
    </div>
  );
}

// ============================================================
// 飘落竹叶特效（风吹竹叶飘过）
// ============================================================
function FloatingLeaves() {
  // 用 useMemo 固定叶子参数，避免每次渲染重新随机
  const leaves = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      left: `${5 + i * 13 + Math.random() * 8}%`,
      delay: `${i * 2.5 + Math.random() * 3}s`,
      duration: `${10 + Math.random() * 6}s`,
      size: 10 + Math.random() * 8,
      rotateStart: -20 + Math.random() * 40,
      drift: 30 + Math.random() * 40,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute divination-leaf-drift"
          style={{
            left: leaf.left,
            top: '-5%',
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            ['--leaf-drift' as string]: `${leaf.drift}px`,
            ['--leaf-rotate' as string]: `${leaf.rotateStart}deg`,
          }}
        >
          <svg width={leaf.size} height={leaf.size * 0.35} viewBox="0 0 20 7">
            <ellipse cx="10" cy="3.5" rx="9" ry="2.5" fill="#5a8d5e" opacity="0.5" />
            <line x1="2" y1="3.5" x2="18" y2="3.5" stroke="#3d6b41" strokeWidth="0.3" opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 竹筒组件（3D 质感增强版）
// ============================================================
function BambooTube({
  phase,
  lot,
  levelChar,
  sealChar,
  onDraw,
  zh,
}: {
  phase: Phase;
  lot: DivinationLot | null;
  levelChar: string;
  sealChar: string;
  onDraw: () => void;
  zh: boolean;
}) {
  const isShaking = phase === 'shaking';
  const isRevealing = phase === 'revealing';
  const isInteractive = phase === 'idle' || phase === 'revealed';
  // 签文显示：用印章字（吉/福/平/守/忍），单字，楷体，渐显
  const displayChar = lot ? sealChar : '';

  return (
    <div className="relative flex flex-col items-center">
      {/* 光晕（revealing 时显示） */}
      {isRevealing && lot && (
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none divination-glow"
          style={{
            background: `radial-gradient(circle, ${LEVEL_CONFIG[lot.level].glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* 粒子效果（revealing 时显示） */}
      {isRevealing && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-44 h-36 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full divination-particle"
              style={{
                left: `${12 + i * 8}%`,
                bottom: '0%',
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                background: i % 2 === 0 ? 'rgba(200,155,60,0.7)' : 'rgba(255,255,255,0.6)',
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 竹筒 SVG（3D 质感增强） */}
      <button
        onClick={onDraw}
        disabled={!isInteractive}
        aria-label={zh ? '点击竹筒抽签' : 'Tap bamboo tube to draw a lot'}
        className={`relative bg-transparent border-0 p-0 ${isShaking ? 'divination-shake' : ''} ${isInteractive ? 'cursor-pointer hover:scale-[1.04] active:scale-95' : 'cursor-default'} transition-transform duration-300`}
        style={{ transformOrigin: 'bottom center' }}
      >
        <svg width="140" height="195" viewBox="0 0 180 240" className="overflow-visible">
          <defs>
            {/* 竹筒主体渐变（增强3D感：左暗→中亮→右暗） */}
            <linearGradient id="bambooGrad3d" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2d5b31" />
              <stop offset="8%" stopColor="#3d6b41" />
              <stop offset="25%" stopColor="#5a8d5e" />
              <stop offset="42%" stopColor="#7aad7e" />
              <stop offset="50%" stopColor="#8cbd8e" />
              <stop offset="58%" stopColor="#7aad7e" />
              <stop offset="75%" stopColor="#5a8d5e" />
              <stop offset="92%" stopColor="#3d6b41" />
              <stop offset="100%" stopColor="#1d4b21" />
            </linearGradient>
            {/* 竹节环渐变 */}
            <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4b21" />
              <stop offset="20%" stopColor="#2d5b31" />
              <stop offset="50%" stopColor="#4a7c4e" />
              <stop offset="80%" stopColor="#2d5b31" />
              <stop offset="100%" stopColor="#1d4b21" />
            </linearGradient>
            {/* 木签渐变（3D） */}
            <linearGradient id="woodGrad3d" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a7050" />
              <stop offset="30%" stopColor="#b89868" />
              <stop offset="50%" stopColor="#d8b888" />
              <stop offset="70%" stopColor="#b89868" />
              <stop offset="100%" stopColor="#7a6040" />
            </linearGradient>
            {/* 选中签渐变（更亮，3D） */}
            <linearGradient id="selWoodGrad3d" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a08858" />
              <stop offset="25%" stopColor="#d8b888" />
              <stop offset="50%" stopColor="#f0d8a8" />
              <stop offset="75%" stopColor="#d8b888" />
              <stop offset="100%" stopColor="#907850" />
            </linearGradient>
            {/* 绳子渐变 */}
            <linearGradient id="ropeGrad3d" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5a4a30" />
              <stop offset="30%" stopColor="#8b7355" />
              <stop offset="50%" stopColor="#a08868" />
              <stop offset="70%" stopColor="#8b7355" />
              <stop offset="100%" stopColor="#4a3a20" />
            </linearGradient>
            {/* 筒口深度渐变 */}
            <radialGradient id="openingGrad3d" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="50%" stopColor="#0a0a0a" />
              <stop offset="85%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#2a2a1a" />
            </radialGradient>
            {/* 筒口边缘高光 */}
            <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2d5b31" />
              <stop offset="50%" stopColor="#6b9d6f" />
              <stop offset="100%" stopColor="#2d5b31" />
            </linearGradient>
          </defs>

          {/* 地面阴影（更柔和） */}
          <ellipse cx="90" cy="238" rx="58" ry="6" fill="rgba(0,0,0,0.22)" filter="blur(2px)" />

          {/* ===== 木签组（筒口后方） ===== */}
          <g className={isShaking ? 'divination-lots-jitter' : ''}>
            {/* 背景签（模糊，营造深度） */}
            <rect x="48" y="80" width="7" height="70" rx="2.5" fill="url(#woodGrad3d)" transform="rotate(-12 51 115)" opacity="0.5" filter="blur(1.5px)" />
            <rect x="62" y="70" width="7" height="80" rx="2.5" fill="url(#woodGrad3d)" transform="rotate(-6 65 110)" opacity="0.65" filter="blur(0.8px)" />
            <rect x="115" y="72" width="7" height="78" rx="2.5" fill="url(#woodGrad3d)" transform="rotate(6 118 111)" opacity="0.6" filter="blur(1px)" />
            <rect x="128" y="82" width="7" height="68" rx="2.5" fill="url(#woodGrad3d)" transform="rotate(13 131 116)" opacity="0.45" filter="blur(1.8px)" />

            {/* 选中签（中央，清晰，更宽以容纳文字） */}
            <g className={isRevealing || phase === 'revealed' ? 'divination-lot-rise' : ''}>
              {/* 签条主体（加宽到 16px，容纳楷体大字） */}
              <rect x="79" y="40" width="16" height="115" rx="3" fill="url(#selWoodGrad3d)" />
              {/* 顶部高光 */}
              <rect x="79" y="40" width="16" height="8" rx="3" fill="rgba(255,255,255,0.3)" />
              {/* 左侧高光线 */}
              <rect x="80" y="48" width="1.5" height="105" fill="rgba(255,255,255,0.2)" rx="0.5" />
              {/* 右侧阴影线 */}
              <rect x="93" y="48" width="1.5" height="105" fill="rgba(0,0,0,0.15)" rx="0.5" />
              {/* 签文淡色衬底（矩形底纹，像盖章的底色） */}
              {lot && displayChar && (
                <rect x="81" y="55" width="12" height="14" rx="1" fill="rgba(169,50,38,0.08)" />
              )}
              {/* 签文（楷体单字，渐显动画） */}
              {lot && displayChar && (
                <text
                  x="87"
                  y="66"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#a93226"
                  fontWeight="bold"
                  fontFamily="'STKaiti', 'KaiTi', 'STXingkai', '行楷', serif"
                  className="divination-lot-text-reveal"
                >
                  {displayChar}
                </text>
              )}
              {/* 底部装饰线 */}
              <line x1="82" y1="148" x2="92" y2="148" stroke="#3d2817" strokeWidth="0.4" opacity="0.3" />
            </g>
          </g>

          {/* ===== 筒口（3D 深度） ===== */}
          <ellipse cx="90" cy="150" rx="44" ry="7" fill="url(#rimGrad)" />
          <ellipse cx="90" cy="150" rx="40" ry="5.5" fill="url(#openingGrad3d)" />
          <ellipse cx="78" cy="149" rx="8" ry="2" fill="rgba(255,255,255,0.08)" />

          {/* ===== 竹筒主体（3D 圆柱感） ===== */}
          <path d="M 46 150 L 46 240 L 134 240 L 134 150 Z" fill="url(#bambooGrad3d)" />

          {/* 竖向纹理（竹纤维感） */}
          <g opacity="0.15">
            {[54, 62, 70, 78, 86, 94, 102, 110, 118, 126].map((x) => (
              <line key={x} x1={x} y1="152" x2={x} y2="238" stroke="#1a3a1e" strokeWidth="0.5" />
            ))}
          </g>

          {/* 左侧高光带（3D 圆柱感） */}
          <rect x="50" y="152" width="8" height="86" fill="rgba(255,255,255,0.18)" rx="3" />
          <rect x="52" y="154" width="3" height="82" fill="rgba(255,255,255,0.12)" rx="1.5" />

          {/* 右侧阴影带（3D 圆柱感） */}
          <rect x="122" y="152" width="10" height="86" fill="rgba(0,0,0,0.22)" rx="3" />
          <rect x="128" y="154" width="3" height="82" fill="rgba(0,0,0,0.15)" rx="1.5" />

          {/* ===== 竹节环 1（上部） ===== */}
          <rect x="44" y="175" width="92" height="5" fill="url(#nodeGrad)" />
          <rect x="44" y="175" width="92" height="1.5" fill="rgba(255,255,255,0.15)" />
          <rect x="44" y="179" width="92" height="1" fill="rgba(0,0,0,0.3)" />

          {/* ===== 绳结装饰（中部） ===== */}
          <rect x="42" y="198" width="96" height="16" fill="url(#ropeGrad3d)" />
          <g opacity="0.4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <line
                key={i}
                x1={42 + i * 8}
                y1="198"
                x2={42 + i * 8 + 7}
                y2="214"
                stroke="#3a2a10"
                strokeWidth="1"
              />
            ))}
          </g>
          <circle cx="90" cy="206" r="5.5" fill="url(#ropeGrad3d)" />
          <circle cx="90" cy="206" r="4" fill="#6b5b40" />
          <circle cx="89" cy="205" r="1.5" fill="rgba(255,255,255,0.25)" />

          {/* ===== 竹节环 2（下部） ===== */}
          <rect x="44" y="222" width="92" height="5" fill="url(#nodeGrad)" />
          <rect x="44" y="222" width="92" height="1.5" fill="rgba(255,255,255,0.15)" />
          <rect x="44" y="226" width="92" height="1" fill="rgba(0,0,0,0.3)" />

          {/* 底部阴影 */}
          <ellipse cx="90" cy="239" rx="44" ry="3" fill="rgba(0,0,0,0.25)" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================
// 空闲面板
// ============================================================
function IdlePanel({ zh, onDraw }: { zh: boolean; onDraw: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 divination-panel-enter">
      <div className="text-center px-6">
        <div className="text-3xl mb-2 opacity-40" aria-hidden="true" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>禅</div>
        <div className="text-sm font-bold text-[#3d2817]/55 leading-relaxed mb-1.5" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>
          {zh ? '心静则万物莫不自得' : 'A quiet mind sees all things clearly'}
        </div>
        <div className="text-[11px] font-bold text-[#3d2817]/35 leading-relaxed mb-5">
          {zh
            ? '抽签不是为了预知未来\n而是借古人的智慧照见当下的心境'
            : 'Drawing lots is not to predict the future\nbut to see your present mind through ancient wisdom'}
        </div>
        <button
          onClick={onDraw}
          className="px-8 py-3 rounded-full border-[2px] border-[#3d2817] bg-gradient-to-b from-[#6b9d6f] to-[#4a7c4e] text-white font-black text-sm shadow-[0_4px_12px_rgba(74,124,78,0.4),3px_3px_0_0_#3d2817] transition-all active:translate-y-[2px] active:shadow-[0_2px_6px_rgba(74,124,78,0.3),1px_1px_0_0_#3d2817] hover:from-[#7aad7e] hover:to-[#5a8d5e] divination-breathe"
        >
          {zh ? '🎋 开始摇签' : '🎋 Begin Drawing'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 摇签中面板（文字不遮盖竹筒，放在下方）
// ============================================================
function ShakingPanel({ zh }: { zh: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 divination-panel-enter">
      <div className="text-center">
        <div className="text-sm font-black text-[#3d2817]/60 mb-1" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>
          {zh ? '竹筒摇动中…' : 'Shaking the bamboo…'}
        </div>
        <div className="text-[10px] font-bold text-[#3d2817]/35 mb-3">
          {zh ? '签与签碰撞，缘分正在落定' : 'Lots are settling, fate is being woven'}
        </div>
        <div className="flex gap-1.5 justify-center">
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
// 解签面板（渐变融入背景 + 质感提升）
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
    <div className="flex flex-col divination-panel-enter min-h-0 flex-1">
      {/* 木框笺纸（渐变融入背景 + 淡色衬底纹理 + 质感提升） */}
      <div
        className="relative flex flex-col overflow-hidden divination-scroll-unfold flex-1 min-h-0"
        style={{
          borderRadius: '12px 12px 8px 8px',
          boxShadow: `
            0 2px 8px rgba(61,40,23,0.12),
            0 8px 24px rgba(61,40,23,0.08),
            inset 0 1px 0 rgba(255,255,255,0.5),
            inset 0 0 0 1px rgba(122,93,71,0.3)
          `,
          background: `
            linear-gradient(135deg, rgba(245,235,210,0.97) 0%, rgba(237,228,208,0.97) 50%, rgba(230,220,200,0.97) 100%)
          `,
          maskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 92%, transparent 100%)',
        }}
      >
        {/* ===== 淡色衬底纹理：传统信笺暗纹（高级感） ===== */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(122,93,71,0.04) 1px, transparent 2px),
              radial-gradient(circle at 80% 70%, rgba(122,93,71,0.03) 1px, transparent 2px),
              repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(122,93,71,0.025) 28px, rgba(122,93,71,0.025) 29px)
            `,
            backgroundSize: '40px 40px, 50px 50px, 100% 100%',
          }}
        />
        {/* 衬底水印：大字"禅"（极淡） */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            fontSize: '120px',
            fontFamily: "'STKaiti', 'KaiTi', serif",
            color: 'rgba(122,93,71,0.04)',
            fontWeight: 'bold',
            lineHeight: 1,
          }}
        >
          {zh ? '禅' : 'Zen'}
        </div>
        {/* 顶部装饰条（渐变，非硬边框） */}
        <div
          className="h-1 flex-shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${levelCfg.accentColor}40 20%, ${levelCfg.accentColor}80 50%, ${levelCfg.accentColor}40 80%, transparent 100%)`,
          }}
        />

        {/* 内容区（可滚动） */}
        <div className="relative flex-1 overflow-y-auto px-4 py-3 min-h-0" style={{ scrollbarWidth: 'thin' }}>
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
            {/* 红色印章（3D 质感） */}
            <div
              className={`relative w-11 h-11 flex items-center justify-center ${revealed ? 'divination-seal-stamp' : 'opacity-0'}`}
              style={{
                background: 'linear-gradient(135deg, #c93828 0%, #a93226 50%, #8b2820 100%)',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.2)',
                border: '1.5px solid #7b2218',
              }}
            >
              <span
                className="text-white font-black text-lg leading-none"
                style={{ fontFamily: "'STKaiti', 'KaiTi', serif", textShadow: '0 1px 1px rgba(0,0,0,0.3)' }}
              >
                {levelCfg.sealChar}
              </span>
            </div>
          </div>

          {/* 分隔线（渐变，非硬线） */}
          <div className="h-px mb-2.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(61,40,23,0.2), transparent)' }} />

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
                <div key={i} className="divination-text-fade" style={{ animationDelay: `${i * 0.12}s` }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* 分隔线 */}
          <div className="h-px mb-2.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(61,40,23,0.2), transparent)' }} />

          {/* 签语 */}
          <div className="mb-3">
            <div className="text-[10px] font-black text-[#3d2817]/40 mb-1.5 tracking-wider">
              {zh ? '◇ 签语' : '◇ WISDOM'}
            </div>
            <div
              className="text-[12px] leading-[1.85] text-[#3d2817]/75 divination-text-fade"
              style={{ fontFamily: "'STSong', 'SimSun', Georgia, serif", animationDelay: '0.5s' }}
            >
              {zh ? lot.interpretation.zh : lot.interpretation.en}
            </div>
          </div>

          {/* 祝福语 */}
          <div
            className="text-center py-2 px-3 rounded-lg divination-text-fade"
            style={{
              background: `linear-gradient(135deg, ${levelCfg.glowColor} 0%, ${levelCfg.glowColor}90 100%)`,
              animationDelay: '0.8s',
            }}
          >
            <div className="text-[11px] font-black" style={{ color: levelCfg.accentColor, fontFamily: "'STKaiti', 'KaiTi', serif" }}>
              {zh ? `「${lot.blessing.zh}」` : `"${lot.blessing.en}"`}
            </div>
          </div>
        </div>

        {/* 底部操作区（固定，不被遮挡） */}
        <div
          className="relative flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, rgba(61,40,23,0.02) 0%, rgba(61,40,23,0.06) 100%)',
            borderTop: '1px solid rgba(61,40,23,0.08)',
          }}
        >
          {/* 铜钱（缘分显示，3D 质感） */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #d9ab44 0%, #c89b3c 40%, #a07820 100%)',
                border: '1.5px solid #6b5010',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              <div className="w-2 h-2 bg-[#6b5010]" style={{ borderRadius: '1px' }} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-bold text-[#3d2817]/40">{zh ? '缘分' : 'Karma'}</span>
              <span className="text-xs font-black text-[#c89b3c]">+1</span>
            </div>
          </div>

          {/* 再抽一签按钮（质感增强） */}
          <button
            onClick={onRedraw}
            disabled={!revealed}
            className={`px-5 py-2.5 rounded-lg border-[2px] font-black text-xs transition-all ${
              revealed
                ? 'border-[#3d2817] bg-gradient-to-b from-[#6b9d6f] to-[#4a7c4e] text-white shadow-[0_2px_6px_rgba(74,124,78,0.3),2px_2px_0_0_#3d2817] active:translate-y-[1px] active:shadow-[0_1px_3px_rgba(74,124,78,0.2),1px_1px_0_0_#3d2817] hover:from-[#7aad7e] hover:to-[#5a8d5e]'
                : 'border-[#3d2817]/15 bg-[#3d2817]/8 text-[#3d2817]/30'
            }`}
          >
            {zh ? '🔄 再抽一签' : '🔄 Draw Again'}
          </button>
        </div>
      </div>
    </div>
  );
}
