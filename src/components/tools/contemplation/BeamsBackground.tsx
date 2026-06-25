import Beams from '../../Beams';
import { isMobile } from '../../../utils/device';

export default function BeamsBackground() {
  const mobile = isMobile();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Beams
        beamWidth={2}
        beamHeight={mobile ? 10 : 15}
        beamNumber={mobile ? 8 : 12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={mobile ? 1.75 : 2}
        scale={mobile ? 0.2 : 0.25}
        rotation={0}
      />
    </div>
  );
}
