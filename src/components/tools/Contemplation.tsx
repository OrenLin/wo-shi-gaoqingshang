import { useState, useEffect, useCallback, useRef } from 'react';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';
import { contemplationThemes } from './contemplation/quotes';
import GalaxyBackground from './contemplation/GalaxyBackground';
import FerrofluidBackground from './contemplation/FerrofluidBackground';
import LetterGlitchBackground from './contemplation/LetterGlitchBackground';
import BalatroBackground from './contemplation/BalatroBackground';
import AuroraBackground from './contemplation/AuroraBackground';
import BeamsBackground from './contemplation/BeamsBackground';
import IridescenceBackground from './contemplation/IridescenceBackground';
import ColorBendsBackground from './contemplation/ColorBendsBackground';
import EvilEyeBackground from './contemplation/EvilEyeBackground';
import HyperspeedBackground from './contemplation/HyperspeedBackground';

interface Props {
  onBack: () => void;
}

// 主题背景映射
const backgroundMap: Record<string, () => JSX.Element> = {
  universe: GalaxyBackground,
  electromagnetism: FerrofluidBackground,
  digital: LetterGlitchBackground,
  cycle: BalatroBackground,
  light: ColorBendsBackground,
  inspiration: IridescenceBackground,
  nature: AuroraBackground,
  rules: BeamsBackground,
  chaos: EvilEyeBackground,
  time: HyperspeedBackground,
};

// 检测是否移动端
const isMobile = () => window.innerWidth <= 768;

