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
}

const A11yContext = createContext<A11yContextValue>({
  announce: () => {},
  prefersReducedMotion: false,
  highContrast: false,
});

export function useAccessibility() {
  return useContext(A11yContext);
}

// ------------ Provider 组件 ------------
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // aria-live 播报队列（轮询防抖）
  const liveRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // 初始化：检测用户偏好
  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mqReduced.matches);

    const mqHigh = window.matchMedia('(prefers-contrast: more)');
    setHighContrast(mqHigh.matches);

    // 监听偏好变化
    const h1 = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const h2 = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    mqReduced.addEventListener('change', h1);
    mqHigh.addEventListener('change', h2);

    return () => {
      mqReduced.removeEventListener('change', h1);
      mqHigh.removeEventListener('change', h2);
    };
  }, []);

  // 将 prefers-reduced-motion 和 highContrast 应用到 <html> 标签
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [prefersReducedMotion, highContrast]);

  // 公告函数：将消息写入 aria-live 区域，屏幕阅读器自动朗读
  const announce = useCallback(
    (msg: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!liveRef.current) return;
      // 先清空（确保屏幕阅读器感知到变化）
      liveRef.current.textContent = '';
      // 用 requestAnimationFrame 确保 DOM 更新后再写内容
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
    <A11yContext.Provider value={{ announce, prefersReducedMotion, highContrast }}>
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
