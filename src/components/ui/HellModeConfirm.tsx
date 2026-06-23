// ======================================================================
// HellModeConfirm — 地狱模式确认弹窗
// 进攻性 + 地狱元素 UI（火焰、骷髅、血红色）
// ======================================================================
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function HellModeConfirm({ open, onConfirm, onCancel }: Props) {
  const t = useI18n((s) => s.t);
  const language = useI18n((s) => s.language);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShow(true), 50);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(20,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={() => {
        audioManager.userTapped();
        onCancel();
      }}
    >
      {/* 背景火焰粒子 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute hell-flame-particle"
            style={{
              left: `${5 + i * 8}%`,
              bottom: '0%',
              fontSize: `${16 + (i % 4) * 6}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2.5 + (i % 3) * 0.8}s`,
            }}
          >
            {i % 3 === 0 ? '🔥' : i % 3 === 1 ? '💀' : '🔥'}
          </span>
        ))}
      </div>

      <div
        className={`relative w-full max-w-sm hell-modal-enter ${show ? 'hell-modal-enter-active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-2xl border-[4px] border-[#1a1a2e]"
          style={{
            background: 'linear-gradient(160deg, #2a0505 0%, #4a0a0a 30%, #6b1010 60%, #8b1a1a 100%)',
            boxShadow: '0 0 40px rgba(220,38,38,0.6), 8px 8px 0 0 #1a1a2e',
          }}
        >
          {/* 顶部火焰横幅 */}
          <div
            className="relative h-20 flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
              borderBottom: '3px solid #1a1a2e',
            }}
          >
            {/* 火焰闪烁动画 */}
            <div className="absolute inset-0 hell-fire-flicker" />
            <div className="relative flex items-center gap-2">
              <span className="text-4xl hell-fire-bounce" style={{ animationDelay: '0s' }}>🔥</span>
              <span className="text-4xl hell-fire-bounce" style={{ animationDelay: '0.2s' }}>💀</span>
              <span className="text-4xl hell-fire-bounce" style={{ animationDelay: '0.4s' }}>🔥</span>
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-6 text-center">
            <h2
              className="text-2xl font-black text-red-100 mb-1 hell-text-shake"
              style={{ textShadow: '0 0 12px rgba(220,38,38,0.8), 2px 2px 0 #1a1a2e' }}
            >
              {t('report.hellModeTitle')}
            </h2>
            <p className="text-xs font-bold text-red-300/80 mb-4">
              {t('report.hellModeSubtitle')}
            </p>

            {/* 警告框 */}
            <div
              className="rounded-lg border-2 border-yellow-500/50 p-3 mb-5"
              style={{ background: 'rgba(50,20,0,0.6)' }}
            >
              <p className="text-[11px] font-bold text-yellow-200 leading-relaxed">
                {t('report.hellModeWarning')}
              </p>
            </div>

            {/* 地狱特征列表 */}
            <div className="space-y-2 mb-5 text-left">
              {[
                { icon: '🎲', zh: '所有场景题目随机混合', en: 'All scenes mixed randomly' },
                { icon: '⚡', zh: '选项顺序打乱，无规律可循', en: 'Options shuffled, no patterns' },
                { icon: '🔥', zh: '地狱级难度，社死概率极高', en: 'Hell difficulty, social death likely' },
                { icon: '💀', zh: '没有退路，只能一往无前', en: 'No retreat, only forward' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ background: 'rgba(80,15,15,0.5)' }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[11px] font-bold text-red-100/90">
                    {language === 'zh' ? item.zh : item.en}
                  </span>
                </div>
              ))}
            </div>

            {/* 按钮区 */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  audioManager.userTapped();
                  audioManager.play('click');
                  onConfirm();
                }}
                className="w-full py-3.5 rounded-xl border-[3px] border-[#1a1a2e] font-black text-base text-white transition-all active:translate-y-[2px] hell-btn-pulse"
                style={{
                  background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
                  boxShadow: '0 0 16px rgba(220,38,38,0.5), 3px 3px 0 0 #1a1a2e',
                }}
              >
                ⚔️ {t('report.hellModeConfirm')}
              </button>
              <button
                onClick={() => {
                  audioManager.userTapped();
                  audioManager.play('click');
                  onCancel();
                }}
                className="w-full py-2.5 rounded-xl border-[2px] border-[#1a1a2e]/40 font-bold text-xs text-red-200/60 transition-all active:scale-95 hover:bg-white/5"
              >
                {t('report.hellModeCancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
