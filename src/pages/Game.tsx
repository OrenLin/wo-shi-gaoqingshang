import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Game() {
  const { getCurrentScene, submitAnswer, customInputs, setCustomInput, setPage } = useGameStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [showScene, setShowScene] = useState(false);

  const scene = getCurrentScene();

  useEffect(() => {
    const t = setTimeout(() => setShowScene(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setSelectedOption(null);
    setUseCustom(false);
  }, [scene?.id]);

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(180deg,#fef3c7 0%, #fbbf24 100%)' }}>
        <div className="text-6xl animate-bounce">🎴</div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (useCustom) {
      const text = customInputs[scene.id] || '';
      if (text.trim()) submitAnswer(scene.id, undefined, text);
    } else if (selectedOption) {
      submitAnswer(scene.id, selectedOption);
    }
  };

  const canSubmit = useCustom
    ? (customInputs[scene.id]?.trim().length || 0) > 0
    : !!selectedOption;

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ background: scene.bgColor }}>

      {/* 背景图：SVG本地资源 + 渐变遮罩 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${scene.bgImage})`,
          transform: 'scale(1.05)',
          opacity: 0.95,
        }}
      >
        {/* 渐变遮罩 - 保持可读性 */}
        <div className="absolute inset-0"
             style={{
               background: 'linear-gradient(180deg, rgba(26,26,46,0.25) 0%, rgba(26,26,46,0.55) 50%, rgba(26,26,46,0.85) 100%)',
             }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* 漫画速度线氛围（淡） */}
      <div className="absolute inset-0 manga-stripes opacity-10 pointer-events-none" />

      {/* 漂浮装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[8%] left-[6%] text-4xl opacity-40 animate-float-gentle">✨</div>
        <div className="absolute top-[18%] right-[8%] text-3xl opacity-30 animate-float-gentle" style={{ animationDelay: '0.5s' }}>💫</div>
        <div className="absolute bottom-[20%] left-[10%] text-5xl opacity-20 animate-float-gentle" style={{ animationDelay: '1s' }}>💭</div>
        <div className="absolute bottom-[12%] right-[6%] text-4xl opacity-25 animate-float-gentle" style={{ animationDelay: '1.5s' }}>🎯</div>
      </div>

      {/* 内容区 */}
      <div className="relative z-10 min-h-screen py-5 px-3 md:px-6">
        <div className="max-w-2xl mx-auto">

          {/* 顶部：返回 + 场景标签 */}
          <div className={`flex items-start justify-between mb-4 transition-all duration-700 ${showScene ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <button
              onClick={() => setPage('select')}
              className="squishy bg-white/95 text-[#1a1a2e] font-black text-sm rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] px-3 py-2"
            >
              ← 返回
            </button>
            <div className="text-center flex-1 mx-3">
              <div className="inline-flex items-center gap-2 bg-white/95 text-[#1a1a2e] rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] px-4 py-1.5">
                <span className="text-xl">{scene.emoji}</span>
                <span className="font-black text-sm md:text-base">{scene.title}</span>
              </div>
            </div>
            <div className="w-[70px]" aria-hidden="true" /> {/* 对称占位 */}
          </div>

          {/* ========== 人物信息 + 对话气泡 ========== */}
          <div
            className={`relative mb-5 transition-all duration-700 ease-out ${showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="relative bg-white rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 md:p-6 overflow-hidden">

              {/* 左上角色标签 */}
              <div className="absolute -top-3 -left-3 bg-yellow-300 text-[#1a1a2e] font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] rotate-[-10deg] animate-wiggle">
                💬 灵魂拷问
              </div>

              {/* 人物信息行 */}
              <div className="flex items-center gap-4 mb-4 mt-2">
                {/* 大头像贴纸 */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400
                               flex items-center justify-center text-4xl md:text-5xl
                               border-[4px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]
                               animate-wiggle"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {scene.characters[0].emoji}
                  </div>
                  {/* 说话指示器 */}
                  <div className="absolute -top-1 -right-1">
                    <div className="w-5 h-5 bg-green-400 rounded-full border-[3px] border-white animate-ping opacity-75" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[#1a1a2e] font-black text-lg md:text-xl leading-tight">
                    {scene.characters[0].name}
                  </div>
                  <div className="text-[#1a1a2e]/60 text-xs md:text-sm font-semibold mt-0.5">
                    {scene.characters[0].description}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 text-[11px] font-black rounded-full px-2.5 py-0.5 border-[2px] border-pink-300">
                    <span>🗣️</span>
                    正在对你说...
                  </div>
                </div>
              </div>

              {/* 对话内容气泡 */}
              <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-[3px] border-[#1a1a2e] rounded-3xl p-4 md:p-5">
                {/* 气泡尖角 */}
                <div className="absolute -top-2.5 left-8 w-5 h-5 bg-yellow-50 border-t-[3px] border-l-[3px] border-[#1a1a2e] rotate-45" />
                <p className="text-[#1a1a2e] text-base md:text-lg font-bold leading-relaxed">
                  「{scene.triggerDialog}」
                </p>
              </div>

              {/* 高光装饰 */}
              <span className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-yellow-300/70 rounded-full pointer-events-none" />
            </div>
          </div>

          {/* ========== 选项区 ========== */}
          <div
            className={`mb-5 transition-all duration-700 ease-out ${showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '320ms' }}
          >
            {/* 标题栏 + 自由发挥切换 */}
            <div className="flex items-center justify-between mb-4 px-1 gap-2">
              <h3 className="text-lg md:text-xl font-black text-white drop-shadow-md flex items-center gap-2"
                  style={{ textShadow: '2px 2px 0 rgba(26,26,46,0.6)' }}>
                <span className="text-2xl">💡</span>
                你会怎么回应？
              </h3>
              <button
                onClick={() => setUseCustom(!useCustom)}
                className="squishy flex-shrink-0 px-3 py-2 rounded-full text-xs md:text-sm font-black
                           border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]"
                style={{ background: useCustom ? '#fde68a' : 'rgba(255,255,255,0.95)', color: '#1a1a2e' }}
              >
                ✍️ {useCustom ? '返回选项' : '自由发挥'}
              </button>
            </div>

            {useCustom ? (
              /* ========== 自由发挥模式 ========== */
              <div className="relative bg-white rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] p-5 md:p-6">
                <div className="absolute -top-3 -right-3 bg-blue-400 text-white font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] rotate-[8deg]">
                  ✨ 自由发挥
                </div>

                <textarea
                  value={customInputs[scene.id] || ''}
                  onChange={(e) => setCustomInput(scene.id, e.target.value.slice(0, 200))}
                  placeholder="写下你最想说的话... 越搞笑 可能段位越高哦 👀"
                  className="w-full h-36 p-4 border-[3px] border-[#1a1a2e] rounded-2xl
                            bg-gradient-to-br from-yellow-50/70 to-white
                            text-[#1a1a2e] text-base md:text-lg font-bold leading-relaxed
                            placeholder:text-[#1a1a2e]/40 placeholder:font-semibold
                            focus:outline-none focus:ring-4 focus:ring-yellow-300
                            resize-none transition-all"
                />

                {/* 字数 + 鼓励 */}
                <div className="mt-3 flex items-center justify-between text-xs font-black">
                  <div className={`${
                    (customInputs[scene.id]?.length || 0) >= 100 ? 'text-orange-600' : 'text-[#1a1a2e]/70'
                  }`}>
                    ✏️ {(customInputs[scene.id] || '').length} / 200 字
                    {(customInputs[scene.id]?.length || 0) >= 30 && (
                      <span className="ml-2 text-green-600 animate-pulse">✓ 有内味儿了！</span>
                    )}
                  </div>
                  <div className="text-[#1a1a2e]/40 text-[11px]">💡 真诚是必杀技</div>
                </div>
              </div>
            ) : (
              /* ========== 选项列表 ========== */
              <div className="space-y-3">
                {scene.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`squishy w-full text-left p-4 md:p-5 rounded-[24px] transition-all duration-300
                                  relative overflow-hidden border-[3px] border-[#1a1a2e]
                                  ${isSelected
                                    ? 'bg-white shadow-[6px_6px_0_0_#1a1a2e] scale-[1.01] ring-4 ring-yellow-300'
                                    : 'bg-white/95 shadow-[4px_4px_0_0_#1a1a2e] hover:shadow-[6px_6px_0_0_#1a1a2e]'}`}
                      style={{
                        transitionDelay: `${index * 60}ms`,
                      }}
                    >
                      {/* 选中后 - 等级揭晓彩带 */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400" />
                      )}

                      <div className="flex items-start gap-3 md:gap-4 relative">
                        {/* 序号 */}
                        <div className={`flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center font-black text-base md:text-lg
                                      border-[3px] border-[#1a1a2e] transition-all
                                      ${isSelected
                                        ? 'bg-gradient-to-br from-pink-400 to-orange-400 text-white scale-110'
                                        : 'bg-gradient-to-br from-yellow-200 to-yellow-300 text-[#1a1a2e]'}`}>
                          {index + 1}
                        </div>

                        {/* 选项内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[#1a1a2e] text-base md:text-lg font-bold leading-relaxed">
                            {option.content}
                          </div>

                          {/* 选中后的等级揭晓（盲选机制） */}
                          {isSelected && (
                            <LevelReveal level={option.level} />
                          )}
                        </div>

                        {/* 右侧指示器 */}
                        <div className="flex-shrink-0 mt-1.5">
                          {isSelected ? (
                            <div className="w-6 h-6 flex items-center justify-center text-green-500 text-3xl font-black animate-pop-in">
                              ✓
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-[3px] border-[#1a1a2e]/40 bg-white flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-[#1a1a2e]/15" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========== 提交按钮 ========== */}
          <div
            className={`transition-all duration-700 ease-out ${showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`squishy relative w-full py-4 md:py-5 rounded-[28px] text-xl md:text-2xl font-black
                         border-[4px] border-[#1a1a2e] overflow-hidden
                         ${canSubmit
                           ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[6px_6px_0_0_#1a1a2e]'
                           : 'bg-gradient-to-b from-gray-200 to-gray-300 text-gray-500 shadow-[4px_4px_0_0_#1a1a2e] cursor-not-allowed'}`}
            >
              <span className="relative z-10 inline-flex items-center gap-2 justify-center">
                {canSubmit ? (
                  <>
                    <span className="text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎯</span>
                    揭晓我的情商段位！
                  </>
                ) : (
                  <>
                    <span className="text-2xl">👆</span>
                    {useCustom ? '写点什么再说...' : '先选一个回应'}
                  </>
                )}
              </span>
              {canSubmit && (
                <span className="absolute top-2 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
              )}
            </button>

            <p className="mt-3 text-center text-xs font-bold text-white/80" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
              💫 选完就能看到你的段位啦！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 等级揭晓小组件 ---------- */
function LevelReveal({ level }: { level: string }) {
  const levelMap: Record<string, { emoji: string; label: string; gradient: string; desc: string }> = {
    anti:   { emoji: '🔥', label: '抗压之王',   gradient: 'from-red-500 via-orange-500 to-red-600',     desc: '绝了！直接掀桌反杀！' },
    low:    { emoji: '💀', label: '低情商',     gradient: 'from-gray-500 via-gray-600 to-gray-700',     desc: '兄弟...你还好吗？' },
    medium: { emoji: '😅', label: '中情商',     gradient: 'from-yellow-400 via-amber-500 to-orange-500', desc: '平平淡淡，勉强过关。' },
    high:   { emoji: '😎', label: '高情商',     gradient: 'from-teal-400 via-emerald-500 to-green-600',  desc: '稳！这波操作很丝滑～' },
    god:    { emoji: '👑', label: '情商之神',   gradient: 'from-yellow-300 via-amber-400 to-orange-500', desc: '大佬请收下我的膝盖！' },
  };

  const info = levelMap[level] || levelMap.medium;

  return (
    <div className="mt-3 inline-flex flex-wrap items-center gap-2 animate-pop-in">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r ${info.gradient} text-white font-black shadow-[3px_3px_0_0_#1a1a2e] border-[3px] border-[#1a1a2e]`}>
        <span className="text-2xl animate-bounce">{info.emoji}</span>
        <span>{info.label}</span>
      </div>
      <span className="text-xs md:text-sm font-bold text-[#1a1a2e]/70 bg-yellow-100 px-2.5 py-1 rounded-full border-[2px] border-[#1a1a2e]/30">
        {info.desc}
      </span>
    </div>
  );
}
