import Aurora from '../../Aurora';

export default function AuroraBackground() {
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
        <Aurora
          colorStops={['#5227FF', '#7cff67', '#5227FF']}
          amplitude={1}
          blend={0.5}
        />
      </div>
    </div>
  );
}
