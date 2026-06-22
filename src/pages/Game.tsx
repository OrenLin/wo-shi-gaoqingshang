import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import { useI18n, pickLocalized } from '../i18n';
import PageTopBar from '../components/ui/PageTopBar';
import BubbleDialog from '../components/ui/BubbleDialog';
import OptionList from '../components/scene/OptionList';
import CustomInput from '../components/scene/CustomInput';
import ProgressBar from '../components/ui/ProgressBar';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import type { Option } from '../data/types';

// Fisher-Yates 随机打乱
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Game() {
  const {
    getCurrentScene,
    getCurrentQuestion,
    submitAnswer,
    customInputs,
    setCustomInput,
    setPage,
    streakAnti,
    streakLow,
    hellMode,
  } = useGameStore();
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const t = useI18n((s) => s.t);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);

  // 微反馈提示（"嘴替附体" / "抠出三室一厅"）
  const [feedback, setFeedback] = useState<{ type: 'smart' | 'cringe' | null; key: number }>({
    type: null,
    key: 0,
  });

  const scene = getCurrentScene();
  const qInfo = getCurrentQuestion();

  // 新题目进来：重置状态 + 随机打乱选项
  useEffect(() => {
    setSelectedOption(null);
    setUseCustom(false);
    setContentKey((k) => k + 1);
    if (qInfo?.question?.options) {
      setShuffledOptions(shuffle(qInfo.question.options));
    }
  }, [scene?.id, qInfo?.question.id]);

  // 连对/连错触发彩蛋
  useEffect(() => {
    if (streakAnti >= 3) {
      setFeedback({ type: 'smart', key: Date.now() });
      audioManager.userTapped();
      audioManager.play('smartClick');
    } else if (streakLow >= 3) {
      setFeedback({ type: 'cringe', key: Date.now() });
      audioManager.userTapped();
      audioManager.play('caw');
    }
  }, [streakAnti, streakLow]);

  if (!scene || !qInfo) {
    return (
      <div
        aria-label={language === 'zh' ? '加载中' : 'Loading'}
      >
        <div aria-hidden="true" className="text-5xl animate-bounce">🎴</div>
      </div>
    );
  }

  const question = qInfo.question;
  const qIndex = qInfo.questionIndex;
  const totalQs = scene.questions.length;
  const customKey = `${scene.id}:${question.id}`;

  const handleSubmit = () => {
    audioManager.userTapped();
    if (useCustom) {
      const text = customInputs[customKey] ?? '';
      if (text.trim().length > 0) {
        audioManager.play('submit');
        submitAnswer(undefined, text);
      }
    } else if (selectedOption) {
      const option = question.options.find((o) => o.id === selectedOption);
      if (option?.level === 'anti') {
        audioManager.play('anti');
      } else if (option?.level === 'god' || option?.level === 'high') {
        audioManager.play('smartClick');
        setFeedback({ type: 'smart', key: Date.now() });
      } else if (option?.level === 'low') {
        audioManager.play('caw');
        setFeedback({ type: 'cringe', key: Date.now() });
      } else {
        audioManager.play('submit');
      }
      submitAnswer(selectedOption, undefined, option?.level);
    }
  };

  const canSubmit = useCustom
    ? (customInputs[customKey] ?? '').trim().length > 0
    : !!selectedOption;

  const speaker = question.characters?.[0] ?? scene.characters[0];

  const langSwitch = (
    <button
      aria-label={language === 'zh' ? '切换到英文' : '切换到中文'}
      onClick={() => {
        audioManager.userTapped();
        audioManager.play('click');
        setLanguage(language === 'zh' ? 'en' : 'zh');
      }}
      className="inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0 #fbbf24] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
    >
      <span aria-hidden="true">🌐</span>
      <span>{language === 'zh' ? 'EN' : '中文'}</span>
    </button>
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: scene.bgColor }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${scene.bgImage})`,
          transform: 'scale(1.05)',
          opacity: 0.95,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(26,26,46,0.25) 0%, rgba(26,26,46,0.55) 55%, rgba(26,26,46,0.88) 100%)',
          }}
        />
      </div>

      <div className="absolute inset-0 manga-stripes opacity-10 pointer-events-none" />

      <FloatingEmojis
        items={[
          { emoji: '✨', top: '8%', left: '6%', delay: '0s' },
          { emoji: '💫', top: '18%', right: '8%', delay: '0.4s', size: '2rem' },
          { emoji: '💭', bottom: '20%', left: '10%', delay: '0.8s' },
          { emoji: '🎯', bottom: '12%', right: '6%', delay: '1.2s', size: '2rem' },
        ]}
      />

      {/* 全屏微反馈浮层（1.5 秒消失）—— aria-live 播报给屏幕阅读器 */}
      {feedback.type && (
        <div
          key={feedback.key}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-pop-in"
          style={{ animationDuration: '0.4s' }}
        >
          <div
            className={`px-8 py-6 rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] text-center
              ${feedback.type === 'smart'
                ? 'bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300'
                : 'bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400'
              }`}
            style={{ transform: 'rotate(-4deg)' }}
          >
            <div aria-hidden="true" className="text-6xl mb-2 animate-wiggle">
              {feedback.type === 'smart' ? '🎯' : '💀'}
            </div>
            <div className="text-2xl md:text-3xl font-black text-[#1a1a2e] leading-tight">
              {feedback.type === 'smart' ? t('game.feedbackSmart') : t('game.feedbackCringe')}
            </div>
            {feedback.type === 'smart' && streakAnti >= 3 && (
              <div className="mt-3 text-sm font-bold text-[#1a1a2e]/70">
                🔥 {language === 'zh' ? '连对' : 'Streak'} x{streakAnti}
              </div>
            )}
            {feedback.type === 'cringe' && streakLow >= 3 && (
              <div className="mt-3 text-sm font-bold text-[#1a1a2e]/70">
                💥 {language === 'zh' ? '连社死' : 'Cringe Streak'} x{streakLow}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen py-5 px-3 md:px-5 flex flex-col">
        <div className="max-w-2xl mx-auto w-full">
          <PageTopBar
            onBack={() => setPage('select')}
            backText={t('game.back')}
            title={`${scene.emoji} ${pickLocalized(scene.title, language)}${
              hellMode ? (language === 'zh' ? ' · 地狱模式' : ' · Hell Mode') : ''
            }`}
            rightSlot={langSwitch}
          />

          <div className="mb-4">
            <ProgressBar current={qIndex + 1} total={totalQs} />
          </div>

          <div key={contentKey} className="animate-slide-down">
            <div className="mb-4">
              <BubbleDialog
                character={{
                  emoji: speaker.emoji,
                  name: pickLocalized(speaker.name, language),
                  description: speaker.description
                    ? pickLocalized(speaker.description, language)
                    : undefined,
                }}
                dialog={pickLocalized(question.triggerDialog, language)}
                badge={t('game.questionBadge')}
              />
            </div>

            <div className="flex items-center justify-between mb-4 px-1">
              <h3
                className="text-lg font-black text-white drop-shadow-md flex items-center gap-2"
                style={{ textShadow: '2px 2px 0 rgba(26,26,46,0.6)' }}
              >
                <span aria-hidden="true">💡</span>
                <span>{t('game.howReply')}</span>
              </h3>
              {question.allowCustomInput !== false && (
                <MangaButton
                  variant="secondary"
                  onClick={() => {
                    audioManager.userTapped();
                    audioManager.play('click');
                    setUseCustom(!useCustom);
                    setSelectedOption(null);
                  }}
                  className="!py-2 !px-4 !text-xs"
                >
                  {useCustom ? t('game.toggleOptions') : t('game.toggleCustom')}
                </MangaButton>
              )}
            </div>

            {useCustom ? (
              <CustomInput
                value={customInputs[customKey] ?? ''}
                onChange={(v) => setCustomInput(customKey, v)}
                badgeText={t('game.toggleCustom')}
              />
            ) : (
              <>
                <OptionList
                  options={shuffledOptions.length > 0 ? shuffledOptions : question.options}
                  selectedId={selectedOption}
                  onSelect={setSelectedOption}
                  renderContent={(opt) => pickLocalized(opt.content, language)}
                />
                {/* 选项底部"自由发挥"按钮 —— 更便捷的入口 */}
                {question.allowCustomInput !== false && (
                  <button
                    onClick={() => {
                      audioManager.userTapped();
                      audioManager.play('click');
                      setUseCustom(true);
                      setSelectedOption(null);
                    }}
                    className="mt-3 w-full p-3 rounded-2xl border-[3px] border-dashed border-[#1a1a2e]/50 bg-white/40 hover:bg-white/70 hover:border-[#1a1a2e] transition-all text-[#1a1a2e]/70 hover:text-[#1a1a2e] font-bold text-sm flex items-center justify-center gap-2"
                    aria-label={t('game.toggleCustom')}
                  >
                    <span className="text-base">✍️</span>
                    <span>{language === 'zh' ? '我有更好的回应 · 自由发挥' : 'I have a better response · Freestyle'}</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mt-5 pb-4">
            <MangaButton
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              aria-label={
                canSubmit
                  ? qIndex + 1 === totalQs
                    ? t('game.revealScene')
                    : t('game.submit')
                  : t('game.pickOne')
              }
              aria-disabled={!canSubmit}
              className="w-full !py-5 !text-xl"
            >
              <span
                className="text-2xl animate-bounce"
                style={{ animationDuration: '1.2s' }}
              >
                🎯
              </span>
              {canSubmit
                ? qIndex + 1 === totalQs
                  ? t('game.revealScene')
                  : t('game.submit')
                : t('game.pickOne')}
            </MangaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
