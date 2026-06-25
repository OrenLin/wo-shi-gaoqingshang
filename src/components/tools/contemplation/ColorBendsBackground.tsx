import ColorBends from '../../ColorBends';
import { isMobile } from '../../../utils/device';

export default function ColorBendsBackground() {
  const mobile = isMobile();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <ColorBends
        rotation={90}
        speed={0.2}
        colors={['#5227FF', '#FF9FFC', '#7cff67']}
        scale={mobile ? 1.5 : 1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={mobile ? 1 : 1.7}
        parallax={mobile ? 0.5 : 0.6}
        noise={0.15}
        iterations={1}
        intensity={1.5}
        bandWidth={6}
      />
    </div>
  );
}
