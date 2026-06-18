import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Home() {
  const { setPage } = useGameStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 延迟显示内容，让开场动画更自然
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const floatingEmojis = ['💀', '😎', '😅', '👑', '🤵', '👨', '🧔', '👩'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* 主内容 */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* 标题 */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
          我是高情商
        </h1>

        {/* 副标题 */}
        <p className="text-xl md:text-2xl text-purple-100 mb-12">
          社交尴尬场景情商挑战
        </p>

        {/* 开始按钮 */}
        <button
          onClick={() => setPage('select')}
          className="px-12 py-4 bg-white text-purple-700 rounded-full text-xl font-bold
                     hover:bg-purple-100 hover:scale-105 transition-all duration-300
                     shadow-xl hover:shadow-2xl pulse-button"
        >
          开始挑战 🎯
        </button>

        {/* 提示文字 */}
        <p className="mt-8 text-purple-200 text-sm">
          测试你在社交场合的情商表现
        </p>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