export default function Contemplation({ onBack }: Props) {
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const zh = language === 'zh';

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [quoteExpanded, setQuoteExpanded] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  // 滑动相关
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentTheme = contemplationThemes[currentThemeIndex];
  const currentQuote = currentTheme.quotes[currentQuoteIndex];
  const cardVisible = quoteVisible && quoteExpanded && !isCollapsing;

  // 首次进入工具时显示滑动提示（仅一次）
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('contemplation-hint-seen');
    if (!hasSeenHint && !quoteExpanded) {
      setHintVisible(true);
      const timer = setTimeout(() => setHintVisible(false), 1200);
      localStorage.setItem('contemplation-hint-seen', 'true');
      return () => clearTimeout(timer);
    }
  }, [quoteExpanded]);

  // 语录自动轮播（12秒）— 仅在展开时
  useEffect(() => {
    if (!quoteExpanded) return;

    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % currentTheme.quotes.length);
        setQuoteVisible(true);
      }, 500);
    }, 12000);

    return () => clearInterval(timer);
  }, [currentTheme.quotes.length, quoteExpanded]);

  // 主题切换
  const handleThemeSwitch = useCallback(
    (newIndex: number) => {
      if (newIndex === currentThemeIndex || isTransitioning) return;

      audioManager.userTapped();
      audioManager.play('click');
      setIsTransitioning(true);
      setQuoteVisible(false);

      setTimeout(() => {
        setCurrentThemeIndex(newIndex);
        setCurrentQuoteIndex(0);
        setTimeout(() => {
          setIsTransitioning(false);
          setQuoteVisible(true);
        }, 500);
      }, 500);
    },
    [currentThemeIndex, isTransitioning]
  );

  // 切换语录
  const switchQuote = useCallback(
    (direction: 'next' | 'prev') => {
      if (isTransitioning) return;
      audioManager.userTapped();
      audioManager.play('click');
      setQuoteVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => {
          if (direction === 'next') {
            return (prev + 1) % currentTheme.quotes.length;
          } else {
            return (prev - 1 + currentTheme.quotes.length) % currentTheme.quotes.length;
          }
        });
        setQuoteVisible(true);
      }, 500);
    },
    [isTransitioning, currentTheme.quotes.length]
  );

  // 卡片触摸滑动
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // 水平滑动 > 50px 且大于垂直滑动
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          switchQuote('next');
        } else {
          switchQuote('prev');
        }
      }
      touchStartRef.current = null;
    },
    [switchQuote]
  );

  // 切换语录展开/折叠
  const toggleQuoteExpand = useCallback(() => {
    audioManager.userTapped();
    audioManager.play('click');
    if (quoteExpanded) {
      // 先播放收缩动画，再隐藏
      setIsCollapsing(true);
      setTimeout(() => {
        setQuoteExpanded(false);
        setIsCollapsing(false);
      }, 400);
    } else {
      setQuoteExpanded(true);
    }
  }, [quoteExpanded]);

  // 语言切换
  const handleLanguageSwitch = () => {
    audioManager.userTapped();
    audioManager.play('click');
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  // 返回
  const handleBack = () => {
    audioManager.userTapped();
    audioManager.play('click');
    onBack();
  };

  // 渲染当前主题背景
  const renderBackground = () => {
    const Bg = backgroundMap[currentTheme.id] || GalaxyBackground;
    return <Bg />;
  };

  // 移动端背景缩放
  const bgScale = isMobile() ? 0.7 : 1;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" style={{ height: '100dvh' }}>
      {/* === 特效背景层 === */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isTransitioning ? 'opacity-0 scale-110' : 'opacity-100'
        }`}
        style={{
          pointerEvents: quoteExpanded ? 'none' : 'auto',
          touchAction: 'none',
          transform: `scale(${bgScale})`,
          transformOrigin: 'center center',
        }}
      >
        {renderBackground()}
      </div>

      {/* 渐变遮罩 — 始终不拦截事件 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* === 顶部控制栏（左上角：返回 + 语言） === */}
      <div
        className="absolute top-0 left-0 z-40 flex flex-col gap-2 p-4"
        style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
      >
        <button
          onClick={handleBack}
          aria-label={zh ? '返回' : 'Back'}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <span className="text-base">←</span>
          <span>{zh ? '返回' : 'Back'}</span>
        </button>
        <button
          onClick={handleLanguageSwitch}
          aria-label={zh ? '切换到英文' : 'Switch to Chinese'}
          className="px-4 py-2 rounded-full bg-white/15 border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all w-fit"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          {language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      {/* === 语录卡片（居中） === */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div
          ref={cardRef}
          className={`w-[85%] max-w-[340px] transition-all duration-500 ${
            cardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          } ${cardVisible ? 'pointer-events-auto' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative rounded-3xl p-6 shadow-2xl cursor-pointer select-none border border-white/30"
            style={{
              backgroundColor: 'rgba(20,20,40,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            onClick={() => switchQuote('next')}
          >
            {/* 主题标签 */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white/70 text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-base">{currentTheme.emoji}</span>
                <span>{zh ? currentTheme.name.zh : currentTheme.name.en}</span>
              </div>
            </div>

            {/* 语录正文 */}
            <div className="text-center mb-5 min-h-[120px] flex flex-col justify-center">
              <div className="text-white text-lg font-bold leading-relaxed mb-3">
                "{zh ? currentQuote.zh : currentQuote.en}"
              </div>
              <div className="text-white/50 text-xs font-medium">
                — {currentQuote.author}
              </div>
            </div>

            {/* 收起按钮 */}
            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQuoteExpand();
                }}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-white/25 text-white/80 text-xs font-bold hover:bg-white/25 active:scale-95 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <span>{zh ? '🔽 收起' : '🔽 Collapse'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === 折叠状态：底部圆形灵感图标 + 滑动提示 === */}
      {!quoteExpanded && (
        <>
          {/* 滑动提示 — 仅首次进入时显示 */}
          {hintVisible && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl border border-white/20 text-center pointer-events-none"
              style={{ backgroundColor: 'rgba(20,20,40,0.6)' }}
            >
              <div className="text-white/90 text-sm font-bold mb-1">
                {zh ? '👆 滑动手指 · 与背景互动' : '👆 Swipe to interact'}
              </div>
              <div className="text-white/50 text-xs font-medium">
                {zh ? '触摸屏幕探索特效' : 'Touch the screen to explore'}
              </div>
            </div>
          )}
          {/* 底部圆形灵感图标 */}
          <button
            onClick={toggleQuoteExpand}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-16 h-16 rounded-full flex items-center justify-center text-2xl pointer-events-auto active:scale-90 transition-all shadow-lg border-2 border-white/30 hover:scale-110"
            style={{
              backgroundColor: 'rgba(100,100,150,0.4)',
              boxShadow: '0 4px 20px rgba(100,100,200,0.3)',
            }}
          >
            💡
          </button>
        </>
      )}

      {/* === 主题切换：右侧纵向滚动条（不遮挡画面） === */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-3 z-40 flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto py-2 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingTop: 'calc(0.5rem + env(safe-area-inset-top))',
        }}
      >
        {contemplationThemes.map((theme, idx) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSwitch(idx)}
            disabled={isTransitioning}
            aria-label={zh ? theme.name.zh : theme.name.en}
            title={zh ? theme.name.zh : theme.name.en}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-300 border-2 ${
              idx === currentThemeIndex
                ? 'bg-white/30 border-white/70 scale-110 shadow-lg'
                : 'bg-white/10 border-white/20 opacity-50 hover:opacity-90'
            } ${isTransitioning ? 'cursor-not-allowed' : 'hover:scale-110 active:scale-90'}`}
            style={{ backgroundColor: idx === currentThemeIndex ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }}
          >
            {theme.emoji}
          </button>
        ))}
      </div>

      {/* === 底部当前主题名称显示 === */}
      <div
        className="absolute left-0 right-0 z-30 flex justify-center pointer-events-none"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div
          className="px-4 py-1.5 rounded-full text-white/80 text-xs font-bold border border-white/15"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          {currentTheme.emoji} {zh ? currentTheme.name.zh : currentTheme.name.en}
        </div>
      </div>
    </div>
  );
}
