import { useState } from 'react';
import { useI18n } from '../i18n';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';
import PhilosophyInsight from '../components/tools/PhilosophyInsight';
import AnxietyQuiz from '../components/profile/AnxietyQuiz';
import WoodfishZen from '../components/profile/WoodfishZen';
import DebateSkills from '../components/tools/DebateSkills';
import Divination from '../components/tools/Divination';
import PageHeader from '../components/ui/PageHeader';

type ToolKey = 'divination' | 'philosophy' | 'anxiety' | 'woodfish' | 'debate';

export default function Tools() {
  const language = useI18n((s) => s.language);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);

  const handleBack = () => {
    audioManager.userTapped();
    audioManager.play('click');
    if (activeTool) {
      setActiveTool(null);
    } else {
      setPage('home');
    }
  };

  // 抽签工具全屏沉浸式渲染，不走 ToolWrapper
  // 传入 onBack 回调，由 Tools 控制 activeTool 状态（修复返回按钮无效）
  if (activeTool === 'divination') return <Divination onBack={handleBack} />;

  // 渲染具体工具页面
  if (activeTool === 'philosophy') return <ToolWrapper title={zh ? '🧠 哲学思辨' : '🧠 Philosophy'} backLabel={zh ? '工具箱' : 'Tools'} onBack={handleBack}><PhilosophyInsight /></ToolWrapper>;
  if (activeTool === 'anxiety') return <ToolWrapper title={zh ? '🧘 焦虑急救' : '🧘 Anxiety First-Aid'} backLabel={zh ? '工具箱' : 'Tools'} onBack={handleBack}><AnxietyQuiz /></ToolWrapper>;
  if (activeTool === 'woodfish') return <ToolWrapper title={zh ? '🪘 敲木鱼' : '🪘 Woodfish Zen'} backLabel={zh ? '工具箱' : 'Tools'} onBack={handleBack}><WoodfishZen /></ToolWrapper>;
  if (activeTool === 'debate') return <ToolWrapper title={zh ? '🎯 辩论技巧' : '🎯 Debate Skills'} backLabel={zh ? '工具箱' : 'Tools'} onBack={handleBack}><DebateSkills /></ToolWrapper>;

  // ===== 工具列表页 =====
  // 特色工具（抽签）— 全宽卡片
  const featuredTool = {
    emoji: '🎋',
    title: zh ? '禅意抽签' : 'Zen Divination',
    subtitle: zh ? '12 支签 · 古人智慧照见当下心境' : '12 lots · Ancient wisdom for modern minds',
    gradient: 'from-[#5a8d5e] via-[#4a7c4e] to-[#3d6b41]',
    pattern: 'bamboo',
  };

  // 常规工具
  const tools: { key: ToolKey; emoji: string; title: string; subtitle: string; gradient: string; icon: string }[] = [
    {
      key: 'philosophy',
      emoji: '🧠',
      title: zh ? '哲学思辨' : 'Philosophy',
      subtitle: zh ? '5 位哲学家的智慧' : 'Wisdom from 5 philosophers',
      gradient: 'from-violet-400 to-purple-600',
      icon: 'book',
    },
    {
      key: 'anxiety',
      emoji: '🧘',
      title: zh ? '焦虑急救' : 'Anxiety First-Aid',
      subtitle: zh ? '搞怪问卷 + 4 路径解药' : 'Quirky quiz + 4 relief paths',
      gradient: 'from-sky-400 to-blue-600',
      icon: 'wave',
    },
    {
      key: 'woodfish',
      emoji: '🪘',
      title: zh ? '敲木鱼' : 'Woodfish Zen',
      subtitle: zh ? '禅修解压，积功德' : 'Zen tapping, accumulate merit',
      gradient: 'from-amber-400 to-orange-600',
      icon: 'circle',
    },
    {
      key: 'debate',
      emoji: '🎯',
      title: zh ? '辩论技巧' : 'Debate Skills',
      subtitle: zh ? '8 个专业技巧' : '8 pro techniques',
      gradient: 'from-emerald-400 to-teal-600',
      icon: 'speech',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* 统一主标题 */}
        <PageHeader
          emoji="🧰"
          title={zh ? '工具箱' : 'Toolkit'}
          subtitle={zh ? '✨ 现代人应对压力的智慧工具集' : '✨ Wisdom tools for modern stress'}
          onBack={handleBack}
          backLabel={zh ? '首页' : 'Home'}
        />

        {/* ===== 特色工具：抽签（全宽卡片） ===== */}
        <button
          onClick={() => {
            audioManager.userTapped();
            audioManager.play('click');
            setActiveTool('divination');
          }}
          className={`relative w-full overflow-hidden bg-gradient-to-br ${featuredTool.gradient} rounded-2xl border-[3px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e] p-5 text-left text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#1a1a2e] active:translate-y-0 active:shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in mb-3`}
          aria-label={featuredTool.title}
        >
          {/* NEW 徽章 */}
          <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black border-[2px] border-[#1a1a2e] shadow-[1px_1px_0_0_#1a1a2e] animate-bounce" style={{ animationDuration: '2s' }}>
            NEW
          </div>

          {/* 装饰元素：竹叶 */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-15 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse cx="70" cy="20" rx="25" ry="5" fill="white" transform="rotate(-30 70 20)" />
              <ellipse cx="50" cy="15" rx="22" ry="4" fill="white" transform="rotate(-20 50 15)" />
              <ellipse cx="80" cy="40" rx="20" ry="4" fill="white" transform="rotate(-40 80 40)" />
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" aria-hidden="true" />

          {/* 内容 */}
          <div className="relative flex items-center gap-4">
            {/* 竹筒 mini 插画 */}
            <div className="flex-shrink-0 w-16 h-20 flex items-end justify-center">
              <svg width="48" height="64" viewBox="0 0 48 64">
                {/* 签条 */}
                <rect x="20" y="8" width="5" height="30" rx="1.5" fill="#dcc090" />
                <rect x="14" y="12" width="4" height="26" rx="1" fill="#c9a878" transform="rotate(-8 16 25)" opacity="0.7" />
                <rect x="28" y="14" width="4" height="24" rx="1" fill="#c9a878" transform="rotate(8 30 26)" opacity="0.6" />
                {/* 筒口 */}
                <ellipse cx="24" cy="38" rx="14" ry="3" fill="#0a0a0a" />
                {/* 筒身 */}
                <path d="M 10 38 L 10 64 L 38 64 L 38 38 Z" fill="#5a8d5e" />
                <rect x="10" y="48" width="28" height="1.5" fill="#2d5b31" opacity="0.6" />
                <rect x="8" y="52" width="32" height="6" fill="#8b7355" />
                <rect x="10" y="60" width="28" height="1.5" fill="#2d5b31" opacity="0.6" />
                {/* 高光 */}
                <rect x="10" y="38" width="3" height="26" fill="rgba(255,255,255,0.15)" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xl font-black mb-1 leading-tight">{featuredTool.title}</div>
              <div className="text-[11px] font-bold opacity-90 leading-snug">{featuredTool.subtitle}</div>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black">
                <span aria-hidden="true">→</span>
                {zh ? '进入禅意空间' : 'Enter zen space'}
              </div>
            </div>
          </div>
        </button>

        {/* ===== 常规工具 2×2 网格 ===== */}
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool, idx) => (
            <button
              key={tool.key}
              onClick={() => {
                audioManager.userTapped();
                audioManager.play('click');
                setActiveTool(tool.key);
              }}
              className={`relative overflow-hidden bg-gradient-to-br ${tool.gradient} rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-4 text-left text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#1a1a2e] active:translate-y-0 active:shadow-[2px_2px_0_0_#1a1a2e] animate-pop-in`}
              style={{ animationDelay: `${(idx + 1) * 0.08}s` }}
              aria-label={tool.title}
            >
              {/* 独特装饰元素（根据工具类型） */}
              <ToolDecoration icon={tool.icon} />

              <div className="relative">
                <div className="text-3xl mb-2" aria-hidden="true">{tool.emoji}</div>
                <div className="text-sm font-black mb-0.5 leading-tight">{tool.title}</div>
                <div className="text-[10px] font-bold opacity-90 leading-snug">{tool.subtitle}</div>
              </div>
            </button>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/60 rounded-full px-3 py-1.5 text-[10px] font-bold text-[#1a1a2e]/50">
            <span aria-hidden="true">💡</span>
            {zh ? '所有数据存储在本地浏览器，不上传服务器' : 'All data stored locally, never uploaded'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 工具卡片装饰元素（每个工具独特的视觉符号）
// ============================================================
function ToolDecoration({ icon }: { icon: string }) {
  if (icon === 'book') {
    // 哲学：飘散的书页
    return (
      <div className="absolute top-2 right-2 opacity-20" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="white">
          <rect x="4" y="6" width="14" height="10" rx="1" fill="none" stroke="white" strokeWidth="1.5" />
          <line x1="7" y1="9" x2="15" y2="9" stroke="white" strokeWidth="1" />
          <line x1="7" y1="12" x2="13" y2="12" stroke="white" strokeWidth="1" />
          <circle cx="22" cy="8" r="2" fill="white" opacity="0.5" />
          <circle cx="24" cy="16" r="1.5" fill="white" opacity="0.4" />
        </svg>
      </div>
    );
  }
  if (icon === 'wave') {
    // 焦虑急救：波浪线
    return (
      <div className="absolute top-2 right-2 opacity-20" aria-hidden="true">
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M 2 10 Q 7 4, 12 10 T 22 10" />
          <path d="M 2 16 Q 7 12, 12 16 T 22 16" opacity="0.5" />
        </svg>
      </div>
    );
  }
  if (icon === 'circle') {
    // 木鱼：同心圆波纹
    return (
      <div className="absolute top-2 right-2 opacity-20" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="white" strokeWidth="1.5">
          <circle cx="14" cy="14" r="4" fill="white" opacity="0.3" />
          <circle cx="14" cy="14" r="8" />
          <circle cx="14" cy="14" r="12" opacity="0.5" />
        </svg>
      </div>
    );
  }
  if (icon === 'speech') {
    // 辩论：对话气泡
    return (
      <div className="absolute top-2 right-2 opacity-20" aria-hidden="true">
        <svg width="28" height="24" viewBox="0 0 28 24" fill="white">
          <path d="M 4 4 L 18 4 Q 22 4, 22 8 L 22 14 Q 22 18, 18 18 L 12 18 L 8 22 L 9 18 L 4 18 Q 0 18, 0 14 L 0 8 Q 0 4, 4 4 Z" opacity="0.6" />
          <circle cx="24" cy="6" r="3" opacity="0.4" />
        </svg>
      </div>
    );
  }
  return null;
}

// 工具页面包装器（带粘性返回按钮，始终可见）
function ToolWrapper({ title, backLabel, onBack, children }: { title: string; backLabel: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* 粘性顶栏 — 返回按钮始终可见 */}
      <div
        className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b-[3px] border-[#1a1a2e] shadow-[0_2px_0_0_#fbbf24]"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            aria-label={backLabel}
            className="inline-flex items-center gap-1.5 bg-amber-300 border-[3px] border-[#1a1a2e] rounded-full px-4 py-2 shadow-[2px_2px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-all active:translate-y-[2px] active:shadow-[0_0_0_0_#1a1a2e] hover:bg-amber-400"
          >
            <span aria-hidden="true" className="text-base leading-none">←</span>
            <span className="text-xs">{backLabel}</span>
          </button>
          <h1 className="text-base font-black text-[#1a1a2e] truncate ml-3">{title}</h1>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-md mx-auto px-4 py-5 pb-24">
        <div key={title} className="animate-slide-in-right">
          {children}
        </div>
      </div>
    </div>
  );
}
