import Hyperspeed from '../../Hyperspeed';
import { isMobile } from '../../../utils/device';

export default function HyperspeedBackground() {
  const mobile = isMobile();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Hyperspeed speed={mobile ? 0.8 : 1} />
    </div>
  );
}
