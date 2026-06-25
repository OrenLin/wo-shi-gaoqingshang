import ColorBends from '../../ColorBends';

export default function ColorBendsBackground() {
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
        <ColorBends
          rotation={90}
          speed={0.2}
          colors={['#5227FF', '#FF9FFC', '#7cff67']}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.7}
          parallax={0.6}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
        />
      </div>
    </div>
  );
}
