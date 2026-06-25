import Iridescence from '../../Iridescence';

export default function IridescenceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      {/* 保持正方形比例，居中裁切 */}
      <div
        className="relative"
        style={{
          width: 'max(100vw, 100vh)',
          height: 'max(100vw, 100vh)',
        }}
      >
        <Iridescence speed={1} amplitude={0.1} mouseReact />
      </div>
    </div>
  );
}
