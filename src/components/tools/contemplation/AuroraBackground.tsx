import Aurora from '../../Aurora';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Aurora
        colorStops={['#5227FF', '#7cff67', '#5227FF']}
        amplitude={1}
        blend={0.5}
      />
    </div>
  );
}
