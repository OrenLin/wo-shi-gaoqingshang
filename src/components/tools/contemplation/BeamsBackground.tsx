import Beams from '../../Beams';

export default function BeamsBackground() {
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
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={2}
          scale={0.25}
          rotation={0}
        />
      </div>
    </div>
  );
}
