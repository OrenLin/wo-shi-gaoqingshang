import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import { useI18n, pickLocalized } from '../i18n';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import ConsentModal from '../components/ui/ConsentModal';

export default function Home() {
  const { setPage, setCodename, consented, setConsented, selectScene, reset } = useGameStore();
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const t = useI18n((s) => s.t);

  const [codename, setCodenameInput] = useState('');
  const [consentOpen, setConsentOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [accept, setAccept] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');

  const zh = language === 'zh';

  // 搞怪 loading 文案循环显示
  useEffect(() => {
    if (!loading) return;
    const texts = [
      t('home.loading1'),
      t('home.loading2'),
      t('home.loading3'),
      t('home.loading4'),
    ];
    let idx = 0;
    setLoadingText(texts[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLoadingText(texts[idx]);
    }, 800);
    // 0.8 秒后结束 loading（轻量级不打断用户）
    const done = setTimeout(() => setLoading(false), 1200);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [loading, t]);

  const handleStart = () => {
    audioManager.userTapped();
    audioManager.play('click');
    if (!consented) {
      setConsentOpen(true);
      return;
    }
    const name = codename.trim().length > 0 ? codename.trim().slice(0, 20) : '';
    setCodename(name);
    setPage('select');
  };

  const handleConsentConfirm = () => {
    if (!accept) return;
    setConsented(true);
    setConsentOpen(false);
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
        <button
          aria-label={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setLanguage(language === 'zh' ? 'en' : 'zh');
          }}
          className="ml-3 inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
        >
          <span aria-hidden="true">🌐</span>
          <span>{language === 'zh' ? 'EN' : '中文'}</span>
        </button>
      </div>

      {/* Loading 层（首次进入显示一下，不阻塞） */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-amber-100/95">
          <div className="text-center">
            <div className="text-7xl animate-bounce mb-4" aria-hidden="true">🎴</div>
            <div className="text-2xl font-black text-[#1a1a2e] animate-pulse">
              {loadingText}
            </div>
          </div>
        </div>
      )}

      {/* 主标题 */}
      <div className="relative z-10 text-center mt-4">
        <div className="relative inline-block">
          <div className="absolute -top-5 -left-6 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-spin-slow -z-10" />
          <div
            className="absolute -bottom-4 -right-4 w-14 h-14 bg-sky-400 rounded-full opacity-60 animate-spin-slow -z-10"
            style={{ animationDirection: 'reverse' }}
          />

          <div
            className="text-5xl md:text-6xl font-black text-[#1a1a2e] leading-none animate-wiggle"
            style={{ textShadow: '4px 4px 0 #fbbf24, 8px 8px 0 rgba(26,26,46,0.2)', WebkitTextStroke: '2px #1a1a2e' }}
          >
            {t('home.title1')}
          </div>
          <div
            className="mt-1 text-6xl md:text-7xl font-black leading-none animate-wiggle"
            style={{
              background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #facc15 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '3px #1a1a2e',
              textShadow: '6px 6px 0 rgba(26,26,46,0.15)',
              animationDelay: '0.2s',
            }}
          >
            {t('home.title2')}
            {!zh && <span style={{ color: 'transparent' }}>{t('home.title2b')}</span>}
          </div>

          <div className="absolute -top-3 -right-4 md:-right-10 bg-red-500 text-white font-black text-xs md:text-sm rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle rotate-[12deg]"
            style={{ animationDelay: '0.5s' }}
            aria-hidden="true"
          >
            {t('home.hot')}
          </div>
        </div>

        <div className="mt-6 inline-block relative">
          <div className="relative bg-white border-[3px] border-[#1a1a2e] rounded-2xl px-5 py-3 shadow-[5px_5px_0_0_#1a1a2e]">
            <p className="text-sm md:text-base font-black text-[#1a1a2e]">{t('home.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* 代号输入 + 开始按钮 */}
      <div className="relative z-10 w-full max-w-md mt-6">
        <div className="bg-white rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 mb-4 relative">
          <div className="absolute -top-3 left-4 bg-pink-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]" aria-hidden="true">
            👤 {t('home.codenameInput')}
          </div>
          <input
            type="text"
            value={codename}
            onChange={(e) => setCodenameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart();
            }}
            placeholder={t('home.codenamePh')}
            maxLength={20}
            className="w-full text-xl md:text-2xl font-black text-[#1a1a2e] placeholder:text-[#1a1a2e]/30 bg-yellow-50 border-[3px] border-[#1a1a2e] rounded-2xl px-4 py-3 mt-2 outline-none focus:bg-yellow-100 transition-colors text-center"
          />
          <div className="mt-2 text-right text-xs font-bold text-[#1a1a2e]/50">
            {codename.length}/20 {t('home.chars')}
          </div>
        </div>

        <MangaButton
          variant="primary"
          onClick={handleStart}
          aria-label={codename.trim().length > 0 ? t('home.startWithName') : t('home.startAnon')}
          className="w-full !py-5 !text-xl"
        >
          <span aria-hidden="true" className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
          {codename.trim().length > 0 ? t('home.startWithName') : t('home.startAnon')}
        </MangaButton>

        {/* 地狱模式入口 */}
        <button
          aria-label={t('report.hellMode')}
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('caw');
            if (!consented) {
              setConsentOpen(true);
              return;
            }
            const name = codename.trim().length > 0 ? codename.trim().slice(0, 20) : '';
            setCodename(name);
            const randomIdx = Math.floor(Math.random() * 3);
            selectScene(randomIdx, { hellMode: true });
          }}
          className="mt-3 w-full !py-4 !text-sm inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white font-black rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
        >
          <span aria-hidden="true" className="text-2xl animate-bounce" style={{ animationDuration: '1s' }}>🔥</span>
          {t('report.hellMode')}
        </button>

        <div className="mt-3 text-center text-[10px] font-bold text-[#1a1a2e]/60">
          {t('report.hellModeDesc')}
        </div>

        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border-[2px] border-[#1a1a2e] rounded-full px-4 py-1.5 text-xs font-black text-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
            {t('home.hint')}
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-bold text-[#1a1a2e]/60">{t('home.guide')}</p>

        {/* 底部：作者 + 版本号 */}
        <div className="mt-6 pb-2 text-center flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-[11px] rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24]">
            {t('home.author')}
          </span>
          <span className="inline-flex items-center gap-1 bg-white text-[#1a1a2e]/70 font-black text-[10px] rounded-full px-3 py-1 border-[2px] border-[#1a1a2e]/30">
            {t('home.version')}
          </span>

          {/* 隐私小按钮 —— 任何时候都可以查看 */}
          <button
            onClick={() => {
              setConsentOpen(true);
              setShowPrivacy(false);
            }}
            className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#1a1a2e]/60 hover:text-[#1a1a2e] underline underline-offset-4 transition-colors"
          >
            🔒 {zh ? '隐私与使用说明' : 'Privacy & Usage Notice'}
          </button>

          {/* 状态徽章 */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black rounded-full px-3 py-1 border-[2px] border-[#1a1a2e]/30 ${
              consented ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}
          >
            {consented
              ? zh
                ? '✓ 已同意匿名访问'
                : '✓ Anonymous access granted'
              : zh
                ? '⏳ 首次开始时需同意'
                : '⏳ Consent on first start'}
          </span>
        </div>
      </div>

      {/* Consent 弹窗 */}
      <ConsentModal
        open={consentOpen}
        accepted={accept}
        showPrivacy={showPrivacy}
        onToggleAccept={setAccept}
        onTogglePrivacy={setShowPrivacy}
        onConfirm={handleConsentConfirm}
      />
    </div>
  );
}

export { pickLocalized };
