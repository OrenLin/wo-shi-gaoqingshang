import { useState, useEffect, useCallback, useRef } from 'react';
import type { Scene } from '../../data/types';
import { useI18n, pickLocalized } from '../../i18n';
import { audioManager } from '../../utils/audioManager';
import MangaButton from '../ui/MangaButton';

interface Props {
  scene: Scene;
  index: number;
  onEnter: () => void;
  onClose: () => void;
}

export default function ImmersiveScenePreview({ scene, index, onEnter, onClose }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);
  const zh = language === 'zh';

  useEffect(() => {
    // 无背景图时立即标记为已加载（避免空 src 导致 onload 不触发）
    if (!scene.bgImage) {
      setImageLoaded(true);
      return;
    }
    setImageLoaded(false);
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
    img.src = scene.bgImage;
    // 兜底：2.5s 后强制显示，避免图片加载失败导致一直 loading
    const fallback = setTimeout(() => setImageLoaded(true), 2500);
    return () => clearTimeout(fallback);
  }, [scene.bgImage]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnter = useCallback(() => {
    requestAnimationFrame(() => {
      audioManager.userTapped();
      audioManager.play('success');
    });
    setIsExiting(true);
    setTimeout(onEnter, 300);
  }, [onEnter]);

  const handleClose = useCallback(() => {
    requestAnimationFrame(() => {
      audioManager.userTapped();
      audioManager.play('click');
    });
    setIsExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const parallaxX = (mousePos.x - 0.5) * 15;
  const parallaxY = (mousePos.y - 0.5) * 10;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-[#1a1a2e] transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: scene.bgGradient || `linear-gradient(180deg, ${scene.bgColor})`,
      }}
    >
      {/* 背景大图层（有 bgImage 时才渲染，避免空 url） */}
      {scene.bgImage && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${scene.bgImage})`,
            transform: `scale(1.1) translate(${parallaxX}px, ${parallaxY}px)`,
            transition: 'transform 0.3s ease-out, opacity 0.5s ease-out',
            animation: 'breathing-lens 8s ease-in-out infinite',
          }}
        />
      )}

      {/* 渐变遮罩（底部向上） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(26,26,46,0.15) 0%, rgba(26,26,46,0.35) 45%, rgba(26,26,46,0.95) 100%)',
        }}
      />

      {/* 暗角效果（聚焦中心） */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Loading 指示（图片加载中显示） */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-5xl animate-bounce mb-3" aria-hidden="true">🎴</div>
          <div className="text-white/90 font-black text-sm animate-pulse">
            {zh ? '正在进入场景…' : 'Entering scene…'}
          </div>
        </div>
      )}

      {/* 右上角关闭按钮（绝对定位，不占布局空间） */}
      <button
        onClick={handleClose}
        aria-label={zh ? '关闭' : 'Close'}
        className="absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-white font-black text-lg shadow-[3px_3px_0_0_rgba(26,26,46,0.5)] hover:bg-white/45 hover:scale-110 active:scale-90 transition-all"
      >
        ✕
      </button>

      {/* 内容区 —— 可滚动，从顶部开始 */}
      <div
        className={`relative z-10 w-full h-full overflow-y-auto overscroll-contain transition-transform duration-500 ${isExiting ? 'translate-y-10' : ''}`}
      >
        <div className="min-h-full flex flex-col items-center justify-center max-w-xl mx-auto px-5 pt-20 pb-10">
          {/* 场景标题（浮在图片上方） */}
          <div className="text-center mb-8">
            <div
              className="inline-block px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border-4 border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] mb-4"
              style={{ animation: 'pop-in 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <span className="text-sm font-black text-[#1a1a2e]">
                {t('select.scene')} No.{index + 1}
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-white leading-tight"
              style={{
                textShadow: '4px 4px 0 rgba(26,26,46,0.8), 0 0 30px rgba(255,255,255,0.3)',
                animation: 'slide-in-up 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both',
              }}
            >
              {scene.emoji} {pickLocalized(scene.title, language)}
            </h2>
            <p
              className="mt-4 text-lg text-white/90 font-bold max-w-md mx-auto"
              style={{
                textShadow: '2px 2px 0 rgba(26,26,46,0.6)',
                animation: 'slide-in-up 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
              }}
            >
              {pickLocalized(scene.description, language)}
            </p>
          </div>

          {/* 底部卡片面板（毛玻璃效果） */}
          <div
            className="w-full bg-white/85 backdrop-blur-xl rounded-[28px] border-4 border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] p-6"
            style={{
              animation: 'slide-in-up 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
            }}
          >
            {/* 人物标签 */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {scene.characters.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-yellow-100 text-[#1a1a2e] text-sm font-black px-4 py-2 rounded-full border-3 border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span>{pickLocalized(c.name, language)}</span>
                </span>
              ))}
            </div>

            {/* 压力提示 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border-3 border-red-400 text-red-700 font-black text-sm">
                <span className="animate-pulse">⚠️</span>
                {t('preview.pressureWarning')}
              </div>
            </div>

            {/* 进入按钮 */}
            <MangaButton
              variant="primary"
              onClick={handleEnter}
              className="w-full !py-5 !text-xl"
            >
              <span className="text-2xl">🎮</span>
              {t('preview.enterScene')}
            </MangaButton>

            {/* 题数提示 */}
            <div className="text-center mt-4">
              <span className="text-sm font-bold text-[#1a1a2e]/60">
                {scene.questions.length} {t('select.qs')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
