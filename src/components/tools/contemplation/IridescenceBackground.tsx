import Iridescence from '../../Iridescence';

export default function IridescenceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      {/* 使用 100vmax 确保移动端保持正方形比例 */}
      <div
        className="relative"
        style={{
          width: '100vmax',
          height: '100vmax',
        }}
      >
        <Iridescence speed={1} amplitude={0.1} mouseReact />
      </div>
    </div>
  );
}
