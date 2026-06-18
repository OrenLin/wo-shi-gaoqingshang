import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import { track } from '@vercel/analytics/react';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';

export default function Home() {
  const { setPage, setCodename } = useGameStore();
  const [codename, setCodenameInput] = useState('');

  const handleStart = () => {
    const trimmed = codename.trim();
    const name = trimmed.length > 0 ? trimmed.slice(0, 20) : '匿名高手';
    audioManager.ensureReady();      // 同步初始化 AudioContext（iOS 关键）
    audioManager.startBGM();          // 启动背景音乐（持续播放）
    setCodename(name);
    // 📊 Vercel Analytics 追踪事件（可在项目面板查看）
    track('game_started', {
      codename: name,
      timestamp: new Date().toISOString(),
    });
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

      {/* 顶部小标识 */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
          <span className="font-black text-sm text-[#1a1a2e]">🧠 情商测验 · 2026</span>
        </div>
      </div>

      {/* 主标题 */}
      <div className="relative z-10 text-center">
        <div className="relative inline-block">
          <div className="absolute -top-5 -left-6 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-spin-slow -z-10" />
          <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-sky-400 rounded-full opacity-60 animate-spin-slow -z-10"
               style={{ animationDirection: 'reverse' }} />

          <div className="text-5xl md:text-6xl font-black text-[#1a1a2e] leading-none animate-wiggle"
               style={{ textShadow: '4px 4px 0 #fbbf24, 8px 8px 0 rgba(26,26,46,0.2)', WebkitTextStroke: '2px #1a1a2e' }}>
            我是
          </div>
          <div className="mt-1 text-6xl md:text-7xl font-black leading-none animate-wiggle"
               style={{
                 background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #facc15 100%)',
                 WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                 WebkitTextStroke: '3px #1a1a2e', textShadow: '6px 6px 0 rgba(26,26,46,0.15)',
                 animationDelay: '0.2s',
               }}>
            高情商
          </div>

          <div className="absolute -top-3 -right-6 md:-right-12 bg-red-500 text-white font-black text-xs md:text-sm rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle rotate-[12deg]"
               style={{ animationDelay: '0.5s' }}>
            🔥 火爆全网
          </div>
        </div>

        {/* 副标题 */}
        <div className="mt-6 inline-block relative">
          <div className="relative bg-white border-[3px] border-[#1a1a2e] rounded-2xl px-5 py-3 shadow-[5px_5px_0_0_#1a1a2e]">
            <p className="text-sm md:text-base font-black text-[#1a1a2e]">
              测测你的社死等级 <span className="text-pink-500">·</span> 整顿职场 <span className="text-pink-500">·</span> 拒绝内耗
            </p>
          </div>
        </div>
      </div>

      {/* 代号输入 + 开始按钮 */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 mb-4 relative">
          <div className="absolute -top-3 left-4 bg-pink-500 text-white font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
            👤 给自己起个代号
          </div>
          <input
            type="text"
            value={codename}
            onChange={(e) => setCodenameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleStart(); }}
            placeholder="例：整顿职场哥 / 高情商大师 / 匿名高手"
            maxLength={20}
            className="w-full text-xl md:text-2xl font-black text-[#1a1a2e] placeholder:text-[#1a1a2e]/30
                       bg-yellow-50 border-[3px] border-[#1a1a2e] rounded-2xl px-4 py-3 mt-2
                       outline-none focus:bg-yellow-100 transition-colors text-center"
          />
          <div className="mt-2 text-right text-xs font-bold text-[#1a1a2e]/50">
            {codename.length}/20 字符
          </div>
        </div>

        <MangaButton
          variant="primary"
          onClick={handleStart}
          className="w-full !py-5 !text-xl"
        >
          <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
          {codename.trim().length > 0 ? '带着代号开始挑战 →' : '开始挑战（匿名高手）'}
        </MangaButton>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border-[2px] border-[#1a1a2e] rounded-full px-4 py-1.5 text-xs font-black text-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
            ⭐ 多个场景 · 每场景多道题 · 测测你的段位
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-bold text-[#1a1a2e]/60">
          👇 看看你是 情商之神 还是 社交杀手
        </p>
      </div>
    </div>
  );
}
