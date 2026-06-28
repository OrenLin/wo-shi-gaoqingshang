// ============================================================
// CollectionViewer — 藏品展示柜（博物馆手办柜风格）
// 特点：射灯光晕、玻璃柜门、圆形展台、金属铭牌、稀有度系统
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';

type Rarity = 'LEGENDARY' | 'EPIC' | 'RARE';

interface CollectionItem {
  id: string;
  code: string;
  series: { zh: string; en: string };
  name: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  description: { zh: string; en: string };
  emoji: string;
  gif: string;
  static?: boolean;
  accent: string;
  glow: string;
  pedestal: string;
  rarity: Rarity;
}

const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: 'gundam',
    code: 'RX-78',
    series: { zh: '机动战士', en: 'Mobile Suit' },
    name: { zh: '高达', en: 'Gundam' },
    subtitle: { zh: '机甲', en: 'Mecha' },
    description: {
      zh: '钢铁之翼，守护和平的机动战士。',
      en: 'Iron wings, the mobile suit that guards peace.',
    },
    emoji: '🤖',
    gif: '/collections/gundam.gif',
    accent: 'from-sky-400 to-blue-600',
    glow: 'rgba(56, 189, 248, 0.45)',
    pedestal: 'from-slate-700 to-slate-900',
    rarity: 'LEGENDARY',
  },
  {
    id: 'taxi',
    code: 'T0678',
    series: { zh: '城市记忆', en: 'City Memory' },
    name: { zh: '出租车', en: 'Taxi' },
    subtitle: { zh: '载具', en: 'Vehicle' },
    description: {
      zh: 'T0678 可靠的伙伴，永远的回忆。',
      en: 'T0678 — A reliable partner, an eternal memory.',
    },
    emoji: '🚕',
    gif: '/collections/taxi.gif',
    accent: 'from-amber-400 to-orange-500',
    glow: 'rgba(251, 191, 36, 0.45)',
    pedestal: 'from-amber-800 to-amber-950',
    rarity: 'EPIC',
  },
  {
    id: 'dog',
    code: 'XX-01',
    series: { zh: '萌宠志', en: 'Pet Tales' },
    name: { zh: '香香', en: 'Xiangxiang' },
    subtitle: { zh: '小狗', en: 'Puppy' },
    description: {
      zh: '有一只可爱的小狗，叫做香香，他喜欢溜溜猫。',
      en: 'A cute little dog named Xiangxiang who loves walking cats.',
    },
    emoji: '🐶',
    gif: '/collections/dog.gif',
    static: true,
    accent: 'from-orange-400 to-rose-500',
    glow: 'rgba(251, 146, 60, 0.45)',
    pedestal: 'from-orange-800 to-orange-950',
    rarity: 'RARE',
  },
  {
    id: 'cat',
    code: 'FL-02',
    series: { zh: '萌宠志', en: 'Pet Tales' },
    name: { zh: '风铃', en: 'Fengling' },
    subtitle: { zh: '猫猫', en: 'Kitty' },
    description: {
      zh: '有一只大怨种猫，叫做风铃，总是没有笑脸。',
      en: 'A grumpy cat named Fengling who never smiles.',
    },
    emoji: '🐱',
    gif: '/collections/cat.gif',
    accent: 'from-violet-400 to-fuchsia-600',
    glow: 'rgba(167, 139, 250, 0.45)',
    pedestal: 'from-violet-800 to-violet-950',
    rarity: 'RARE',
  },
];

const RARITY_CONFIG: Record<Rarity, { zh: string; en: string; dot: string; ring: string }> = {
  LEGENDARY: { zh: '传说', en: 'Legendary', dot: 'bg-amber-400', ring: 'ring-amber-400/60' },
  EPIC: { zh: '史诗', en: 'Epic', dot: 'bg-fuchsia-400', ring: 'ring-fuchsia-400/60' },
  RARE: { zh: '稀有', en: 'Rare', dot: 'bg-sky-400', ring: 'ring-sky-400/60' },
};

