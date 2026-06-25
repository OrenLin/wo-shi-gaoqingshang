import EvilEye from '../../EvilEye';

export default function EvilEyeBackground() {
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
        <EvilEye
          eyeColor="#A855F7"
          intensity={1.3}
          pupilSize={0.55}
          irisWidth={0.3}
          glowIntensity={0.6}
          scale={0.8}
          noiseScale={1.3}
          pupilFollow={1.1}
          flameSpeed={0.8}
          backgroundColor="#000000"
        />
      </div>
    </div>
  );
}
