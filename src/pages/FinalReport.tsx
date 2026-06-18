import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data/scenes';

export default function FinalReport() {
  const { getFinalReport, reset } = useGameStore();
  const [show, setShow] = useState(false);

  const report = getFinalReport();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  const levelConfig: Record<string, { emoji: string; gradient: string; bg: string }> = {
    '抗压之王': { emoji: '🔥', gradient: 'from-red-500 via-orange-500 to-red-600', bg: 'linear-gradient(135deg,#fecaca 0%, #f87171 60%, #ef4444 100%)' },
    '情商之神': { emoji: '👑', gradient: 'from-yellow-300 via-amber-400 to-orange-500', bg: 'linear-gradient(135deg,#fef9c3 0%, #fde047 60%, #eab308 100%)' },
    '情商达人': { emoji: '😎', gradient: 'from-teal-400 via-emerald-500 to-green-600', bg: 'linear-gradient(135deg,#ccfbf1 0%, #6ee7b7 60%, #10b981 100%)' },
    '及格选手': { emoji: '😅', gradient: 'from-yellow-400 via-amber-500 to-orange-500', bg: 'linear-gradient(135deg,#fef3c7 0%, #fcd34d 60%, #f59e0b 100%)' },
    '社交杀手': { emoji: '💀', gradient: 'from-gray-500 via-gray-600 to-gray-700', bg: 'linear-gradient(135deg,#e5e7eb 0%, #9ca3af 60%, #4b5563 100%)' },
  };

  const config = levelConfig[report.level.name] || levelConfig['及格选手'];

  const handleShare = () => {
    const text = `我在「我是高情商」挑战中获得 ${report.averageScore} 分，段位：${report.level.emoji} ${report.level.name}！你也来测测？`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('✨ 分享文案已复制！快去朋友圈装X～');
      });
    } else {
      alert(text);
    }
  };

  const sceneColor = (score: number) => {
    if (score === 100) return 'from-red-500 via-orange-500 to-red-600';
    if (score >= 90) return 'from-yellow-300 via-amber-400 to-orange-500';
    if (score >= 70) return 'from-teal-400 via-emerald-500 to-green-600';
    if (score >= 40) return 'from-yellow-400 via-amber-500 to-orange-500';
    return 'from-gray-500 via-gray-600 to-gray-700';
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4"
         style={{ background: config.bg }}>

      <div className="absolute inset-0 manga-stripes opacity-20 pointer-events-none" />
      <div className="absolute top-8 left-5 text-4xl opacity-60 animate-float-gentle">🎉</div>
      <div className="absolute top-20 right-8 text-3xl opacity-60 animate-float-gentle" style={{ animationDelay: '0.4s' }}>✨</div>
      <div className="absolute bottom-24 left-8 text-4xl opacity-60 animate-float-gentle" style={{ animationDelay: '0.8s' }}>💫</div>
      <div className="absolute bottom-16 right-6 text-3xl opacity-60 animate-float-gentle" style={{ animationDelay: '1.2s' }}>🎊</div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* 恭喜横幅 */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle">
            <span className="text-lg">🏆</span>
            <span className="font-black text-sm text-[#1a1a2e]">全部场景通关！</span>
          </div>
        </div>

        {/* 主卡片 */}
        <div className={`bg-white rounded-[32px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] p-6 md:p-8 mb-5 transition-all duration-700 relative overflow-hidden
                        ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          {/* 顶部装饰 */}
          <div className="text-center mb-6">
            <div className="text-7xl mb-3 animate-wiggle" style={{ filter: 'drop-shadow(3px 4px 0 rgba(26,26,46,0.25))' }}>
              {report.level.emoji}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a2e] leading-tight"
                style={{ WebkitTextStroke: '1px #1a1a2e', textShadow: '3px 3px 0 #fbbf24' }}>
              情商鉴定报告
            </h2>
            <p className="text-sm font-bold text-[#1a1a2e]/60 mt-2">🧠 社交场合综合表现评估</p>
          </div>

          {/* 综合分数徽章 */}
          <div className="text-center mb-6">
            <div className={`inline-block relative bg-gradient-to-br ${config.gradient} text-white
                            rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e]
                            px-8 md:px-12 py-6 md:py-8 animate-pop-in`}>
              <div className="text-sm md:text-base font-black opacity-90 mb-1">综合情商得分</div>
              <div className="text-7xl md:text-8xl leading-none font-black mb-2"
                   style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}>
                {report.averageScore}
              </div>
              <div className="text-sm md:text-base font-black opacity-90">
                总分 {report.totalScore} / {scenes.length * 100}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-3xl md:text-4xl font-black text-[#1a1a2e] leading-tight"
                   style={{ WebkitTextStroke: '1px #1a1a2e' }}>
                {report.level.name}
              </div>
              <div className="text-sm md:text-base font-bold text-[#1a1a2e]/70 mt-1">
                {report.level.description}
              </div>
            </div>
          </div>

          {/* 各场景得分 */}
          <div className="mb-6">
            <h4 className="text-center text-lg md:text-xl font-black text-[#1a1a2e] mb-4">
              📊 各场景表现
            </h4>
            <div className="space-y-3">
              {report.scenes.map((sr, i) => {
                const scene = scenes.find((s) => s.id === sr.sceneId);
                return (
                  <div
                    key={sr.sceneId}
                    className="relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-[3px] border-[#1a1a2e] p-3 md:p-4 shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2 gap-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-2xl md:text-3xl flex-shrink-0">{scene?.emoji}</span>
                        <span className="font-black text-[#1a1a2e] text-sm md:text-base truncate">
                          {scene?.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xl">{sr.level.emoji}</span>
                        <span className="text-2xl md:text-3xl font-black text-[#1a1a2e]">{sr.score}</span>
                        <span className="text-xs font-bold text-[#1a1a2e]/50">分</span>
                      </div>
                    </div>
                    {/* 进度条 */}
                    <div className="w-full bg-white rounded-full h-3 border-[2px] border-[#1a1a2e] overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${sceneColor(sr.score)} transition-all`}
                        style={{
                          width: show ? `${sr.score}%` : '0%',
                          transitionDuration: '1200ms',
                          transitionDelay: `${i * 150 + 300}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 激励文案 */}
          <div className="relative bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-2xl border-[3px] border-[#1a1a2e] p-5 text-center shadow-[3px_3px_0_0_#1a1a2e]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1">
              📣 最终评语
            </div>
            <p className="text-[#1a1a2e] text-base md:text-lg font-black leading-relaxed mt-1">
              {report.averageScore === 100
                ? '🔥 抗压之王！整顿职场，拒绝无效社交，老板听了都想跟你学！'
                : report.averageScore >= 90
                ? '🎉 太厉害了！你就是行走的社交天花板，没人能挡住你的嘴炮！'
                : report.averageScore >= 70
                ? '💪 很不错！情商已经高于大多数人，继续加油你就是神！'
                : report.averageScore >= 40
                ? '📚 还有进步空间，多跟长辈聊聊天就能提升段位～'
                : '🤝 别灰心！社死多了就是社牛，再来一次？'}
            </p>
          </div>
        </div>

        {/* 按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="squishy w-full py-4 md:py-5 bg-gradient-to-b from-emerald-400 to-green-600 text-white
                      font-black text-xl md:text-2xl rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] relative overflow-hidden"
          >
            <span className="relative z-10 inline-flex items-center gap-3 justify-center">
              <span className="text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>📤</span>
              分享我的段位 →
            </span>
            <span className="absolute top-2 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
          </button>

          <button
            onClick={reset}
            className="squishy w-full py-4 md:py-5 bg-white text-[#1a1a2e] font-black text-xl md:text-2xl
                      rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] relative overflow-hidden"
          >
            <span className="relative z-10 inline-flex items-center gap-3 justify-center">
              <span className="text-3xl">🔄</span>
              重新挑战
            </span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] text-xs font-black text-[#1a1a2e]">
            🧠 我是高情商 · 2025 · 拒绝无效社交从我做起
          </div>
        </div>
      </div>
    </div>
  );
}
