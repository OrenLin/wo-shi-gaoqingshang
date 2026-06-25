import Iridescence from '../../Iridescence';
import { isMobile } from '../../../utils/device';

export default function IridescenceBackground() {
  const mobile = isMobile();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Iridescence
        speed={1}
        amplitude={mobile ? 0.15 : 0.1}
        mouseReact
      />
    </div>
  );
}
