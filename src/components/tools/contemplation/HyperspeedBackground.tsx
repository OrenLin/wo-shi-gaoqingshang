import Hyperspeed from '../../Hyperspeed';

export default function HyperspeedBackground() {
  // 新版 Hyperspeed 使用 gl_FragCoord 标准归一化，自动适配屏幕比例，无需 100vmax 容器
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Hyperspeed speed={1} />
    </div>
  );
}
