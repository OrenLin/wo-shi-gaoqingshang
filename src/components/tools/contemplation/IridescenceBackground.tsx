import Iridescence from '../../Iridescence';

export default function IridescenceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Iridescence speed={1} amplitude={0.1} mouseReact />
    </div>
  );
}
