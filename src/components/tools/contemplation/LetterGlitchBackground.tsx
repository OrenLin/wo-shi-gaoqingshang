import LetterGlitch from '../../LetterGlitch';

export default function LetterGlitchBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <LetterGlitch
        glitchColors={['#5227FF', '#7cff67', '#ff6b6b']}
        glitchSpeed={50}
        centerVignette
        outerVignette
        smooth
      />
    </div>
  );
}
