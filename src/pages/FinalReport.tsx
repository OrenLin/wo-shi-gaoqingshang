import { useEffect, useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getOptionLevel, levelGradient, bonusReco } from '../data/levels';
import { scenes } from '../data';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import ScoreBoard from '../components/ui/ScoreBoard';
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const report = getFinalReport();

  // 基于答题分布计算 5 个情商维度得分
  const eqDims = useMemo(() => {
    const allAnswers = report.scenes.flatMap((sr) => sr.answers);
    if (allAnswers.length === 0) {
      return [];
    }

    // 用 AnswerRecord.optionLevel（'anti' | 'god' | 'high' | 'medium' | 'low'）
    const counts: Record<string, number> = { god: 0, high: 0, medium: 0, low: 0, anti: 0 };
    allAnswers.forEach((a) => {
      if (a.optionLevel) {
        counts[a.optionLevel] = (counts[a.optionLevel] ?? 0) + 1;
      } else {
        // 兜底：没有 optionLevel 的根据分数推断
        const fallback = a.score >= 95 ? 'god'
          : a.score >= 75 ? 'high'
          : a.score >= 55 ? 'medium'
          : a.score >= 30 ? 'low'
          : 'anti';
        counts[fallback] = (counts[fallback] ?? 0) + 1;
      }
    });
    const total = allAnswers.length;
    const toPct = (n: number) => Math.round(Math.min(100, (n / total) * 100));

    return [
      {
        key: 'advocate',
        label: { zh: '嘴替力', en: 'Advocate' },
        color: '#f59e0b',
        colorEnd: '#d97706',
        value: toPct((counts.god ?? 0) + (counts.high ?? 0)),
      },
      {
        key: 'social',
        label: { zh: '社交力', en: 'Social' },
        color: '#34d399',
        colorEnd: '#059669',
        value: toPct(counts.medium ?? 0),
      },
      {
        key: 'pressure',
        label: { zh: '抗压力', en: 'Pressure' },
        color: '#60a5fa',
        colorEnd: '#2563eb',
        value: toPct(counts.low ?? 0),
      },
      {
        key: 'awkward',
        label: { zh: '社死预警', en: 'Awkward' },
        color: '#f87171',
        colorEnd: '#dc2626',
        value: toPct(counts.anti ?? 0),
      },
      {
        key: 'growth',
        label: { zh: '成长值', en: 'Growth' },
        color: '#a78bfa',
        colorEnd: '#7c3aed',
        value: Math.min(100, Math.round(report.averageScore + (counts.god ?? 0) * 5)),
      },
    ];
  }, [report]);

  const levelName = pickLocalized(report.level.name, language);
  const levelTag = pickLocalized(report.level.tag, language);
  const core = pickLocalized(report.level.descModule.core, language);
  const history = pickLocalized(report.level.descModule.history, language);
  const comment = pickLocalized(report.level.descModule.comment, language);
  const socialCopy = pickLocalized(report.level.socialCopy, language);

  // 复制单个推荐项内容
  const handleCopyReco = (icon: string, title: string, desc: string) => {
    const text = `${icon} ${title}\n${desc}`;
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopiedKey(title);
        setTimeout(() => setCopiedKey(null), 1500);
      },
      () => {},
    );
  };

  // 复制全量推荐清单
  const handleCopyAll = () => {
    const head = `【${levelName} · 段位书单&影单】\n\n`;
    const body = report.level.recos
      .map((r, i) => `${i + 1}. ${r.icon} ${pickLocalized(r.title, language)}\n${pickLocalized(r.desc, language)}`)
      .join('\n\n');
    const bonus = `\n\n🎞️ 彩蛋（全段位通用）：${pickLocalized(bonusReco.title, language)}\n${pickLocalized(bonusReco.desc, language)}`;
    const text = head + body + bonus;
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopiedKey('__all__');
        setTimeout(() => setCopiedKey(null), 1500);
      },
      () => {},
    );
  };

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

          {/* 融合式 ScoreBoard：分数 + 雷达图 + Beat% */}
          {eqDims.length > 0 && (
            <ScoreBoard
              score={report.averageScore}
              percentile={report.percentile}
              dims={eqDims}
              language={language}
              levelName={levelName}
              levelEmoji={report.level.emoji}
              show={show}
              beatTitle={language === 'zh' ? '你的表现已超越' : 'You beat'}
              beatSubtitle={language === 'zh' ? '全球玩家' : 'of players worldwide'}
              scoreLabel={t('report.totalScore')}
              boardTitle={t('report.scoreboard')}
            />
          )}

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

          {/* 📖🎬 段位推荐卡片 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base md:text-lg font-black text-[#1a1a2e] flex items-center gap-2">
                <span className="text-2xl">{t('report.reco')}</span>
              </h4>
              <button
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1 bg-white border-[3px] border-[#1a1a2e] rounded-full px-3 py-1 shadow-[2px_2px_0_0_#1a1a2e] text-xs font-black text-[#1a1a2e] hover:-translate-y-[1px] active:translate-y-[1px] transition-transform"
              >
                {copiedKey === '__all__' ? '✨ ' + t('report.copiedShort') : '📋 ' + t('report.copyAll')}
              </button>
            </div>

            <div className="space-y-3">
              {report.level.recos.map((r, i) => {
                const title = pickLocalized(r.title, language);
                const desc = pickLocalized(r.desc, language);
                const isCopied = copiedKey === title;
                return (
                  <div
                    key={i}
                    className="relative bg-gradient-to-br from-white to-amber-50/60 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl flex-shrink-0 mt-0.5">{r.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-[#1a1a2e] text-sm md:text-base mb-1.5">
                          {title}
                        </div>
                        <p className="text-[#1a1a2e]/75 text-xs md:text-sm font-bold leading-relaxed">
                          {desc}
                        </p>
                        <button
                          onClick={() => handleCopyReco(r.icon, title, desc)}
                          className="mt-2.5 inline-flex items-center gap-1 bg-amber-400 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] hover:-translate-y-[1px] active:translate-y-[1px] transition-transform"
                        >
                          {isCopied ? '✨ ' + t('report.copiedShort') : '📋 ' + t('report.copyOne')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 全段位通用彩蛋纪录片 */}
            <div
              className="mt-4 relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl border-[3px] border-dashed border-[#1a1a2e] p-4 animate-pop-in"
              style={{ animationDelay: '300ms' }}
            >
              <div className="absolute -top-3 left-4 bg-pink-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                {t('report.recoBonus')}
              </div>
              <div className="flex items-start gap-3 mt-1.5">
                <div className="text-3xl flex-shrink-0">{bonusReco.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[#1a1a2e] text-sm md:text-base mb-1.5">
                    {pickLocalized(bonusReco.title, language)}
                  </div>
                  <p className="text-[#1a1a2e]/75 text-xs md:text-sm font-bold leading-relaxed">
                    {pickLocalized(bonusReco.desc, language)}
                  </p>
                  <button
                    onClick={() => handleCopyReco(
                      bonusReco.icon,
                      pickLocalized(bonusReco.title, language),
                      pickLocalized(bonusReco.desc, language),
                    )}
                    className="mt-2.5 inline-flex items-center gap-1 bg-pink-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] hover:-translate-y-[1px] active:translate-y-[1px] transition-transform"
                  >
                    {copiedKey === pickLocalized(bonusReco.title, language) ? '✨ ' + t('report.copiedShort') : '📋 ' + t('report.copyOne')}
                  </button>
                </div>
              </div>
            </div>
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

        <div className="mt-3 text-center">
          <span className="inline-flex items-center justify-center bg-transparent text-[11px] md:text-xs font-bold text-[#1a1a2e]/55 leading-relaxed max-w-md mx-auto">
            {t('report.disclaimer')}
          </span>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = { getOptionLevel };
