import Beams from '../../Beams';

export default function BeamsBackground() {
  // 新版 Beams 使用 gl_FragCoord 标准归一化，自动适配屏幕比例，无需 100vmax 容器
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={2}
        scale={1}
        rotation={0}
      />
    </div>
  );
}
