import Beams from '../../Beams';

export default function BeamsBackground() {
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
