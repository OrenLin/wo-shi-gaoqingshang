// ============================================================
// CollectionViewer — 藏品展示柜
// 精美手办展示柜风格，4 个 3D GIF 藏品
// 特点：玻璃柜门、射灯光晕、底座反光、点击放大查看
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';

// 藏品数据
const COLLECTION_ITEMS = [
  {
    id: 'gundam',
    name: { zh: '高达', en: 'Gundam' },
    description: {
      zh: '钢铁之翼，守护和平的机动战士。',
      en: 'Iron wings, the mobile suit that guards peace.',
    },
    emoji: '🤖',
    gif: '/collections/gundam.gif',
    accent: 'from-sky-400 to-blue-600',
    glow: 'rgba(56, 189, 248, 0.45)',
    pedestal: 'from-slate-700 to-slate-900',
  },
  {
    id: 'taxi',
    name: { zh: '出租车', en: 'Taxi' },
    description: {
      zh: '穿梭于城市街角，载着每一段归途的故事。',
      en: 'Weaving through city corners, carrying stories of every journey home.',
    },
    emoji: '🚕',
    gif: '/collections/taxi.gif',
    accent: 'from-amber-400 to-orange-500',
    glow: 'rgba(251, 191, 36, 0.45)',
    pedestal: 'from-amber-800 to-amber-950',
  },
  {
    id: 'dog',
    name: { zh: '狗狗', en: 'Dog' },
    description: {
      zh: '忠诚的伙伴，用一生等待你的归来。',
      en: 'A loyal companion, waiting a lifetime for your return.',
    },
    emoji: '🐶',
    gif: '/collections/dog.gif',
    accent: 'from-orange-400 to-rose-500',
    glow: 'rgba(251, 146, 60, 0.45)',
    pedestal: 'from-orange-800 to-orange-950',
  },
  {
    id: 'cat',
    name: { zh: '猫猫', en: 'Cat' },
    description: {
      zh: '优雅而神秘，慵懒午后的小确幸。',
      en: 'Elegant and mysterious, a small joy of lazy afternoons.',
    },
    emoji: '🐱',
    gif: '/collections/cat.gif',
    accent: 'from-violet-400 to-fuchsia-600',
    glow: 'rgba(167, 139, 250, 0.45)',
    pedestal: 'from-violet-800 to-violet-950',
  },
];

export default function CollectionViewer() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadedGifs, setLoadedGifs] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // 懒加载：仅当 GIF 进入视口时才加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id && !loadedGifs.has(id)) {
              // 触发加载（通过更改 img src）
              const img = entry.target.querySelector('img[data-src]') as HTMLImageElement;
              if (img) {
                img.src = img.dataset.src!;
                setLoadedGifs((prev) => new Set(prev).add(id));
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
  }, [loadedGifs]);

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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300">
          <span className="text-base">🏛️</span>
          <span className="text-xs font-black text-[#1a1a2e]">
            {zh ? '我的藏品柜' : 'My Showcase'}
          </span>
          <span className="text-[10px] font-bold text-[#1a1a2e]/50">
            {COLLECTION_ITEMS.length} {zh ? '件' : 'items'}
          </span>
        </div>
      </div>

      {/* === 展示柜网格（2x2） === */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {COLLECTION_ITEMS.map((item) => (
          <button
            key={item.id}
            data-id={item.id}
            onClick={() => handleSelect(item.id)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] hover:-translate-y-[2px] active:translate-y-0 active:shadow-[2px_2px_0_0_#1a1a2e] transition-all"
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* 展柜内部背景：射灯光晕 */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 20%, ${item.glow} 0%, transparent 60%), linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)`,
              }}
            />

            {/* 玻璃柜门反光 */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.2) 100%)',
              }}
            />

            {/* 3D GIF 藏品 */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pt-8">
              <img
                data-src={item.gif}
                alt={zh ? item.name.zh : item.name.en}
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
                }}
              />
              {/* 占位（未加载时） */}
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none">
                <span className="animate-float-gentle">{item.emoji}</span>
              </div>
            </div>

            {/* 底座 */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r ${item.pedestal}`}
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
              }}
            />

            {/* 藏品名牌 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
              <span className="text-[10px] font-black text-white whitespace-nowrap">
                {zh ? item.name.zh : item.name.en}
              </span>
            </div>

            {/* 点击提示 */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-white">🔍</span>
            </div>
          </button>
        ))}
      </div>

      {/* === 底部提示 === */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-[#1a1a2e]/50">
          {zh ? '👆 点击藏品查看详情' : '👆 Tap to view details'}
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
            className="relative w-full max-w-sm rounded-[28px] overflow-hidden border-[3px] border-white/20 shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `radial-gradient(ellipse at 50% 15%, ${selectedItem.glow} 0%, transparent 65%), linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)`,
            }}
          >
            {/* 顶部关闭按钮 */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all"
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
                  background: `radial-gradient(circle at 50% 30%, ${selectedItem.glow} 0%, transparent 50%)`,
                }}
              />

              {/* 3D GIF */}
              <img
                src={selectedItem.gif}
                alt={zh ? selectedItem.name.zh : selectedItem.name.en}
                className="relative w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.6))',
                }}
              />
            </div>

            {/* 底座 */}
            <div className={`h-4 bg-gradient-to-r ${selectedItem.pedestal}`} style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }} />

            {/* 信息区 */}
            <div className="p-5 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-3">
                <span className="text-sm">{selectedItem.emoji}</span>
                <span className="text-[10px] font-bold text-white/70">
                  {zh ? '藏品 #001' : 'Item #001'}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mb-2">
                {zh ? selectedItem.name.zh : selectedItem.name.en}
              </h2>
              <p className="text-xs font-medium text-white/60 leading-relaxed mb-4">
                {zh ? selectedItem.description.zh : selectedItem.description.en}
              </p>

              {/* 互动按钮 */}
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-black hover:bg-white/25 active:scale-95 transition-all"
              >
                {zh ? '收起藏品' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
