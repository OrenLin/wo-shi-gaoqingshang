import Aurora from '../../Aurora';

export default function AuroraBackground() {
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
        <Aurora
          colorStops={['#5227FF', '#7cff67', '#5227FF']}
          amplitude={1}
          blend={0.5}
        />
      </div>
    </div>
  );
}
