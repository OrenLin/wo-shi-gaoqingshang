import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';
import { contemplationThemes } from './contemplation/quotes';
import GalaxyBackground from './contemplation/GalaxyBackground';
import FerrofluidBackground from './contemplation/FerrofluidBackground';
import LetterGlitchBackground from './contemplation/LetterGlitchBackground';
import BalatroBackground from './contemplation/BalatroBackground';

interface Props {
  onBack: () => void;
}

export default function Contemplation({ onBack }: Props) {
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const zh = language === 'zh';

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [quoteExpanded, setQuoteExpanded] = useState(true);

  const currentTheme = contemplationThemes[currentThemeIndex];
  const currentQuote = currentTheme.quotes[currentQuoteIndex];

  // 卡片是否可见 = 语录可见 && 卡片展开
  const cardVisible = quoteVisible && quoteExpanded;

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

  // 根据主题渲染背景
  const renderBackground = () => {
    switch (currentTheme.id) {
      case 'universe':
        return <GalaxyBackground />;
      case 'electromagnetism':
        return <FerrofluidBackground />;
      case 'digital':
        return <LetterGlitchBackground />;
      case 'cycle':
        return <BalatroBackground />;
      default:
        return <GalaxyBackground />;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" style={{ height: '100dvh' }}>
      {/* === 特效背景层 === */}
      {/* 展开时 pointer-events-none（让卡片接收点击）；折叠时 auto（可玩背景） */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ pointerEvents: quoteExpanded ? 'none' : 'auto', touchAction: 'none' }}
      >
        {renderBackground()}
      </div>

      {/* 渐变遮罩（增强可读性）— 始终不拦截事件 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* === 顶部控制栏（左上角：返回 + 语言） === */}
      <div
        className="absolute top-0 left-0 z-30 flex flex-col gap-2 p-4"
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
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div
          className={`w-[85%] max-w-[340px] transition-all duration-500 ${
            cardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          } ${cardVisible ? 'pointer-events-auto' : ''}`}
        >
          <div
            className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl cursor-pointer select-none"
            onClick={handleQuoteClick}
          >
            {/* 主题标签 + 进度 */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-bold">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/80 text-xs font-bold hover:bg-white/25 active:scale-95 transition-all"
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
          {/* 滑动提示 */}
          <div className="mb-6 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center animate-pulse">
            <div className="text-white/90 text-sm font-bold mb-1">
              {zh ? '👆 滑动手指 · 与背景互动' : '👆 Swipe to interact'}
            </div>
            <div className="text-white/50 text-xs font-medium">
              {zh ? '触摸屏幕探索特效' : 'Touch the screen to explore'}
            </div>
          </div>
          {/* 展开按钮 */}
          <button
            onClick={toggleQuoteExpand}
            className="pointer-events-auto px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 text-white font-black text-sm hover:bg-white/30 active:scale-95 transition-all shadow-lg"
          >
            {zh ? '🧘 展开语录' : '🧘 Show Quotes'}
          </button>
        </div>
      )}

      {/* === 底部主题切换栏 === */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex justify-center gap-2 px-4 pb-6"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {/* 半透明背景条，增强可见性 */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="relative flex justify-center gap-2">
          {contemplationThemes.map((theme, idx) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSwitch(idx)}
              disabled={isTransitioning}
              aria-label={zh ? theme.name.zh : theme.name.en}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                idx === currentThemeIndex
                  ? 'bg-white/25 backdrop-blur-md border-2 border-white/60 scale-105 shadow-lg'
                  : 'bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/15'
              } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 active:scale-95'}`}
            >
              <span className="text-xl leading-none">{theme.emoji}</span>
              <span className={`text-[10px] font-black leading-none ${
                idx === currentThemeIndex ? 'text-white' : 'text-white/60'
              }`}>
                {zh ? theme.name.zh : theme.name.en}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
