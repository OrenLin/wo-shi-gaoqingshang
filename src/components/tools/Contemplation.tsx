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

  const currentTheme = contemplationThemes[currentThemeIndex];
  const currentQuote = currentTheme.quotes[currentQuoteIndex];

  // 语录自动轮播（8秒）
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % currentTheme.quotes.length);
        setQuoteVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(timer);
  }, [currentTheme.quotes.length]);

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
    <div className="fixed inset-0 overflow-hidden" style={{ height: '100dvh' }}>
      {/* 特效背景层 */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderBackground()}
      </div>

      {/* 渐变遮罩（增强可读性） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* 返回按钮（左上角） */}
      <button
        onClick={handleBack}
        aria-label={zh ? '返回' : 'Back'}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all"
        style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}
      >
        <span className="text-base">←</span>
        <span>{zh ? '返回' : 'Back'}</span>
      </button>

      {/* 语言切换（右上角） */}
      <button
        onClick={handleLanguageSwitch}
        aria-label={zh ? '切换到英文' : 'Switch to Chinese'}
        className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 text-white font-black text-sm hover:bg-white/25 active:scale-95 transition-all"
        style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}
      >
        {language === 'zh' ? 'EN' : '中文'}
      </button>

      {/* 毛玻璃语录卡片（居中） */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <div
          className={`w-[85%] max-w-[340px] transition-all duration-500 ${
            quoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl">
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

            {/* 进度条（6个点） */}
            <div className="flex justify-center gap-1.5">
              {currentTheme.quotes.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentQuoteIndex
                      ? 'w-6 bg-white'
                      : 'w-4 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部主题切换栏 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-3 pb-6"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {contemplationThemes.map((theme, idx) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSwitch(idx)}
            disabled={isTransitioning}
            aria-label={zh ? theme.name.zh : theme.name.en}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
              idx === currentThemeIndex
                ? 'bg-white/20 backdrop-blur-md border-2 border-white/50 scale-110 shadow-lg'
                : 'bg-white/10 backdrop-blur-md border-2 border-white/20 opacity-60 hover:opacity-80'
            } ${isTransitioning ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            {theme.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
