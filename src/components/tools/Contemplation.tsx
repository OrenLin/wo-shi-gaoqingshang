import { useState, useEffect, useCallback } from 'react';
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

  const currentTheme = contemplationThemes[currentThemeIndex];
  const currentQuote = currentTheme.quotes[currentQuoteIndex];
  const cardVisible = quoteVisible && quoteExpanded;

  // 折叠时显示提示，1.2秒后自动消失
  useEffect(() => {
    if (quoteExpanded) {
      setHintVisible(false);
      return;
    }
    setHintVisible(true);
    const timer = setTimeout(() => setHintVisible(false), 1200);
    return () => clearTimeout(timer);
  }, [quoteExpanded, currentThemeIndex]);

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

  // 语录点击切换下一条
  const handleQuoteClick = useCallback(() => {
    if (isTransitioning) return;
    audioManager.userTapped();
    audioManager.play('click');
    setQuoteVisible(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % currentTheme.quotes.length);
      setQuoteVisible(true);
    }, 500);
  }, [isTransitioning, currentTheme.quotes.length]);

  // 切换语录展开/折叠
  const toggleQuoteExpand = useCallback(() => {
    audioManager.userTapped();
    audioManager.play('click');
    setQuoteExpanded((prev) => !prev);
  }, []);

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

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" style={{ height: '100dvh' }}>
      {/* === 特效背景层 === */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ pointerEvents: quoteExpanded ? 'none' : 'auto', touchAction: 'none' }}
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
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all"
        >
          <span className="text-base">←</span>
          <span>{zh ? '返回' : 'Back'}</span>
        </button>
        <button
          onClick={handleLanguageSwitch}
          aria-label={zh ? '切换到英文' : 'Switch to Chinese'}
          className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all w-fit"
        >
          {language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      {/* === 语录卡片（居中） === */}
      {/* 毛玻璃直接使用 inline style，避免 CSS 加载延迟 */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div
          className={`w-[85%] max-w-[340px] transition-opacity duration-500 ${
            cardVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${cardVisible ? 'pointer-events-auto' : ''}`}
        >
          <div
            className="relative rounded-3xl p-6 shadow-2xl cursor-pointer select-none border-2 border-white/20"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={handleQuoteClick}
          >
            {/* 主题标签 + 进度 */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white/70 text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <span className="text-base">{currentTheme.emoji}</span>
                <span>{zh ? currentTheme.name.zh : currentTheme.name.en}</span>
                <span className="text-white/50">·</span>
                <span className="text-white/50">
                  {currentQuoteIndex + 1}/{currentTheme.quotes.length}
                </span>
              </div>
            </div>

            {/* 语录正文 */}
            <div className="text-center mb-4 min-h-[120px] flex flex-col justify-center">
              <div className="text-white text-lg font-bold leading-relaxed mb-3">
                "{zh ? currentQuote.zh : currentQuote.en}"
              </div>
              <div className="text-white/60 text-sm font-medium">
                — {currentQuote.author}
              </div>
            </div>

            {/* 进度条 */}
            <div className="flex justify-center gap-1 mb-4 flex-wrap">
              {currentTheme.quotes.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentQuoteIndex ? 'w-5 bg-white' : 'w-3 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* 操作提示行 */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-white/40 text-[10px] font-bold">
                {zh ? '👆 点击切换' : '👆 Tap to switch'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQuoteExpand();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/25 text-white/80 text-xs font-bold hover:bg-white/25 active:scale-95 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <span>{zh ? '🔽 收起' : '🔽 Collapse'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === 折叠状态：展开按钮 + 滑动提示 === */}
      {!quoteExpanded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          {/* 滑动提示 — 1.2秒后消失 */}
          {hintVisible && (
            <div className="mb-6 px-5 py-3 rounded-2xl border border-white/20 text-center transition-opacity duration-300"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
              <div className="text-white/90 text-sm font-bold mb-1">
                {zh ? '👆 滑动手指 · 与背景互动' : '👆 Swipe to interact'}
              </div>
              <div className="text-white/50 text-xs font-medium">
                {zh ? '触摸屏幕探索特效' : 'Touch the screen to explore'}
              </div>
            </div>
          )}
          {/* 展开按钮 */}
          <button
            onClick={toggleQuoteExpand}
            className="pointer-events-auto px-6 py-3 rounded-full bg-white/20 border-2 border-white/40 text-white font-black text-sm hover:bg-white/30 active:scale-95 transition-all shadow-lg"
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          >
            {zh ? '🧘 展开语录' : '🧘 Show Quotes'}
          </button>
        </div>
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
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
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
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
          {currentTheme.emoji} {zh ? currentTheme.name.zh : currentTheme.name.en}
        </div>
      </div>
    </div>
  );
}
