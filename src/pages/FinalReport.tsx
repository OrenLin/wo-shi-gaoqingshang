import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { scenes } from '../data';
import { levelGradient } from '../data/levels';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import AntiKingEffect from '../components/ui/AntiKingEffect';

export default function FinalReport() {
  const { getFinalReport, reset } = useGameStore();
  const [show, setShow] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const report = getFinalReport();

  const isAntiKing = report.level.name === '抗压之王';
  const gradient = isAntiKing ? 'anti' :
    report.level.name === '情商之神' ? 'god' :
    report.level.name === '情商达人' ? 'high' :
    report.level.name === '及格选手' ? 'medium' : 'low';

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleShare = () => {
    const text = `我在「我是高情商」挑战中获得 ${report.averageScore} 分，段位：${report.level.emoji} ${report.level.name}！${report.level.socialCopy}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => alert('✨ 分享文案已复制！快去朋友圈装X～'),
        () => alert(text),
      );
    } else {
      alert(text);
    }
  };

  return (
    <>
      {showEffect && <AntiKingEffect onComplete={() => setShowEffect(false)} />}

      <div className="min-h-screen relative overflow-hidden py-8 px-4"
           style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)' }}>
        <div className="absolute inset-0 manga-stripes opacity-25 pointer-events-none" />
        <FloatingEmojis
          items={[
            { emoji: '🎉', top: '8%', left: '5%', delay: '0s' },
            { emoji: '✨', top: '14%', right: '8%', delay: '0.4s', size: '2.2rem' },
            { emoji: '💫', bottom: '18%', left: '8%', delay: '0.8s' },
            { emoji: '🎊', bottom: '12%', right: '5%', delay: '1.2s' },
          ]}
        />

        <div className="relative z-10 max-w-2xl mx-auto">

          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle">
              <span className="font-black text-sm text-[#1a1a2e]">🏆 全部场景通关！</span>
            </span>
          </div>

          <div className={`bg-white rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e]
                          p-6 md:p-8 mb-5 transition-all duration-500 relative overflow-hidden
                          ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>

            {/* 主视觉 */}
            <div className="text-center mb-5">
              <div className="text-7xl mb-3 animate-wiggle"
                   style={{ filter: 'drop-shadow(3px 4px 0 rgba(26,26,46,0.25))' }}>
                {report.level.emoji}
              </div>
              {/* 人设标签 */}
              <div className="inline-block bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs rounded-full px-4 py-1.5 mb-3 shadow-[3px_3px_0_0_#1a1a2e]">
                {report.level.tag}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1a1a2e] leading-tight"
                  style={{ WebkitTextStroke: '1px #1a1a2e', textShadow: '3px 3px 0 #fbbf24' }}>
                {report.level.name}
              </h2>
              <p className="text-base md:text-lg font-black text-[#1a1a2e]/70 mt-1">{report.level.slogan}</p>
            </div>

            {/* 综合分徽章 */}
            <div className="text-center mb-5">
              <div className={`inline-block relative bg-gradient-to-br ${levelGradient[gradient]} text-white
                              rounded-[24px] border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e]
                              px-8 py-6 md:px-12 md:py-8 animate-pop-in`}>
                <div className="text-xs md:text-sm font-black opacity-90 mb-1">综合情商得分</div>
                <div className="text-7xl md:text-8xl font-black leading-none mb-2"
                     style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.25)' }}>
                  {report.averageScore}
                </div>
                <div className="text-xs md:text-sm font-black opacity-90">总分 {report.totalScore} / {scenes.length * 100}</div>
              </div>
            </div>

            {/* 各场景得分 */}
            <div className="mb-5">
              <h4 className="text-center text-lg font-black text-[#1a1a2e] mb-4">📊 各场景表现</h4>
              <div className="space-y-3">
                {report.scenes.map((sr, i) => {
                  const s = scenes.find((x) => x.id === sr.sceneId);
                  return (
                    <div key={sr.sceneId}
                         className="relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-[3px] border-[#1a1a2e] p-3 md:p-4 shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in"
                         style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex items-center justify-between mb-2 gap-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-2xl flex-shrink-0">{s?.emoji}</span>
                          <span className="font-black text-[#1a1a2e] text-sm md:text-base truncate">{s?.title}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xl">{sr.level.emoji}</span>
                          <span className="text-2xl md:text-3xl font-black text-[#1a1a2e]">{sr.averageScore}</span>
                          <span className="text-xs font-bold text-[#1a1a2e]/50">分</span>
                        </div>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 border-[2px] border-[#1a1a2e]/60 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 transition-all duration-[1200ms]"
                             style={{ width: show ? `${sr.averageScore}%` : '0%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 四段式段位详解 */}
            <div className="space-y-3 mb-5">
              {/* 情商内核 */}
              <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e]">
                <div className="absolute -top-3 left-4 bg-yellow-400 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                  🧠 情商内核
                </div>
                <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed mt-2">{report.level.descModule.core}</p>
              </div>

              {/* 历史对标 */}
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e]">
                <div className="absolute -top-3 left-4 bg-purple-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                  📜 历史对标
                </div>
                <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed mt-2">{report.level.descModule.history}</p>
              </div>

              {/* 社交画像 */}
              <div className="relative bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-[3px] border-[#1a1a2e] p-4 shadow-[3px_3px_0_0_#1a1a2e]">
                <div className="absolute -top-3 left-4 bg-sky-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
                  🎯 社交画像
                </div>
                <p className="text-[#1a1a2e] text-sm font-bold leading-relaxed mt-2">{report.level.descModule.comment}</p>
              </div>
            </div>

            {/* 朋友圈分享文案 */}
            <div className="relative bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-2xl border-[3px] border-[#1a1a2e] p-5 text-center shadow-[3px_3px_0_0_#1a1a2e]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1">
                📣 分享文案
              </div>
              <p className="text-[#1a1a2e] text-sm md:text-base font-black leading-relaxed mt-1">
                {report.level.socialCopy}
              </p>
            </div>

            {/* 抗压之王特效入口 */}
            {isAntiKing && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-sm px-5 py-2.5 rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-bounce cursor-pointer"
                     onClick={() => setShowEffect(true)}>
                  ⚡ 点击观看「抗压之王」名场面特效 →
                </div>
              </div>
            )}
          </div>

          {/* 按钮区 */}
          <div className="space-y-3">
            <MangaButton variant="primary" onClick={handleShare} className="w-full !py-5 !text-xl">
              <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>📤</span>
              分享我的段位 →
            </MangaButton>
            <MangaButton variant="secondary" onClick={reset} className="w-full !py-5 !text-xl">
              🔄 重新挑战
            </MangaButton>
          </div>

          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/80 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e] text-xs font-black text-[#1a1a2e]">
              🧠 我是高情商 · 2025 · 拒绝无效社交从我做起
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