export default function CollectionViewer() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [triggeredGifs, setTriggeredGifs] = useState<Set<string>>(new Set());
  const [loadedGifs, setLoadedGifs] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // 懒加载：仅当 GIF 进入视口时才触发加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id && !triggeredGifs.has(id)) {
              const img = entry.target.querySelector('img[data-src]') as HTMLImageElement;
              if (img) {
                img.src = img.dataset.src!;
                setTriggeredGifs((prev) => new Set(prev).add(id));
              }
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    const items = containerRef.current?.querySelectorAll('[data-id]');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [triggeredGifs]);

  const selectedItem = COLLECTION_ITEMS.find((i) => i.id === selectedId);

  const handleSelect = (id: string) => {
    audioManager.userTapped();
    audioManager.play('click');
    setSelectedId(id);
  };

  const handleClose = () => {
    audioManager.userTapped();
    audioManager.play('click');
    setSelectedId(null);
  };

  return (
    <div ref={containerRef} className="animate-pop-in">
      {/* === 展示柜标题 === */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 shadow-sm">
          <span className="text-base">🏛️</span>
          <span className="text-xs font-black text-[#1a1a2e] tracking-wider">
            {zh ? '我的藏品柜' : 'MY SHOWCASE'}
          </span>
          <span className="text-[10px] font-bold text-[#1a1a2e]/50 tabular-nums">
            {COLLECTION_ITEMS.length} {zh ? '件' : 'ITEMS'}
          </span>
        </div>
      </div>

      {/* === 展示柜网格（2x2） === */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {COLLECTION_ITEMS.map((item, idx) => {
          const rarity = RARITY_CONFIG[item.rarity];
          const isLoaded = loadedGifs.has(item.id);
          return (
            <button
              key={item.id}
              data-id={item.id}
              onClick={() => handleSelect(item.id)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] hover:-translate-y-[3px] hover:shadow-[6px_6px_0_0_#1a1a2e] active:translate-y-0 active:shadow-[2px_2px_0_0_#1a1a2e] transition-all"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {/* 1. 内部背景：深色 + 射灯光晕 */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 18%, ${item.glow} 0%, transparent 55%), linear-gradient(180deg, #1a1a2e 0%, #16213e 70%, #0f0f23 100%)`,
                }}
              />

              {/* 2. 顶部射灯灯具 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-10 h-1.5 rounded-b-md bg-gradient-to-b from-slate-500 to-slate-800 shadow-md" />
                <div className="w-0.5 h-1.5 bg-slate-700/80" />
              </div>

              {/* 3. 光锥（从射灯向下扩散） */}
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 w-[140%] h-1/2 pointer-events-none z-10"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${item.glow} 0%, transparent 60%)`,
                  opacity: 0.7,
                }}
              />

              {/* 4. 玻璃柜门对角高光 */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-40"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 22%, transparent 78%, rgba(255,255,255,0.12) 100%)',
                }}
              />

              {/* 5. 3D GIF 藏品 */}
              <div className="absolute inset-0 flex items-center justify-center p-4 pt-10 pb-10 z-10">
                <img
                  data-src={item.gif}
                  alt={zh ? item.name.zh : item.name.en}
                  onLoad={() => setLoadedGifs((prev) => new Set(prev).add(item.id))}
                  className={`w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${item.static ? 'animate-float-gentle' : ''}`}
                  style={{
                    filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.55))',
                  }}
                />
                {/* 占位（未加载时）—— 加载完成后从 DOM 移除，避免图层混合 */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 pointer-events-none">
                    <span className="animate-float-gentle">{item.emoji}</span>
                  </div>
                )}
              </div>

              {/* 6. 圆形展台阴影 */}
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full pointer-events-none z-10"
                style={{
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
                }}
              />

              {/* 7. 底座 */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r ${item.pedestal} z-20`}
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
              />

              {/* 8. 金属铭牌（名字 + 副标题） */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-md bg-gradient-to-b from-slate-800 to-slate-950 border border-amber-300/40 shadow-md min-w-[60%]">
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[11px] font-black text-white whitespace-nowrap tracking-wide">
                    {zh ? item.name.zh : item.name.en}
                  </span>
                  <span className="text-[8px] font-bold text-amber-200/60 whitespace-nowrap tracking-widest uppercase">
                    {zh ? item.subtitle.zh : item.subtitle.en}
                  </span>
                </div>
              </div>

              {/* 9. 右上角编号 */}
              <div className="absolute top-2 right-2 z-30 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/15">
                <span className="text-[8px] font-mono font-bold text-white/80 tracking-wider">
                  {item.code}
                </span>
              </div>

              {/* 10. 左上角稀有度 */}
              <div className={`absolute top-2 left-2 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 ring-1 ${rarity.ring}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${rarity.dot}`} />
                <span className="text-[8px] font-black text-white/80 tracking-wider">
                  {zh ? rarity.zh : rarity.en}
                </span>
              </div>

              {/* 11. 序号（左下角，装饰用） */}
              <div className="absolute bottom-2 left-2 z-30 text-[8px] font-mono font-bold text-white/30 tracking-wider">
                №{String(idx + 1).padStart(2, '0')}
              </div>

              {/* 12. 右下角点击提示（hover 显示） */}
              <div className="absolute bottom-2 right-2 z-30 w-5 h-5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] text-white">🔍</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* === 底部提示 === */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-[#1a1a2e]/50 tracking-wider">
          {zh ? '👆 点击藏品查看详情' : '👆 TAP TO VIEW DETAILS'}
        </p>
      </div>

      {/* === 详情弹层（全屏沉浸查看） === */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
            style={{ animationDuration: '200ms' }}
          />

          {/* 详情卡片 */}
          <div
            className="relative w-full max-w-sm rounded-[28px] overflow-hidden border-[3px] border-white/15 shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `radial-gradient(ellipse at 50% 12%, ${selectedItem.glow} 0%, transparent 60%), linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)`,
            }}
          >
            {/* 顶部彩色装饰条（系列色） */}
            <div className={`h-1 bg-gradient-to-r ${selectedItem.accent}`} />

            {/* 顶部关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-3 z-20 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:rotate-90 active:scale-90 transition-all"
              aria-label={zh ? '关闭' : 'Close'}
            >
              <span className="text-lg font-bold">×</span>
            </button>

            {/* 藏品展示区 */}
            <div className="relative aspect-square flex items-center justify-center p-8">
              {/* 射灯光晕动画 */}
              <div
                className="absolute inset-0 animate-pulse-glow"
                style={{
                  background: `radial-gradient(circle at 50% 25%, ${selectedItem.glow} 0%, transparent 50%)`,
                }}
              />

              {/* 顶部射灯灯具 */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <div className="w-14 h-2 rounded-b-lg bg-gradient-to-b from-slate-500 to-slate-800 shadow-lg" />
                <div className="w-0.5 h-2 bg-slate-700/80" />
              </div>

              {/* 3D GIF */}
              <img
                src={selectedItem.gif}
                alt={zh ? selectedItem.name.zh : selectedItem.name.en}
                className={`relative w-full h-full object-contain ${selectedItem.static ? 'animate-float-gentle' : ''}`}
                style={{
                  filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.6))',
                }}
              />

              {/* 圆形展台阴影 */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-3 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* 底座 */}
            <div
              className={`h-4 bg-gradient-to-r ${selectedItem.pedestal}`}
              style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}
            />

            {/* 信息区 */}
            <div className="p-5 text-center">
              {/* 系列标签 + 稀有度 */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/8 border border-white/20">
                  <span className="text-[10px] font-bold text-white/70 tracking-wider">
                    {zh ? selectedItem.series.zh : selectedItem.series.en}
                  </span>
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/8 border border-white/20 ring-1 ${RARITY_CONFIG[selectedItem.rarity].ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${RARITY_CONFIG[selectedItem.rarity].dot}`} />
                  <span className="text-[10px] font-bold text-white/70 tracking-wider">
                    {zh ? RARITY_CONFIG[selectedItem.rarity].zh : RARITY_CONFIG[selectedItem.rarity].en}
                  </span>
                </span>
              </div>

              {/* 大号藏品编号 */}
              <div className="text-[10px] font-mono font-bold text-amber-200/50 tracking-[0.2em] mb-1">
                {selectedItem.code}
              </div>

              {/* 藏品名 */}
              <h2 className="text-2xl font-black text-white mb-0.5 tracking-wide">
                {zh ? selectedItem.name.zh : selectedItem.name.en}
              </h2>
              <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-3">
                {zh ? selectedItem.subtitle.zh : selectedItem.subtitle.en}
              </p>

              {/* 装饰分隔线 */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
                <span className="text-[8px] text-amber-300/60">◆</span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
              </div>

              {/* 描述 */}
              <p className="text-xs font-medium text-white/70 leading-relaxed mb-4 px-2">
                {zh ? selectedItem.description.zh : selectedItem.description.en}
              </p>

              {/* 互动按钮 */}
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-sm border border-amber-300/30 text-white text-sm font-black hover:from-amber-400/30 hover:to-orange-400/30 active:scale-95 transition-all tracking-wider"
              >
                {zh ? '收起藏品' : 'CLOSE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
