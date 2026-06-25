import Ferrofluid from '../../Ferrofluid';

export default function FerrofluidBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      <div
        className="relative"
        style={{
          width: 'max(100vw, 100vh)',
          height: 'max(100vw, 100vh)',
        }}
      >
        <Ferrofluid
          colors={['#ffffff', '#c0c0c0', '#808080']}
          speed={0.5}
          scale={2.4}
          turbulence={1.25}
          fluidity={0.1}
          rimWidth={0.26}
          sharpness={1.9}
          shimmer={1.55}
          glow={2.3}
          flowDirection="down"
          opacity={1}
          mouseInteraction
          mouseStrength={1.1}
          mouseRadius={0.3}
        />
      </div>
    </div>
  );
}
