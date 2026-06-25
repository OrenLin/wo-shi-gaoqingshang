import Hyperspeed from '../../Hyperspeed';

export default function HyperspeedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      {/* 使用 100vmax 确保移动端保持正方形比例 */}
      <div
        className="relative"
        style={{
          width: '100vmax',
          height: '100vmax',
        }}
      >
        <Hyperspeed speed={1} />
      </div>
    </div>
  );
}
