// ======================================================================
// AccessibilityProvider — 全局无障碍基础设施
//
// 提供：
//   1. Skip Link（键盘用户直达主内容，WCAG 2.4.1）
//   2. aria-live 公告区域（屏幕阅读器实时播报动态内容，WCAG 4.1.3）
//   3. prefers-reduced-motion 状态（尊重用户运动偏好，WCAG 2.3.3）
//   4. 高对比度模式检测
//
// 使用方式：
//   <AccessibilityProvider>
//     <App />
//   </AccessibilityProvider>
//
// 动态公告（任意组件内）：
//   const { announce } = useAccessibility();
//   announce('选中高情商答案！嘴替附体！'); // → 屏幕阅读器立即朗读
// ======================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// ------------ Context 类型 ------------
interface A11yContextValue {
  /** 屏幕阅读器公告函数（会朗读最新消息） */
  announce: (msg: string, priority?: 'polite' | 'assertive') => void;
  /** 用户是否偏好减少动画（prefers-reduced-motion: reduce） */
  prefersReducedMotion: boolean;
  /** 用户是否开启高对比度模式 */
  highContrast: boolean;
  /** 大字体模式 */
  largeText: boolean;
  /** 屏幕阅读器辅助提示模式 */
  screenReader: boolean;
  /** === 控制面板 setter === */
  setHighContrast: (v: boolean) => void;
  setLargeText: (v: boolean) => void;
  setScreenReader: (v: boolean) => void;
  setPrefersReducedMotion: (v: boolean) => void;
}

const A11yContext = createContext<A11yContextValue>({
  announce: () => {},
  prefersReducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  setHighContrast: () => {},
  setLargeText: () => {},
  setScreenReader: () => {},
  setPrefersReducedMotion: () => {},
});

export function useAccessibility() {
  return useContext(A11yContext);
}

// ------------ Provider 组件 ------------
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // aria-live 播报队列（轮询防抖）
  const liveRef = useRef<HTMLDivElement>(null);

  // === 四种模式状态：先从 localStorage 恢复用户上次的偏好 ===
  const [prefersReducedMotion, setPrefersReducedMotionState] = useState<boolean>(false);
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [screenReader, setScreenReader] = useState<boolean>(false);

  // 初始化：检测用户偏好 + 从 localStorage 恢复上次选择
  useEffect(() => {
    // 1. 系统偏好检测
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqHigh = window.matchMedia('(prefers-contrast: more)');
    setPrefersReducedMotionState(mqReduced.matches);
    setHighContrastState(mqHigh.matches);

    // 2. localStorage 用户偏好覆盖系统偏好
    try {
      const savedRM = localStorage.getItem('a11y_reduce_motion');
      const savedHC = localStorage.getItem('a11y_high_contrast');
      const savedLT = localStorage.getItem('a11y_large_text');
      const savedSR = localStorage.getItem('a11y_screen_reader');
      if (savedRM !== null) setPrefersReducedMotionState(savedRM === '1');
      if (savedHC !== null) setHighContrastState(savedHC === '1');
      if (savedLT !== null) setLargeText(savedLT === '1');
      if (savedSR !== null) setScreenReader(savedSR === '1');
    } catch {}

    // 3. 监听系统偏好变化
    const h1 = (e: MediaQueryListEvent) => {
      // 只有用户没手动选择过时才跟随系统变化
      if (localStorage.getItem('a11y_reduce_motion') === null) {
        setPrefersReducedMotionState(e.matches);
      }
    };
    const h2 = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('a11y_high_contrast') === null) {
        setHighContrastState(e.matches);
      }
    };
    mqReduced.addEventListener('change', h1);
    mqHigh.addEventListener('change', h2);

    return () => {
      mqReduced.removeEventListener('change', h1);
      mqHigh.removeEventListener('change', h2);
    };
  }, []);

  // === 将所有状态应用到 <html> 标签 ===
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', prefersReducedMotion);
    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('large-text', largeText);
    root.classList.toggle('screen-reader-mode', screenReader);
  }, [prefersReducedMotion, highContrast, largeText, screenReader]);

  // === 带持久化的 setter 封装 ===
  const setHighContrast = (v: boolean) => {
    setHighContrastState(v);
    try { localStorage.setItem('a11y_high_contrast', v ? '1' : '0'); } catch {}
  };
  const setPrefersReducedMotion = (v: boolean) => {
    setPrefersReducedMotionState(v);
    try { localStorage.setItem('a11y_reduce_motion', v ? '1' : '0'); } catch {}
  };
  const setLargeTextWrapper = (v: boolean) => {
    setLargeText(v);
    try { localStorage.setItem('a11y_large_text', v ? '1' : '0'); } catch {}
  };
  const setScreenReaderWrapper = (v: boolean) => {
    setScreenReader(v);
    try { localStorage.setItem('a11y_screen_reader', v ? '1' : '0'); } catch {}
  };

  // 公告函数：将消息写入 aria-live 区域，屏幕阅读器自动朗读
  const announce = useCallback(
    (msg: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!liveRef.current) return;
      liveRef.current.textContent = '';
      requestAnimationFrame(() => {
        if (liveRef.current) {
          liveRef.current.setAttribute('aria-live', priority);
          liveRef.current.textContent = msg;
        }
      });
    },
    [],
  );

  return (
    <A11yContext.Provider
      value={{
        announce,
        prefersReducedMotion,
        highContrast,
        largeText,
        screenReader,
        setHighContrast,
        setLargeText: setLargeTextWrapper,
        setScreenReader: setScreenReaderWrapper,
        setPrefersReducedMotion,
      }}
    >
      {/* Skip Link：键盘用户按 Tab 后第一个可聚焦元素，直达主内容 */}
      <a
        href="#main-content"
        className="skip-link"
      >
        {typeof document !== 'undefined' && document.documentElement.lang === 'en'
          ? 'Skip to main content'
          : '跳过导航，直达正文内容'}
      </a>

      {/* aria-live 公告区域：用于屏幕阅读器实时播报 */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      />

      {children}
    </A11yContext.Provider>
  );
}
