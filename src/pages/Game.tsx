import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import PageTopBar from '../components/ui/PageTopBar';
import BubbleDialog from '../components/ui/BubbleDialog';
import OptionList from '../components/scene/OptionList';
import CustomInput from '../components/scene/CustomInput';
import ProgressBar from '../components/ui/ProgressBar';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';

export default function Game() {
  const {
    getCurrentScene,
    getCurrentQuestion,
    submitAnswer,
    customInputs,
    setCustomInput,
    setPage,
  } = useGameStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  // 控制内容滑入动画的 key（题目变化时切换，触发重渲染+动画）
  const [contentKey, setContentKey] = useState(0);

  const scene = getCurrentScene();
  const qInfo = getCurrentQuestion();

  // 新题目进来：重置状态 + 触发滑入动画
  useEffect(() => {
    setSelectedOption(null);
    setUseCustom(false);
    setContentKey(k => k + 1);
  }, [scene?.id, qInfo?.question.id]);

  if (!scene || !qInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fbbf24 100%)' }}>
        <div className="text-5xl animate-bounce">🎴</div>
      </div>
    );
  }

  const question = qInfo.question;
  const qIndex = qInfo.questionIndex;
  const totalQs = scene.questions.length;
  const customKey = `${scene.id}:${question.id}`;

  const handleSubmit = () => {
    audioManager.ensureReady();
    if (useCustom) {
      const text = customInputs[customKey] ?? '';
      if (text.trim().length > 0) {
        audioManager.play('submit');
        submitAnswer(undefined, text);
      }
    } else if (selectedOption) {
      const option = question.options.find(o => o.id === selectedOption);
      if (option?.level === 'anti') {
        audioManager.play('anti');
      } else {
        audioManager.play('submit');
      }
      submitAnswer(selectedOption);
    }
  };

  const canSubmit = useCustom
    ? (customInputs[customKey] ?? '').trim().length > 0
    : !!selectedOption;

  const speaker = question.characters?.[0] ?? scene.characters[0];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: scene.bgColor }}>
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${scene.bgImage})`, transform: 'scale(1.05)', opacity: 0.95 }}
      >
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(180deg, rgba(26,26,46,0.25) 0%, rgba(26,26,46,0.55) 55%, rgba(26,26,46,0.88) 100%)' }} />
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

      <div className="relative z-10 min-h-screen py-5 px-3 md:px-5 flex flex-col">
        <div className="max-w-2xl mx-auto w-full">
          {/* 顶栏 */}
          <PageTopBar
            onBack={() => setPage('select')}
            title={`${scene.emoji} ${scene.title}`}
          />

          {/* 进度条 */}
          <div className="mb-4">
            <ProgressBar current={qIndex + 1} total={totalQs} />
          </div>

          {/* ===== 答题内容区：每次换题从上往下滑入 ===== */}
          <div
            key={contentKey}
            className="animate-slide-down"
          >
            {/* 对话气泡 */}
            <div className="mb-4">
              <BubbleDialog
                character={speaker}
                dialog={question.triggerDialog}
                badge="💬 灵魂拷问"
              />
            </div>

            {/* 选项 / 自由发挥 切换 */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-black text-white drop-shadow-md flex items-center gap-2"
                  style={{ textShadow: '2px 2px 0 rgba(26,26,46,0.6)' }}>
                <span>💡</span>
                你会怎么回应？
              </h3>
              <MangaButton
                variant="secondary"
                onClick={() => {
                  audioManager.play('click');
                  setUseCustom(!useCustom);
                  setSelectedOption(null);
                }}
                className="!py-2 !px-4 !text-xs"
              >
                ✍️ {useCustom ? '返回选项' : '自由发挥'}
              </MangaButton>
            </div>

            {useCustom ? (
              <CustomInput
                value={customInputs[customKey] ?? ''}
                onChange={(v) => setCustomInput(customKey, v)}
              />
            ) : (
              <OptionList
                options={question.options}
                selectedId={selectedOption}
                onSelect={setSelectedOption}
              />
            )}
          </div>

          {/* 提交按钮 */}
          <div className="mt-5 pb-4">
            <MangaButton
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full !py-5 !text-xl"
            >
              <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
              {canSubmit ? (qIndex + 1 === totalQs ? '揭晓本场景结果！' : '提交本题答案 →') : '👆 先选一个回应'}
            </MangaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
