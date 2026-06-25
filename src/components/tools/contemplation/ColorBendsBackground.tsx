import ColorBends from '../../ColorBends';

export default function ColorBendsBackground() {
  // 新版 ColorBends 使用 gl_FragCoord 标准归一化，自动适配屏幕比例，无需 100vmax 容器
  return (
    <div className="absolute inset-0 overflow-hidden">
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
  );
}
