import { useState, useEffect, useRef, useCallback } from 'react';
import { audioManager } from '../../utils/audioManager';
import { useI18n } from '../../i18n';

const STORAGE_KEY_MERIT = 'eq_merit';
const STORAGE_KEY_DATE = 'eq_merit_date';

// 禅语库（中英文）
const ZEN_PHRASES: { zh: string; en: string }[] = [
  { zh: '放下即是', en: 'Let go, and it is done' },
  { zh: '本来无一物', en: 'Originally, there is nothing' },
  { zh: '心静自然凉', en: 'A calm heart keeps you cool' },
  { zh: '随缘不变，不变随缘', en: 'Flow with conditions, stay rooted within' },
  { zh: '一花一世界', en: 'In one flower, a whole world' },
  { zh: '行到水穷处，坐看云起时', en: 'When the path ends, sit and watch clouds rise' },
  { zh: '不忘初心', en: 'Never forget the beginner\'s mind' },
  { zh: '境随心转', en: 'The world shifts with your mind' },
  { zh: '万物静观皆自得', en: 'Observe all things quietly, and find joy' },
  { zh: '心安即是归处', en: 'Where the heart is at peace, there is home' },
];

// 功德里程碑
const MERIT_MILESTONES: { threshold: number; emoji: string; titleZh: string; titleEn: string }[] = [
  { threshold: 100, emoji: '🧘', titleZh: '初心者', titleEn: 'Beginner' },
  { threshold: 500, emoji: '🙏', titleZh: '虔诚者', titleEn: 'Devout' },
  { threshold: 1000, emoji: '✨', titleZh: '禅师', titleEn: 'Zen Master' },
  { threshold: 5000, emoji: '🏮', titleZh: '活佛', titleEn: 'Living Buddha' },
];

interface FloatingNum {
  id: number;
  x: number;
  y: number;
  value: string;
}

function loadMerit(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY_MERIT) || '0', 10) || 0;
  } catch { return 0; }
}

function saveMerit(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY_MERIT, String(n));
    localStorage.setItem(STORAGE_KEY_DATE, new Date().toDateString());
  } catch { /* ignore */ }
}

