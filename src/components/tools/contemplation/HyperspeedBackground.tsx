import Hyperspeed from '../../Hyperspeed';

export default function HyperspeedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      {/* 保持正方形比例，居中裁切 */}
      <div
        className="relative"
        style={{
          width: 'max(100vw, 100vh)',
          height: 'max(100vw, 100vh)',
        }}
      >
        <Hyperspeed speed={1} />
      </div>
    </div>
  );
}
