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
import { isMobile } from '../../utils/device';

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
  const [guideVisible, setGuideVisible] = useState(false);

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

  // 新手引导：首次访问时显示
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('contemplation-guide-seen');
    if (!hasSeenGuide) {
      setGuideVisible(true);
    }
  }, []);

  const dismissGuide = useCallback(() => {
    setGuideVisible(false);
    localStorage.setItem('contemplation-guide-seen', 'true');
  }, []);

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

  // 移动端不再统一缩放，由各背景组件自行适配

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

      {/* === 顶部控制栏（顶部居中：返回 + 语言，避开左侧主题栏） === */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-3"
        style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        <button
          onClick={handleBack}
          aria-label={zh ? '返回' : 'Back'}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <span className="text-base">←</span>
          <span className="hidden sm:inline">{zh ? '返回' : 'Back'}</span>
        </button>
        <button
          onClick={handleLanguageSwitch}
          aria-label={zh ? '切换到英文' : 'Switch to Chinese'}
          className="px-3.5 py-1.5 rounded-full bg-white/15 border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          {language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      {/* === 语录卡片（居中） === */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div
          ref={cardRef}
          className={`w-[80%] max-w-[300px] transition-all duration-500 ${
            cardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          } ${cardVisible ? 'pointer-events-auto' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative rounded-3xl p-5 shadow-2xl select-none border border-white/30 cursor-pointer"
            style={{
              backgroundColor: 'rgba(20,20,40,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            onClick={() => switchQuote('next')}
          >
            {/* 左箭头 */}
            <button
              onClick={(e) => { e.stopPropagation(); switchQuote('prev'); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center opacity-40 hover:opacity-80 active:scale-90 transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))', border: '1px solid rgba(255,255,255,0.15)' }}
              aria-label={zh ? '上一条' : 'Previous'}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5L4 6L7.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* 右箭头 */}
            <button
              onClick={(e) => { e.stopPropagation(); switchQuote('next'); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center opacity-40 hover:opacity-80 active:scale-90 transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.2))', border: '1px solid rgba(255,255,255,0.15)' }}
              aria-label={zh ? '下一条' : 'Next'}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6L4.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* 主题标签 */}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white/70 text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-sm">{currentTheme.emoji}</span>
                <span>{zh ? currentTheme.name.zh : currentTheme.name.en}</span>
              </div>
            </div>

            {/* 语录正文 */}
            <div className="text-center mb-4 min-h-[100px] flex flex-col justify-center">
              <div className="text-white text-base font-bold leading-relaxed mb-2.5">
                "{zh ? currentQuote.zh : currentQuote.en}"
              </div>
              <div className="text-white/40 text-[11px] font-medium">
                — {currentQuote.author}
              </div>
            </div>

            {/* 收起按钮 — 呼吸感圆形图标 */}
            <div className="flex justify-center mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQuoteExpand();
                }}
                className="group relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
                aria-label={zh ? '收起语录' : 'Collapse quotes'}
              >
                {/* 呼吸光环 */}
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    animationDuration: '3s',
                  }}
                />
                {/* 内圆 */}
                <span
                  className="relative w-7 h-7 rounded-full flex items-center justify-center border border-white/30 transition-all group-hover:border-white/50"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/70 group-hover:text-white/90 transition-colors">
                    <path d="M2.5 4.5 L6 7.5 L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
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

      {/* === 主题切换：左侧纵向滚动条（避开右侧无障碍按钮和语录卡片） === */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-3 z-40 flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto py-2 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginTop: 'calc(2rem + env(safe-area-inset-top))',
        }}
      >
        {contemplationThemes.map((theme, idx) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSwitch(idx)}
            disabled={isTransitioning}
            aria-label={zh ? theme.name.zh : theme.name.en}
            title={zh ? theme.name.zh : theme.name.en}
            className={`flex-shrink-0 transition-all duration-300 ${
              idx === currentThemeIndex
                ? 'w-9 h-9 rounded-full flex items-center justify-center text-base bg-gradient-to-br from-purple-400/40 to-pink-400/40 border-2 border-white/60 scale-110 shadow-lg backdrop-blur-sm'
                : 'w-7 h-7 rounded-full flex items-center justify-center text-xs bg-white/10 border border-white/20 opacity-40 hover:opacity-80 hover:scale-105'
            } ${isTransitioning ? 'cursor-not-allowed' : 'active:scale-90'}`}
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

      {/* === 新手引导 === */}
      {guideVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={dismissGuide}
        >
          <div className="w-[90%] max-w-[360px] p-6 rounded-3xl border border-white/20"
            style={{ backgroundColor: 'rgba(30,30,50,0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题 */}
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">✨</div>
              <div className="text-white text-lg font-bold">
                {zh ? '沉思空间' : 'Contemplation Space'}
              </div>
              <div className="text-white/50 text-xs font-medium mt-1">
                {zh ? '探索内心的宁静角落' : 'Explore your inner peace'}
              </div>
            </div>

            {/* 引导项 */}
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🎨</span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-white text-sm font-bold mb-0.5">
                    {zh ? '主题切换' : 'Theme Switch'}
                  </div>
                  <div className="text-white/60 text-xs">
                    {zh ? '左侧图标点击切换不同主题背景' : 'Tap left icons to switch themes'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">←→</span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-white text-sm font-bold mb-0.5">
                    {zh ? '语录切换' : 'Quote Switch'}
                  </div>
                  <div className="text-white/60 text-xs">
                    {zh ? '左右滑动或点击箭头切换语录' : 'Swipe or tap arrows to switch quotes'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">⬇️</span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-white text-sm font-bold mb-0.5">
                    {zh ? '折叠展开' : 'Collapse & Expand'}
                  </div>
                  <div className="text-white/60 text-xs">
                    {zh ? '点击下方按钮折叠语录卡片' : 'Tap button to collapse quote card'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">👆</span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-white text-sm font-bold mb-0.5">
                    {zh ? '互动特效' : 'Interactive Effects'}
                  </div>
                  <div className="text-white/60 text-xs">
                    {zh ? '折叠后滑动屏幕，让画面动起来' : 'Swipe screen to animate effects'}
                  </div>
                </div>
              </div>
            </div>

            {/* 确认按钮 */}
            <button
              onClick={dismissGuide}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.6), rgba(236,72,153,0.6))',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {zh ? '我知道了' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
