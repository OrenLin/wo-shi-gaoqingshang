import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data';
import { levelGradient } from '../data/levels';
import { audioManager } from '../utils/audioManager';
import { useI18n, pickLocalized } from '../i18n';
import PageTopBar from '../components/ui/PageTopBar';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import AntiKingToast from '../components/ui/AntiKingToast';

export default function Result() {
  const {
    getCurrentScene,
    getCurrentSceneResult,
    goToNextScene,
    currentSceneIndex,
    setPage,
  } = useGameStore();
  const { language, setLanguage, t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  const scene = getCurrentScene();
  const sceneResult = getCurrentSceneResult();
  const nextIndex = currentSceneIndex + 1;
  const hasNext = nextIndex < scenes.length;
  const nextScene = hasNext ? scenes[nextIndex] : undefined;

  const langSwitch = (
    <button
      onClick={() => {
        audioManager.userTapped();
        audioManager.play('click');
        setLanguage(language === 'zh' ? 'en' : 'zh');
      }}
      className="inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
    >
      <span>🌐</span>
      <span>{language === 'zh' ? 'EN' : '中文'}</span>
    </button>
  );

  if (!scene || !sceneResult) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fbbf24 100%)' }}>
        <div className="text-6xl animate-bounce">🎴</div>
      </div>
    );
  }

  const { level, averageScore: score, answers } = sceneResult;
  const qsTotal = scene.questions.length;
  const qsDone = answers.length;
  const sceneFinished = qsDone >= qsTotal;
  const last = answers[answers.length - 1];
  const isAntiKing = last.level.minScore === 100;

  const gradientKey = last.level.minScore === 100 ? 'anti'
    : last.level.minScore === 90 ? 'god'
    : last.level.minScore === 70 ? 'high'
    : last.level.minScore === 40 ? 'medium' : 'low';

  const displayAnswer = last.customInput ?? (() => {
    for (const q of scene.questions) {
      const o = q.options.find((x) => x.id === last.selectedOptionId);
      if (o) return pickLocalized(o.content, language);
    }
    return '';
  })();

  return (
    <div
      className="min-h-screen relative overflow-hidden py-8 px-4"
      style={{ background: scene.bgColor }}
    >
      {/* 背景图 */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
           style={{ backgroundImage: `url(${scene.bgImage})` }}>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <FloatingEmojis
        items={[
          { emoji: '🎉', top: '6%', left: '6%', delay: '0s', size: '2.2rem' },
          { emoji: '✨', top: '12%', right: '8%', delay: '0.4s' },
          { emoji: '💫', bottom: '16%', left: '10%', delay: '0.8s' },
        ]}
      />

      {/* 抗压之王自动弹出的幽默气泡（不打断操作） */}
      {isAntiKing && <AntiKingToast auto onClose={() => {}} />}

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* 顶栏 */}
        <PageTopBar
          onBack={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setPage('select');
          }}
          backText={t('game.back')}
          rightSlot={langSwitch}
        />

        {/* 小标签 */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
            <span className="font-black text-sm text-[#1a1a2e]">{scene.emoji} {pickLocalized(scene.title, language)}</span>
          </span>
        </div>

        {/* 得分卡片 */}
        <div className={`bg-white rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e]
                        p-6 md:p-8 mb-5 transition-all duration-500 relative overflow-hidden
                        ${show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}>

          {/* 分数徽章 */}
          <div className="text-center mb-4">
            <div className={`inline-block relative bg-gradient-to-br ${levelGradient[gradientKey]} text-white
                            rounded-[24px] border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e]
                            px-6 py-4 md:px-10 md:py-5 animate-pop-in`}>
              <div className="text-xs md:text-sm font-black opacity-90 mb-1">{t('result.scoreBadge')}</div>
              <div className="text-6xl md:text-7xl font-black leading-none"
                   style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.25)' }}>
                {last.score}
              </div>
              <div className="text-xs mt-1 opacity-80">{t('result.sceneAvg')} {score}</div>
            </div>
          </div>

          {/* 段位 + 人设标签 */}
          <div className="text-center mb-4">
            <div className="text-5xl md:text-6xl mb-2 animate-wiggle"
                 style={{ filter: 'drop-shadow(3px 4px 0 rgba(26,26,46,0.2))' }}>
              {level.emoji}
            </div>
            <div className="inline-block bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1 mb-2">
              {pickLocalized(level.tag, language)}
            </div>
            <div className="text-2xl md:text-3xl font-black text-[#1a1a2e] leading-tight"
                 style={{ WebkitTextStroke: '1px #1a1a2e', textShadow: '3px 3px 0 #fbbf24' }}>
              {pickLocalized(level.name, language)}
            </div>
            <div className="text-base font-black text-[#1a1a2e]/70 mt-1">{pickLocalized(level.slogan, language)}</div>
          </div>

          {/* 解说气泡 */}
          <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 mb-4">
            <div className="absolute -top-3 -left-3 bg-pink-400 text-white font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] rotate-[-6deg]">
              {t('result.comment')}
            </div>
            <p className="text-[#1a1a2e] text-base font-bold leading-relaxed mt-1">「{pickLocalized(last.result.comment, language)}」</p>
          </div>

          {/* 贴士 */}
          <div className="relative bg-blue-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 mb-4">
            <div className="absolute -top-3 -left-3 bg-blue-400 text-white font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] rotate-[-6deg]">
              {t('result.tips')}
            </div>
            <p className="text-[#1a1a2e] text-sm font-bold mt-1">{pickLocalized(last.result.tips, language)}</p>
          </div>

          {/* 你的回答 */}
          <div className="border-t-[3px] border-[#1a1a2e]/20 pt-4">
            <div className="text-xs font-black text-[#1a1a2e]/60 mb-2">{t('result.yourReply')}</div>
            <div className="bg-[#1a1a2e]/5 rounded-xl border-[2px] border-[#1a1a2e]/15 p-4">
              <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed">{displayAnswer ?? '—'}</p>
            </div>
          </div>

          <div className="mt-4 text-center text-xs font-black text-[#1a1a2e]/60">
            {t('result.progress')} {qsDone} {t('common.of')} {qsTotal} {t('result.progressOf')}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          {sceneFinished ? (
            <>
              {hasNext ? (
                <MangaButton variant="primary" onClick={() => { audioManager.userTapped(); audioManager.play('click'); goToNextScene(); }} className="w-full !py-5 !text-xl">
                  <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>🚀</span>
                  {t('result.nextScene')} {nextScene?.emoji} {pickLocalized(nextScene?.title, language)} →
                </MangaButton>
              ) : (
                <MangaButton variant="primary" onClick={() => { audioManager.userTapped(); audioManager.play('click'); goToNextScene(); }} className="w-full !py-5 !text-xl animate-wiggle">
                  <span className="text-2xl">🎉</span> {t('result.viewFinal')}
                </MangaButton>
              )}
            </>
          ) : (
            <MangaButton variant="primary" onClick={() => { audioManager.userTapped(); audioManager.play('click'); setPage('game'); }} className="w-full !py-5 !text-xl">
              <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
              {t('result.nextQ')} ({qsDone + 1}/{qsTotal}) →
            </MangaButton>
          )}

          <MangaButton variant="secondary" onClick={() => { audioManager.userTapped(); audioManager.play('click'); setPage('select'); }} className="w-full !py-3 !text-sm">
            {t('result.backToSelect')}
          </MangaButton>
        </div>

        <div className="mt-5 text-center">
          <span className="inline-flex items-center gap-2 bg-white/80 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] text-xs font-black text-[#1a1a2e]">
            {t('result.scene')} {currentSceneIndex + 1} {t('common.of')} {scenes.length}
          </span>
        </div>
      </div>
    </div>
  );
}
