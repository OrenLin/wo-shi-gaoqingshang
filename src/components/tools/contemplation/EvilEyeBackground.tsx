import EvilEye from '../../EvilEye';

export default function EvilEyeBackground() {
  // 新版 EvilEye 使用 gl_FragCoord 标准归一化，自动适配屏幕比例，无需 100vmax 容器
  return (
    <div className="absolute inset-0 overflow-hidden">
      <EvilEye
        eyeColor="#A855F7"
        intensity={1.3}
        pupilSize={0.55}
        irisWidth={0.3}
        glowIntensity={0.6}
        scale={0.5}
        noiseScale={1.3}
        pupilFollow={1.1}
        flameSpeed={0.8}
        backgroundColor="#000000"
      />
    </div>
  );
}