export default function WoodfishZen() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';
  const [merit, setMerit] = useState(loadMerit());
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [floatingNums, setFloatingNums] = useState<FloatingNum[]>([]);
  const [zenPhrase, setZenPhrase] = useState<{ zh: string; en: string } | null>(null);
  const [showPhrase, setShowPhrase] = useState(false);
  const [woodfishScale, setWoodfishScale] = useState(1);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phraseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatIdRef = useRef(0);
  const clickCountRef = useRef(0);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      if (phraseTimerRef.current) clearTimeout(phraseTimerRef.current);
    };
  }, []);

  // 获取当前称号
  const getCurrentTitle = useCallback((m: number) => {
    let current = null;
    for (const ms of MERIT_MILESTONES) {
      if (m >= ms.threshold) current = ms;
    }
    return current;
  }, []);

  // 获取下一个里程碑
  const getNextMilestone = useCallback((m: number) => {
    return MERIT_MILESTONES.find((ms) => m < ms.threshold);
  }, []);

  const currentTitle = getCurrentTitle(merit);
  const nextMilestone = getNextMilestone(merit);

  const handleTap = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // 获取点击位置
    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // 播放木鱼音效
    audioManager.userTapped();
    audioManager.play('woodfish');

    // 功德 +1
    const newMerit = merit + 1;
    setMerit(newMerit);
    saveMerit(newMerit);

    // 连击逻辑
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    // 重置连击定时器（1 秒不点击则连击重置）
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setCombo(0), 1000);

    // 浮动 +1 数字
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const newFloat: FloatingNum = {
      id: floatIdRef.current++,
      x,
      y,
      value: newCombo >= 10 ? '+10 ✨' : newCombo >= 5 ? `+${newCombo} 🔥` : '+1',
    };
    setFloatingNums((prev) => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingNums((prev) => prev.filter((f) => f.id !== newFloat.id));
    }, 1200);

    // 木鱼缩放动画
    setWoodfishScale(0.92);
    setTimeout(() => setWoodfishScale(1), 100);

    // 每 10 次点击浮现禅语
    clickCountRef.current += 1;
    if (clickCountRef.current % 10 === 0) {
      const phrase = ZEN_PHRASES[Math.floor(Math.random() * ZEN_PHRASES.length)];
      setZenPhrase(phrase);
      setShowPhrase(true);
      if (phraseTimerRef.current) clearTimeout(phraseTimerRef.current);
      phraseTimerRef.current = setTimeout(() => setShowPhrase(false), 3000);
    }
  }, [merit, combo, maxCombo]);

  const handleReset = () => {
    if (!confirm(zh ? '确定要重置功德吗？所有积累将清空。' : 'Reset all merit? All accumulation will be cleared.')) return;
    audioManager.userTapped();
    audioManager.play('click');
    setMerit(0);
    setCombo(0);
    setMaxCombo(0);
    saveMerit(0);
  };

  return (
    <div className="space-y-4">
      {/* 功德计数器 */}
      <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 text-center animate-pop-in">
        <div className="text-[10px] font-black text-[#1a1a2e]/60 mb-1">
          {zh ? '🪷 累计功德' : '🪷 Total Merit'}
        </div>
        <div className="text-4xl font-black text-[#1a1a2e] mb-2" style={{ textShadow: '3px 3px 0 #fbbf24' }}>
          {merit}
        </div>
        {/* 当前称号 */}
        {currentTitle ? (
          <div className="inline-flex items-center gap-1 bg-amber-300 text-[#1a1a2e] text-[11px] font-black px-3 py-1 rounded-full border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
            {currentTitle.emoji} {zh ? currentTitle.titleZh : currentTitle.titleEn}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 bg-white/60 text-[#1a1a2e]/60 text-[11px] font-black px-3 py-1 rounded-full border-[2px] border-dashed border-[#1a1a2e]/30">
            {zh ? '🚶 尚未入门' : '🚶 Not Started'}
          </div>
        )}
        {/* 下一里程碑进度 */}
        {nextMilestone && (
          <div className="mt-3">
            <div className="text-[10px] font-bold text-[#1a1a2e]/50 mb-1">
              {zh ? `距 "${nextMilestone.titleZh}" 还差 ${nextMilestone.threshold - merit}` : `${nextMilestone.threshold - merit} to "${nextMilestone.titleEn}"`}
            </div>
            <div className="h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (merit / nextMilestone.threshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 连击显示 */}
      {combo >= 2 && (
        <div className="fixed top-20 right-4 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm px-3 py-2 rounded-full border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-pop-in">
          {combo >= 10 ? `✨ ${zh ? '功德无量' : 'Boundless Merit'} x${combo}` : combo >= 5 ? `🔥 ${zh ? '连击' : 'Combo'} x${combo}` : `${zh ? '连击' : 'Combo'} x${combo}`}
        </div>
      )}

      {/* 木鱼主区域 */}
      <div className="relative bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-6 overflow-hidden animate-pop-in" style={{ animationDelay: '0.1s' }}>
        {/* 背景莲花 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10" aria-hidden="true">
          <LotusSVG className="animate-spin-slow" />
        </div>

        {/* 禅语浮现 */}
        {showPhrase && zenPhrase && (
          <div className="absolute top-2 left-0 right-0 text-center z-10 animate-pop-in pointer-events-none">
            <div className="inline-block bg-white/90 backdrop-blur-sm text-[#1a1a2e] text-[13px] font-black px-4 py-2 rounded-full border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e]">
              {zh ? zenPhrase.zh : zenPhrase.en}
            </div>
          </div>
        )}

        {/* 木鱼按钮 */}
        <div className="relative flex items-center justify-center py-8">
          <button
            onClick={handleTap}
            onTouchStart={handleTap}
            aria-label={zh ? '敲木鱼，积功德' : 'Tap woodfish, accumulate merit'}
            className="relative transition-transform duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 rounded-full"
            style={{
              transform: `scale(${woodfishScale})`,
            }}
          >
            <WoodfishSVG />
            {/* 浮动数字 */}
            {floatingNums.map((f) => (
              <span
                key={f.id}
                className="absolute pointer-events-none font-black text-amber-600 text-lg"
                style={{
                  left: f.x,
                  top: f.y,
                  animation: 'floatUp 1.2s ease-out forwards',
                }}
              >
                {f.value}
              </span>
            ))}
          </button>
        </div>

        {/* 提示文字 */}
        <div className="text-center text-[11px] font-bold text-[#1a1a2e]/60 mt-2">
          {zh ? '👆 轻敲木鱼，静心积德' : '👆 Tap gently, calm your mind'}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-3 animate-pop-in" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-3 text-center">
          <div className="text-[10px] font-black text-[#1a1a2e]/50 mb-1">
            {zh ? '最高连击' : 'Max Combo'}
          </div>
          <div className="text-2xl font-black text-orange-600">{maxCombo}</div>
        </div>
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-3 text-center">
          <div className="text-[10px] font-black text-[#1a1a2e]/50 mb-1">
            {zh ? '已解锁称号' : 'Titles Unlocked'}
          </div>
          <div className="text-2xl font-black text-purple-600">
            {MERIT_MILESTONES.filter((m) => merit >= m.threshold).length}/{MERIT_MILESTONES.length}
          </div>
        </div>
      </div>

      {/* 称号列表 */}
      <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-4 animate-pop-in" style={{ animationDelay: '0.25s' }}>
        <div className="text-[12px] font-black text-[#1a1a2e] mb-3">
          🏆 {zh ? '功德称号' : 'Merit Titles'}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MERIT_MILESTONES.map((m) => {
            const unlocked = merit >= m.threshold;
            return (
              <div
                key={m.threshold}
                className={`p-2 rounded-xl border-[2px] text-center transition-all
                  ${unlocked
                    ? 'bg-amber-100 border-amber-400 shadow-[2px_2px_0_0_#1a1a2e]'
                    : 'bg-gray-50 border-[#1a1a2e]/15 opacity-60'}`}
              >
                <div className="text-2xl mb-1">{unlocked ? m.emoji : '🔒'}</div>
                <div className={`text-[11px] font-black ${unlocked ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]/40'}`}>
                  {zh ? m.titleZh : m.titleEn}
                </div>
                <div className="text-[9px] font-bold text-[#1a1a2e]/50 mt-0.5">
                  {m.threshold} {zh ? '功德' : 'merit'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={handleReset}
        className="w-full py-2 text-[11px] font-bold text-[#1a1a2e]/50 hover:text-rose-600 transition-colors"
      >
        🔄 {zh ? '重置功德' : 'Reset Merit'}
      </button>

      {/* 浮动数字动画 keyframes */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translate(-50%, 0) scale(0.8); opacity: 1; }
          50% { transform: translate(-50%, -40px) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -80px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ======================================================================
// 木鱼 SVG
// ======================================================================
function WoodfishSVG() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* 木鱼主体 */}
      <ellipse cx="90" cy="75" rx="75" ry="45" fill="#8B4513" stroke="#1a1a2e" strokeWidth="3" />
      <ellipse cx="90" cy="72" rx="70" ry="40" fill="#A0522D" stroke="#1a1a2e" strokeWidth="2" />
      {/* 木鱼内部凹陷 */}
      <ellipse cx="90" cy="70" rx="55" ry="28" fill="#6B3410" stroke="#1a1a2e" strokeWidth="2" />
      {/* 木鱼纹路 - 鱼鳞 */}
      <path d="M 35 75 Q 50 65, 65 75 Q 80 65, 95 75 Q 110 65, 125 75 Q 140 65, 145 75" fill="none" stroke="#1a1a2e" strokeWidth="1.5" opacity="0.4" />
      <path d="M 35 85 Q 50 75, 65 85 Q 80 75, 95 85 Q 110 75, 125 85 Q 140 75, 145 85" fill="none" stroke="#1a1a2e" strokeWidth="1.5" opacity="0.4" />
      {/* 木鱼嘴部切口 */}
      <path d="M 90 45 L 100 55 L 90 65 L 80 55 Z" fill="#3D1F08" stroke="#1a1a2e" strokeWidth="2" />
      {/* 木鱼高光 */}
      <ellipse cx="65" cy="55" rx="15" ry="8" fill="#D2691E" opacity="0.6" />
      {/* 木槌 */}
      <g transform="rotate(-30, 140, 30)">
        <rect x="135" y="20" width="35" height="12" rx="3" fill="#5C3317" stroke="#1a1a2e" strokeWidth="2.5" />
        <rect x="165" y="22" width="20" height="8" rx="2" fill="#8B4513" stroke="#1a1a2e" strokeWidth="2" />
      </g>
    </svg>
  );
}

// ======================================================================
// 莲花 SVG（背景装饰）
// ======================================================================
function LotusSVG({ className }: { className?: string }) {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g transform="translate(120, 120)">
        {/* 莲花花瓣 - 8 瓣 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="0" cy="-60" rx="20" ry="50"
            fill="#f9a8d4" stroke="#1a1a2e" strokeWidth="2"
            transform={`rotate(${angle})`}
            opacity="0.7"
          />
        ))}
        {/* 莲花中心 */}
        <circle cx="0" cy="0" r="18" fill="#fbbf24" stroke="#1a1a2e" strokeWidth="2" />
        <circle cx="0" cy="0" r="10" fill="#f59e0b" />
      </g>
    </svg>
  );
}
