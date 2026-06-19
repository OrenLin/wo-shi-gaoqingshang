import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getOptionLevel, levelGradient } from '../data/levels';
import { scenes } from '../data';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import { useI18n, pickLocalized } from '../i18n';

export default function FinalReport() {
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const t = useI18n((s) => s.t);
  const {
    getFinalReport,
    reset,
    selectScene,
    maxStreakAnti,
    maxStreakLow,
  } = useGameStore();
  const [show, setShow] = useState(false);
  const report = getFinalReport();

  const levelName = pickLocalized(report.level.name, language);
  const levelTag = pickLocalized(report.level.tag, language);
  const core = pickLocalized(report.level.descModule.core, language);
  const history = pickLocalized(report.level.descModule.history, language);
  const comment = pickLocalized(report.level.descModule.comment, language);
  const socialCopy = pickLocalized(report.level.socialCopy, language);

  const isAntiKing = report.averageScore === 100;
  const gradient = isAntiKing
    ? 'anti'
    : report.averageScore >= 90
    ? 'god'
    : report.averageScore >= 70
    ? 'high'
    : report.averageScore >= 40
    ? 'medium'
    : 'low';

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleShare = () => {
    const template = t('report.shareTemplate');
    const text = template
      .replace('{score}', String(report.averageScore))
      .replace('{emoji}', report.level.emoji)
      .replace('{level}', levelName)
      .replace('{copy}', socialCopy);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => alert(t('report.copied')),
        () => alert(text),
      );
    } else {
      alert(text);
    }
  };

  const toggleLanguage = () => setLanguage(language === 'zh' ? 'en' : 'zh');

  return (
    <div
      className="min-h-screen relative overflow-hidden py-8 px-4"
      style={{
        background:
          'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
      }}
    >
      <div className="absolute inset-0 manga-stripes opacity-25 pointer-events-none" />
      <FloatingEmojis
        items={[
          { emoji: '🎉', top: '8%', left: '5%', delay: '0s' },
          { emoji: '✨', top: '14%', right: '8%', delay: '0.4s', size: '2.2rem' },
          { emoji: '💫', bottom: '18%', left: '8%', delay: '0.8s' },
          { emoji: '🎊', bottom: '12%', right: '5%', delay: '1.2s' },
        ]}
      />

      <div className="relative z-20 max-w-2xl mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1 bg-white border-[3px] border-[#1a1a2e] rounded-full px-3 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-transform active:scale-95 hover:scale-105"
        >
          {t('select.home')}
        </button>
        <button
          onClick={toggleLanguage}
          className="inline-flex items-center gap-1 bg-white border-[3px] border-[#1a1a2e] rounded-full px-3 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-transform active:scale-95 hover:scale-105"
        >
          {t('lang.label')}
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle">
            <span className="font-black text-sm text-[#1a1a2e]">
              {t('report.allDone')}
            </span>
          </span>
        </div>

        <div
          className={`bg-white rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] p-6 md:p-8 mb-5 transition-all duration-500 relative overflow-hidden ${
            show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          {/* Hero visual */}
          <div className="text-center mb-5">
            <div className="text-7xl mb-3 animate-wiggle" style={{ filter: 'drop-shadow(3px 4px 0 rgba(26,26,46,0.25))' }}>
              {report.level.emoji}
            </div>
            <div className="inline-block bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs rounded-full px-4 py-1.5 mb-3 shadow-[3px_3px_0_0_#1a1a2e]">
              {levelTag}
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-[#1a1a2e] leading-tight"
              style={{ WebkitTextStroke: '1px #1a1a2e', textShadow: '3px 3px 0 #fbbf24' }}
            >
              {levelName}
            </h2>
          </div>

          {/* 综合得分 + 击败全球百分比 */}
          <div className="text-center mb-5">
            <div
              className={`inline-block relative bg-gradient-to-br ${levelGradient[gradient]} text-white rounded-[24px] border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e] px-8 py-6 md:px-12 md:py-8 animate-pop-in`}
            >
              <div className="text-lg md:text-xl font-black opacity-90 mb-1">
                {t('report.totalScore')}
              </div>
              <div
                className="text-7xl md:text-8xl font-black leading-none mb-2"
                style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.25)' }}
              >
                {report.averageScore}
              </div>
            </div>

            {/* 击败全球百分比 */}
            <div
              className="mt-4 inline-block relative bg-white border-[3px] border-[#1a1a2e] rounded-[20px] shadow-[4px_4px_0_0_#1a1a2e] px-5 py-3 animate-pop-in"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="text-sm font-black text-[#1a1a2e]/70 mb-1">
                🌍 {language === 'zh' ? '你的表现已超越' : 'You beat'}
              </div>
              <div className="text-4xl font-black text-rose-500 leading-none">
                {report.percentile.toFixed(1)}%
              </div>
              <div className="text-sm font-black text-[#1a1a2e]/70 mt-1">
                {language === 'zh' ? '全球玩家' : 'of players worldwide'}
              </div>
            </div>
          </div>

          {/* Per-scene scores */}
          <div className="mb-5">
            <h4 className="text-center text-lg font-black text-[#1a1a2e] mb-4">
              {t('report.scenePerf')}
            </h4>
            <div className="space-y-3">
              {report.scenes.map((sr, i) => {
                const s = scenes.find((x) => x.id === sr.sceneId);
                const sceneTitle = s ? pickLocalized(s.title, language) : '';
                return (
                  <div
                    key={sr.sceneId}
                    className="relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-[3px] border-[#1a1a2e] p-3 md:p-4 shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-2xl flex-shrink-0">{s?.emoji}</span>
                        <span className="font-black text-[#1a1a2e] text-sm md:text-base truncate">
                          {sceneTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xl">{sr.level.emoji}</span>
                        <span className="text-2xl md:text-3xl font-black text-[#1a1a2e]">
                          {sr.averageScore}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 border-[2px] border-[#1a1a2e]/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 transition-all duration-[1200ms]"
                        style={{ width: show ? `${Math.min(100, sr.averageScore)}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 隐藏成就展示 */}
          {(maxStreakAnti >= 3 || maxStreakLow >= 3) && (
            <div className="mb-5 bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in">
              <div className="text-center mb-3">
                <span className="inline-flex items-center gap-2 bg-amber-400 text-white font-black text-xs rounded-full px-4 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                  🏅 {t('report.hiddenAchievement')}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {maxStreakAnti >= 3 && (
                  <div className="text-center bg-white rounded-2xl border-[3px] border-[#1a1a2e] px-4 py-3 shadow-[3px_3px_0_0_#1a1a2e] min-w-[150px]">
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="font-black text-sm text-[#1a1a2e]">
                      {t('report.achievementEqCeiling')}
                    </div>
                    <div className="text-xs font-bold text-[#1a1a2e]/60 mt-1">
                      {language === 'zh' ? '连胜' : 'Streak'} ×{maxStreakAnti}
                    </div>
                  </div>
                )}
                {maxStreakLow >= 3 && (
                  <div className="text-center bg-white rounded-2xl border-[3px] border-[#1a1a2e] px-4 py-3 shadow-[3px_3px_0_0_#1a1a2e] min-w-[150px]">
                    <div className="text-3xl mb-1">💀</div>
                    <div className="font-black text-sm text-[#1a1a2e]">
                      {t('report.achievementSocialKiller')}
                    </div>
                    <div className="text-xs font-bold text-[#1a1a2e]/60 mt-1">
                      {language === 'zh' ? '社死连' : 'Awkward Streak'} ×{maxStreakLow}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 四段段位解析 */}
          <div className="space-y-3 mb-5">
            <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e]">
              <div className="absolute -top-3 left-4 bg-yellow-400 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                {t('report.core')}
              </div>
              <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed mt-2">{core}</p>
            </div>

            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e]">
              <div className="absolute -top-3 left-4 bg-purple-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                {t('report.history')}
              </div>
              <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed mt-2">{history}</p>
            </div>

            <div className="relative bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e]">
              <div className="absolute -top-3 left-4 bg-sky-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                {t('report.comment')}
              </div>
              <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed mt-2">{comment}</p>
            </div>
          </div>

          {/* 分享文案 */}
          <div className="relative bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-2xl border-[3px] border-[#1a1a2e] p-5 text-center shadow-[3px_3px_0_0_#1a1a2e]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1">
              {t('report.share')}
            </div>
            <p className="text-[#1a1a2e] text-sm md:text-base font-black leading-relaxed mt-1">
              {socialCopy}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <MangaButton
            variant="primary"
            onClick={handleShare}
            className="w-full !py-5 !text-xl"
          >
            <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>
              📤
            </span>
            {t('report.shareBtn')}
          </MangaButton>

          {/* 地狱模式按钮 */}
          <MangaButton
            variant="danger"
            onClick={() => {
              const randomIdx = Math.floor(Math.random() * scenes.length);
              selectScene(randomIdx, { hellMode: true });
            }}
            className="w-full !py-5 !text-xl"
          >
            <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>
              🔥
            </span>
            {t('report.hellMode')}
          </MangaButton>

          <MangaButton variant="secondary" onClick={reset} className="w-full !py-5 !text-xl">
            {t('report.retry')}
          </MangaButton>
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-2 bg-white/80 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] text-xs font-black text-[#1a1a2e]">
            {t('report.footer')}
          </span>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = { getOptionLevel };
