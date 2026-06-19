import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import { useI18n, pickLocalized } from '../i18n';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';

export default function Home() {
  const { setPage, setCodename } = useGameStore();
  const [codename, setCodenameInput] = useState('');
  const { language, setLanguage, t } = useI18n();

  const handleStart = () => {
    audioManager.userTapped();
    audioManager.play('click');
    const name = codename.trim().length > 0 ? codename.trim().slice(0, 20) : '';
    setCodename(name);
    setPage('select');
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-between py-12 px-5"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 55%, #fbbf24 100%)' }}
    >
      <div className="absolute inset-0 manga-stripes opacity-30 pointer-events-none" />

      <FloatingEmojis
        items={[
          { emoji: '🧨', top: '8%', left: '6%', delay: '0s' },
          { emoji: '💼', top: '14%', right: '8%', delay: '0.4s', size: '2.2rem' },
          { emoji: '🍻', bottom: '22%', left: '10%', delay: '0.8s' },
          { emoji: '👑', top: '30%', left: '12%', delay: '1.2s', size: '2rem' },
          { emoji: '🔥', bottom: '18%', right: '14%', delay: '0.2s' },
          { emoji: '💀', bottom: '30%', right: '6%', delay: '1.6s', size: '2.2rem' },
          { emoji: '💬', top: '12%', left: '45%', delay: '0.6s', size: '1.8rem' },
        ]}
      />

      {/* 顶部：品牌 + 语言切换 */}
      <div className="relative z-10 w-full flex items-start justify-center">
        <div className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
          <span className="font-black text-sm text-[#1a1a2e]">{t('home.brand')}</span>
        </div>
        {/* 语言切换按钮 */}
        <button
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setLanguage(language === 'zh' ? 'en' : 'zh');
          }}
          className="ml-3 inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
        >
          <span>🌐</span>
          <span>{language === 'zh' ? 'EN' : '中文'}</span>
        </button>
      </div>

      {/* 主标题 */}
      <div className="relative z-10 text-center mt-4">
        <div className="relative inline-block">
          <div className="absolute -top-5 -left-6 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-spin-slow -z-10" />
          <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-sky-400 rounded-full opacity-60 animate-spin-slow -z-10"
               style={{ animationDirection: 'reverse' }} />

          {language === 'zh' ? (
            <>
              <div className="text-5xl md:text-6xl font-black text-[#1a1a2e] leading-none animate-wiggle"
                   style={{ textShadow: '4px 4px 0 #fbbf24, 8px 8px 0 rgba(26,26,46,0.2)', WebkitTextStroke: '2px #1a1a2e' }}>
                {t('home.title1')}
              </div>
              <div className="mt-1 text-6xl md:text-7xl font-black leading-none animate-wiggle"
                   style={{
                     background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #facc15 100%)',
                     WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                     WebkitTextStroke: '3px #1a1a2e', textShadow: '6px 6px 0 rgba(26,26,46,0.15)',
                     animationDelay: '0.2s',
                   }}>
                {t('home.title2')}
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl md:text-6xl font-black text-[#1a1a2e] leading-none animate-wiggle"
                   style={{ textShadow: '4px 4px 0 #fbbf24, 8px 8px 0 rgba(26,26,46,0.2)', WebkitTextStroke: '2px #1a1a2e' }}>
                {t('home.title1')}
              </div>
              <div className="mt-1 text-5xl md:text-6xl font-black leading-none animate-wiggle"
                   style={{
                     background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #facc15 100%)',
                     WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                     WebkitTextStroke: '3px #1a1a2e', textShadow: '6px 6px 0 rgba(26,26,46,0.15)',
                     animationDelay: '0.2s',
                   }}>
                {t('home.title2')}{' '}
                <span style={{ color: 'transparent' }}>{t('home.title2b')}</span>
              </div>
            </>
          )}

          <div className="absolute -top-3 -right-4 md:-right-10 bg-red-500 text-white font-black text-xs md:text-sm rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle rotate-[12deg]"
               style={{ animationDelay: '0.5s' }}>
            {t('home.hot')}
          </div>
        </div>

        {/* 副标题 */}
        <div className="mt-6 inline-block relative">
          <div className="relative bg-white border-[3px] border-[#1a1a2e] rounded-2xl px-5 py-3 shadow-[5px_5px_0_0_#1a1a2e]">
            <p className="text-sm md:text-base font-black text-[#1a1a2e]">{t('home.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* 代号输入 + 开始按钮 */}
      <div className="relative z-10 w-full max-w-md mt-6">
        <div className="bg-white rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 mb-4 relative">
          <div className="absolute -top-3 left-4 bg-pink-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
            👤 {t('home.codenameInput')}
          </div>
          <input
            type="text"
            value={codename}
            onChange={(e) => setCodenameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleStart(); }}
            placeholder={t('home.codenamePh')}
            maxLength={20}
            className="w-full text-xl md:text-2xl font-black text-[#1a1a2e] placeholder:text-[#1a1a2e]/30
                       bg-yellow-50 border-[3px] border-[#1a1a2e] rounded-2xl px-4 py-3 mt-2
                       outline-none focus:bg-yellow-100 transition-colors text-center"
          />
          <div className="mt-2 text-right text-xs font-bold text-[#1a1a2e]/50">
            {codename.length}/20 {t('home.chars')}
          </div>
        </div>

        <MangaButton
          variant="primary"
          onClick={handleStart}
          className="w-full !py-5 !text-xl"
        >
          <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
          {codename.trim().length > 0 ? t('home.startWithName') : t('home.startAnon')}
        </MangaButton>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border-[2px] border-[#1a1a2e] rounded-full px-4 py-1.5 text-xs font-black text-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
            {t('home.hint')}
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-bold text-[#1a1a2e]/60">
          {t('home.guide')}
        </p>

        {/* 作者署名 + 版本号 */}
        <div className="mt-6 pb-2 text-center flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-[11px] rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24]">
            {t('home.author')}
          </span>
          <span className="inline-flex items-center gap-1 bg-white text-[#1a1a2e]/70 font-black text-[10px] rounded-full px-3 py-1 border-[2px] border-[#1a1a2e]/30">
            {t('home.version')}
          </span>
        </div>
      </div>
    </div>
  );
}

// re-export pickLocalized for other files if needed
export { pickLocalized };
