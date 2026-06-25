import EvilEye from '../../EvilEye';

export default function EvilEyeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
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
  );
}
