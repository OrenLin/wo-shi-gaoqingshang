import { useState } from 'react';
import {
  ANXIETY_QUESTIONS,
  calculatePath,
  type QuizResult,
} from '../../utils/anxietyQuiz';
import { audioManager } from '../../utils/audioManager';
import { useI18n, pickLocalized } from '../../i18n';

type Phase = 'intro' | 'quiz' | 'result';

export default function AnxietyQuiz() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStart = () => {
    audioManager.userTapped();
    audioManager.play('click');
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers([]);
  };

  const handleAnswer = (optionId: string) => {
    audioManager.userTapped();
    audioManager.play('select');
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionId;
    setAnswers(newAnswers);

    // 自动进入下一题
    setTimeout(() => {
      if (currentQ < ANXIETY_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        const r = calculatePath(newAnswers);
        setResult(r);
        setPhase('result');
        audioManager.play('success');
      }
    }, 350);
  };

  const handleRetry = () => {
    audioManager.userTapped();
    audioManager.play('click');
    setPhase('intro');
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  // ===== Intro 页 =====
  if (phase === 'intro') {
    return (
      <div className="bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-6 text-center animate-pop-in">
        <div className="text-6xl mb-3 animate-float-gentle" aria-hidden="true">🧠</div>
        <div className="text-xl font-black text-[#1a1a2e] mb-2">
          {zh ? '焦虑急救包' : 'Anxiety First-Aid Kit'}
        </div>
        <div className="text-[12px] font-bold text-[#1a1a2e]/70 mb-4 leading-relaxed">
          {zh
            ? '8 道搞怪题目，测出你的"解压哲学路径"\n基于斯多葛·禅宗·CBT·社交支持四大流派'
            : '8 quirky questions to find your "philosophical relief path"\nBased on Stoicism · Zen · CBT · Social Support'}
        </div>
        <div className="flex justify-center gap-2 mb-4 text-2xl" aria-hidden="true">
          <span>🏛️</span><span>🧘</span><span>🧠</span><span>🤝</span>
        </div>
        <button
          onClick={handleStart}
          className="bg-gradient-to-b from-amber-400 to-orange-500 text-white font-black text-base px-6 py-3 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#1a1a2e] active:translate-y-[1px] active:shadow-[2px_2px_0_0_#1a1a2e] transition-all"
        >
          🚀 {zh ? '开始测试' : 'Start Quiz'}
        </button>
      </div>
    );
  }

  // ===== Quiz 页 =====
  if (phase === 'quiz') {
    const question = ANXIETY_QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / ANXIETY_QUESTIONS.length) * 100;
    return (
      <div className="space-y-4 animate-pop-in">
        {/* 进度条 */}
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-[#1a1a2e]">
              {zh ? '题目' : 'Question'} {currentQ + 1}/{ANXIETY_QUESTIONS.length}
            </span>
            <span className="text-[11px] font-black text-amber-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 题目 */}
        <div
          key={question.id}
          className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-4 animate-pop-in"
        >
          <div className="text-[14px] font-black text-[#1a1a2e] leading-relaxed mb-3">
            {pickLocalized(question.question, language)}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                className="text-left p-3 rounded-xl border-[2px] border-[#1a1a2e]/15 bg-amber-50/50 hover:bg-amber-100 hover:border-[#1a1a2e] hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <span className="text-2xl flex-shrink-0" aria-hidden="true">{opt.emoji}</span>
                <span className="text-[12px] font-bold text-[#1a1a2e] leading-snug">
                  {pickLocalized(opt.text, language)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== Result 页 =====
  if (phase === 'result' && result) {
    const { primary, secondary, scores } = result;
    return (
      <div className="space-y-4">
        {/* 主路径大卡片 */}
        <div
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 text-white animate-pop-in"
        >
          <div className="text-center mb-3">
            <div className="text-5xl mb-2 animate-float-gentle" aria-hidden="true">{primary.emoji}</div>
            <div className="text-[10px] font-black opacity-75 mb-1">
              {zh ? '你的解压哲学路径' : 'Your Relief Philosophy'}
            </div>
            <div className="text-xl font-black">
              {pickLocalized(primary.name, language)}
            </div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 mb-3">
            <div className="text-[11px] font-bold leading-relaxed opacity-95">
              {pickLocalized(primary.philosophy, language)}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[10px] font-black opacity-75 mb-1">
              {zh ? '🎓 哲学框架' : '🎓 Framework'}
            </div>
            <div className="text-[11px] font-bold leading-relaxed opacity-95">
              {pickLocalized(primary.framework, language)}
            </div>
          </div>
        </div>

        {/* 行动建议 */}
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-4 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-[12px] font-black text-[#1a1a2e] mb-3">
            🎯 {zh ? '具体行动建议' : 'Action Items'}
          </div>
          <div className="space-y-2">
            {primary.actions.map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border-[2px] border-[#1a1a2e]/10"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400 text-[#1a1a2e] text-[10px] font-black flex items-center justify-center border-[2px] border-[#1a1a2e]">
                  {i + 1}
                </span>
                <span className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed">
                  {pickLocalized(action, language)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 推荐书籍 */}
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-4 animate-pop-in" style={{ animationDelay: '0.15s' }}>
          <div className="text-[12px] font-black text-[#1a1a2e] mb-2">
            📖 {zh ? '推荐阅读' : 'Recommended Reading'}
          </div>
          <div className="bg-purple-50 rounded-xl p-3 border-[2px] border-[#1a1a2e]/10">
            <div className="text-[13px] font-black text-purple-700">
              《{pickLocalized(primary.book.title, language)}》
            </div>
            <div className="text-[10px] font-bold text-[#1a1a2e]/60 mt-0.5">
              — {pickLocalized(primary.book.author, language)}
            </div>
          </div>
        </div>

        {/* 次路径小卡片 */}
        <div className="bg-white/60 rounded-2xl border-[2px] border-dashed border-[#1a1a2e]/30 p-3 animate-pop-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-[10px] font-black text-[#1a1a2e]/60 mb-1">
            {zh ? '辅助路径' : 'Secondary Path'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{secondary.emoji}</span>
            <span className="text-[12px] font-black text-[#1a1a2e]">
              {pickLocalized(secondary.name, language)}
            </span>
          </div>
          <div className="text-[10px] font-bold text-[#1a1a2e]/60 mt-1 leading-relaxed">
            {pickLocalized(secondary.philosophy, language)}
          </div>
        </div>

        {/* 分数分布 */}
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-3 animate-pop-in" style={{ animationDelay: '0.25s' }}>
          <div className="text-[10px] font-black text-[#1a1a2e]/60 mb-2">
            {zh ? '四路径倾向分布' : 'Path Distribution'}
          </div>
          <div className="space-y-1.5">
            {(Object.keys(scores) as Array<keyof typeof scores>).map((k) => {
              const maxScore = Math.max(...Object.values(scores));
              const pct = maxScore > 0 ? (scores[k] / maxScore) * 100 : 0;
              const pathEmoji = { stoic: '🏛️', zen: '🧘', cognitive: '🧠', social: '🤝' }[k];
              const pathName = {
                stoic: zh ? '斯多葛' : 'Stoic',
                zen: zh ? '禅宗' : 'Zen',
                cognitive: zh ? '认知行为' : 'CBT',
                social: zh ? '社交支持' : 'Social',
              }[k];
              return (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-sm w-5">{pathEmoji}</span>
                  <span className="text-[10px] font-black text-[#1a1a2e]/60 w-12">{pathName}</span>
                  <div className="flex-1 h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${k === primary.type ? 'bg-amber-400' : 'bg-[#1a1a2e]/30'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#1a1a2e]/60 w-4 text-right">{scores[k]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <button
          onClick={handleRetry}
          className="w-full py-3 bg-gradient-to-b from-amber-400 to-orange-500 text-white font-black text-sm rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
        >
          🔄 {zh ? '重新测试' : 'Retry Quiz'}
        </button>
      </div>
    );
  }

  return null;
}
