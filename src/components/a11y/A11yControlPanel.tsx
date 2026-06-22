// ======================================================================
// A11yControlPanel — 显性无障碍控制中心（右下角小轮椅图标）
//
// 功能：
//   • 固定悬浮按钮（轮椅图标 ♿），始终可见
//   • 点击弹出面板，可一键切换 4 种无障碍模式：
//     1. 🎨 高对比度模式 — 黑白高对比，增强可辨识性
//     2. 🔠 大字体模式 — 放大所有文字到 125%
//     3. 🚫 减少动画 — 关闭所有弹跳/漂浮/摇摆动画
//     4. 🔊 朗读提示 — 增强屏幕阅读器友好提示
//   • 偏好自动保存到 localStorage，下次访问自动恢复
// ======================================================================

import { useEffect, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { useI18n } from '../../i18n';

export default function A11yControlPanel() {
  const {
    highContrast,
    largeText,
    prefersReducedMotion,
    screenReader,
    setHighContrast,
    setLargeText,
    setPrefersReducedMotion,
    setScreenReader,
    announce,
  } = useAccessibility();

  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);

  const [open, setOpen] = useState(false);

  // 点击面板外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.a11y-panel') && !target.closest('.a11y-toggle-btn')) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    setTimeout(() => document.addEventListener('click', handler), 0);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const activeCount =
    (highContrast ? 1 : 0) +
    (largeText ? 1 : 0) +
    (prefersReducedMotion ? 1 : 0) +
    (screenReader ? 1 : 0);

  const zh = language === 'zh';

  return (
    <>
      {/* ============ 悬浮按钮：小轮椅图标 ============ */}
      <button
        className={
          'a11y-toggle-btn fixed bottom-24 right-4 z-[45] ' +
          'w-11 h-11 md:w-13 md:h-13 rounded-full ' +
          'bg-gradient-to-br from-sky-400 to-blue-600 text-white ' +
          'border-[4px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] ' +
          'flex items-center justify-center ' +
          'hover:-translate-y-[2px] hover:scale-105 active:scale-95 ' +
          'transition-transform animate-wiggle'
        }
        onClick={() => setOpen((v) => !v)}
        aria-label={open
          ? zh ? '关闭无障碍设置' : 'Close accessibility settings'
          : zh ? '打开无障碍设置' : 'Open accessibility settings'}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {/* 轮椅 emoji 图标 */}
        <span aria-hidden="true" className="text-2xl md:text-3xl leading-none">
          ♿
        </span>
        {/* 激活模式计数小红点 */}
        {activeCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black border-2 border-[#1a1a2e] flex items-center justify-center animate-bounce"
            style={{ animationDuration: '1.5s' }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ============ 弹出的控制面板 ============ */}
      {open && (
        <div
          className="a11y-panel fixed bottom-40 right-4 z-[45] w-72 md:w-80 rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] bg-white overflow-hidden animate-pop-in"
          role="dialog"
          aria-label={zh ? '无障碍设置' : 'Accessibility settings'}
        >
          {/* 顶部标题栏 */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-3 flex items-center gap-2 border-b-[3px] border-[#1a1a2e]">
            <span aria-hidden="true" className="text-2xl">♿</span>
            <div className="flex-1">
              <div className="font-black text-sm">{t('a11y.title')}</div>
              <div className="text-[11px] font-bold opacity-90">
                {activeCount > 0
                  ? t('a11y.activeCount', { n: activeCount })
                  : t('a11y.hint')}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-xl leading-none font-black"
              aria-label={zh ? '关闭' : 'Close'}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {/* 模式开关列表 */}
          <div className="p-3 space-y-2">
            {/* 1. 高对比度 */}
            <ModeToggle
              icon="🎨"
              title={t('a11y.highContrast')}
              desc={t('a11y.highContrastDesc')}
              active={highContrast}
              onToggle={() => {
                setHighContrast(!highContrast);
                announce(!highContrast
                  ? zh ? '已开启高对比度模式' : 'High contrast enabled'
                  : zh ? '已关闭高对比度模式' : 'High contrast disabled');
              }}
              zh={zh}
            />

            {/* 2. 大字体 */}
            <ModeToggle
              icon="🔠"
              title={t('a11y.largeText')}
              desc={t('a11y.largeTextDesc')}
              active={largeText}
              onToggle={() => {
                setLargeText(!largeText);
                announce(!largeText
                  ? zh ? '已开启大字体模式' : 'Large text enabled'
                  : zh ? '已关闭大字体模式' : 'Large text disabled');
              }}
              zh={zh}
            />

            {/* 3. 减少动画 */}
            <ModeToggle
              icon="🚫"
              title={t('a11y.reduceMotion')}
              desc={t('a11y.reduceMotionDesc')}
              active={prefersReducedMotion}
              onToggle={() => {
                setPrefersReducedMotion(!prefersReducedMotion);
                announce(!prefersReducedMotion
                  ? zh ? '已关闭所有动画' : 'Animations disabled'
                  : zh ? '已恢复动画效果' : 'Animations restored');
              }}
              zh={zh}
            />

            {/* 4. 屏幕阅读器友好 */}
            <ModeToggle
              icon="🔊"
              title={t('a11y.screenReader')}
              desc={t('a11y.screenReaderDesc')}
              active={screenReader}
              onToggle={() => {
                setScreenReader(!screenReader);
                announce(!screenReader
                  ? zh ? '已开启屏幕阅读器辅助提示' : 'Screen reader hints enabled'
                  : zh ? '已关闭屏幕阅读器辅助提示' : 'Screen reader hints disabled');
              }}
              zh={zh}
            />
          </div>

          {/* 底部提示：键盘快捷键 */}
          <div className="px-3 pb-3 pt-1 border-t-[2px] border-dashed border-[#1a1a2e]/20">
            <div className="text-[10px] font-bold text-[#1a1a2e]/60 leading-relaxed">
              <span aria-hidden="true">⌨️</span> {t('a11y.keyboardHint')}
              <br />
              <span aria-hidden="true">🎯</span> {t('a11y.tabHint')}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ======================================================================
// 单个模式开关组件
// ======================================================================
interface ModeToggleProps {
  icon: string;
  title: string;
  desc: string;
  active: boolean;
  onToggle: () => void;
  zh: boolean;
}

function ModeToggle({ icon, title, desc, active, onToggle, zh }: ModeToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={active}
      aria-label={`${title}，${active ? zh ? '已开启' : 'On' : zh ? '已关闭' : 'Off'}`}
      onClick={onToggle}
      className={
        'w-full flex items-center gap-3 p-3 rounded-xl border-[3px] border-[#1a1a2e] ' +
        'transition-all text-left ' +
        (active
          ? 'bg-gradient-to-r from-amber-200 to-yellow-300 shadow-[3px_3px_0_0_#1a1a2e] scale-[1.02]'
          : 'bg-slate-50 hover:bg-slate-100 shadow-[2px_2px_0_0_#1a1a2e]')
      }
    >
      <span aria-hidden="true" className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-xl border-2 border-[#1a1a2e]">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-black text-sm text-[#1a1a2e] truncate">{title}</div>
        <div className="text-[11px] font-bold text-[#1a1a2e]/55 leading-tight">{desc}</div>
      </div>

      {/* 开关视觉 */}
      <div
        aria-hidden="true"
        className={
          'flex-shrink-0 w-12 h-7 rounded-full border-[3px] border-[#1a1a2e] relative transition-colors ' +
          (active ? 'bg-emerald-400' : 'bg-slate-200')
        }
      >
        <div
          className={
            'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#1a1a2e] transition-all ' +
            (active ? 'left-6' : 'left-0.5')
          }
        />
      </div>
    </button>
  );
}
