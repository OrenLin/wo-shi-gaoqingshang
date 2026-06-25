import Balatro from '../../Balatro';

export default function BalatroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Balatro
        spinRotation={-2}
        spinSpeed={7}
        color1="#DE443B"
        color2="#006BB4"
        color3="#162325"
        contrast={2.5}
        lighting={0.3}
        spinAmount={0.55}
        pixelFilter={700}
      />
    </div>
  );
}
