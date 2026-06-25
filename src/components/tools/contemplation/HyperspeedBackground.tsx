import Hyperspeed from '../../Hyperspeed';

export default function HyperspeedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Hyperspeed speed={1} />
    </div>
  );
}
