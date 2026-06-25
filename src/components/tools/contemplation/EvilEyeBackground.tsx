import EvilEye from '../../EvilEye';

export default function EvilEyeBackground() {
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
