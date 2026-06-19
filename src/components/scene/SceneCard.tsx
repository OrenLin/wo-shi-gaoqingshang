import type { Scene } from '../../data/types';
import { useI18n, pickLocalized } from '../../i18n';

interface Props {
  scene: Scene;
  completed?: boolean;
  index: number;
  onClick?: () => void;
}

export default function SceneCard({ scene, completed, index, onClick }: Props) {
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);
  const qs = scene.questions.length;
  const sceneTitle = pickLocalized(scene.title, language);
  const sceneDesc = pickLocalized(scene.description, language);

  return (
    <button
      disabled={completed}
      onClick={onClick}
      aria-label={
        completed
          ? `${sceneTitle}，${language === 'zh' ? '已完成' : 'Completed'}`
          : `${sceneTitle}，${sceneDesc}，${qs}${language === 'zh' ? '题' : ' questions'}`
      }
      aria-disabled={completed}
      className={`relative w-full text-left rounded-[28px] border-[4px] border-[#1a1a2e]
                  shadow-[6px_6px_0_0_#1a1a2e] p-5
                  transition-all duration-200
                  ${completed
                    ? 'bg-white/80 opacity-80 cursor-not-allowed'
                    : 'bg-gradient-to-b from-white to-yellow-50 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1a1a2e]'}`}
    >
      <div
        aria-hidden="true"
        className="absolute -top-3 -left-3 bg-yellow-300 text-[#1a1a2e] font-black text-sm rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] rotate-[-10deg] z-10"
      >
        No. {index + 1}
      </div>

      {completed && (
        <div className="absolute top-3 right-3 z-10" aria-hidden="true">
          <div className="bg-green-500 text-white font-black text-xs rounded-2xl border-[3px] border-[#1a1a2e] px-3 py-1.5 shadow-[2px_2px_0_0_#1a1a2e] rotate-[8deg]">
            {t('select.completed')}
          </div>
        </div>
      )}

      <div className="relative h-24 flex items-center justify-center mb-3">
        <div
          aria-hidden="true"
          className="text-7xl animate-float-gentle"
          style={{ filter: 'drop-shadow(3px 4px 0 rgba(26,26,46,0.15))' }}
        >
          {scene.emoji}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] p-3">
        <h3 className="text-lg font-black text-[#1a1a2e] leading-tight">{sceneTitle}</h3>
        <p className="text-xs text-[#1a1a2e]/70 font-semibold mt-1 leading-snug">{sceneDesc}</p>

        <div className="flex flex-wrap gap-1.5 mt-3" aria-label={language === 'zh' ? '出场人物' : 'Characters'}>
          {scene.characters.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-yellow-100 text-[#1a1a2e] text-[11px] font-bold px-2 py-0.5 rounded-full border-[2px] border-[#1a1a2e]/70"
            >
              <span aria-hidden="true">{c.emoji}</span>
              <span>{pickLocalized(c.name, language)}</span>
            </span>
          ))}
        </div>

        <div className="mt-3">
          {completed ? (
            <div
              role="status"
              className="w-full text-center py-2 bg-green-100 text-green-700 font-black rounded-xl border-[3px] border-[#1a1a2e]"
            >
              {t('select.challengeDone')}
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="w-full text-center py-2 bg-[#1a1a2e] text-white font-black rounded-xl border-[3px] border-[#1a1a2e]"
            >
              🎯 {qs}{t('select.qs')}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
