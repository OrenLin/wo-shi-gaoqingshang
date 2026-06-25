import Beams from '../../Beams';

export default function BeamsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={2}
        scale={0.25}
        rotation={0}
      />
    </div>
  );
}
