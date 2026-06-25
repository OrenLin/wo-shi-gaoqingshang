import Aurora from '../../Aurora';

export default function AuroraBackground() {
  // 新版 Aurora 使用 gl_FragCoord 标准归一化，自动适配屏幕比例，无需 100vmax 容器
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Aurora
        colorStops={['#5227FF', '#7cff67', '#5227FF']}
        amplitude={1}
        blend={0.5}
      />
    </div>
  );
}
