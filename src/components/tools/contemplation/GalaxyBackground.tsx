import Galaxy from '../../Galaxy';

export default function GalaxyBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      <div
        className="relative"
        style={{
          width: 'max(100vw, 100vh)',
          height: 'max(100vw, 100vh)',
        }}
      >
        <Galaxy
          starSpeed={0.6}
          density={1}
          hueShift={45}
          speed={1.6}
          glowIntensity={0.45}
          saturation={0}
          mouseRepulsion
          repulsionStrength={1}
          twinkleIntensity={0.8}
          rotationSpeed={0.1}
          transparent={false}
        />
      </div>
    </div>
  );
}
