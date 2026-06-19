import { useGameStore } from '../store/gameStore';
import { scenes } from '../data';
import SceneCard from '../components/scene/SceneCard';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import { audioManager } from '../utils/audioManager';
import { useI18n, pickLocalized } from '../i18n';

export default function SceneSelect() {
  const { selectScene, reset, getCompletedSceneIds } = useGameStore();
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const t = useI18n((s) => s.t);
  const tLocal = (field: string | { zh: string; en: string } | undefined) =>
    pickLocalized(field, language);

  const completedIds = getCompletedSceneIds();
  const doneCount = completedIds.size;
  const totalCount = scenes.length;

  return (
    <div
      className="min-h-screen relative overflow-hidden py-8 px-4"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)' }}
    >
      <div className="absolute inset-0 manga-stripes opacity-30 pointer-events-none" />
      <FloatingEmojis
        items={[
          { emoji: '✨', top: '4%', left: '5%', delay: '0s' },
          { emoji: '🎉', top: '10%', right: '6%', delay: '0.4s', size: '2rem' },
          { emoji: '💫', bottom: '10%', left: '8%', delay: '0.8s' },
          { emoji: '🎯', bottom: '15%', right: '5%', delay: '1.2s', size: '2rem' },
        ]}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* 顶栏 */}
        <div className="flex items-start justify-between mb-6">
          <MangaButton variant="secondary" onClick={reset} className="!py-2 !px-4 !text-sm">
            {t('select.home')}
          </MangaButton>

          <div className="flex items-center gap-2">
            <div className="bg-[#1a1a2e] text-white text-xs font-black rounded-full px-3 py-1 border-[3px] border-[#1a1a2e]">
              {t('select.progress')} {doneCount}{t('common.of')}{totalCount}
            </div>
            <button
              onClick={() => {
                audioManager.userTapped();
                audioManager.play('click');
                setLanguage(language === 'zh' ? 'en' : 'zh');
              }}
              className="inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
            >
              <span>🌐</span>
              <span>{language === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a2e] leading-tight"
              style={{ WebkitTextStroke: '2px #1a1a2e', textShadow: '4px 4px 0 #fbbf24' }}>
            {t('select.title1')}<span className="text-red-500">{t('select.title2')}</span>{t('select.title3')}
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
            <span className="text-sm font-bold text-[#1a1a2e]">{t('select.tip')}</span>
          </div>
        </div>

        {/* 场景卡网格 */}
        <div className="grid md:grid-cols-3 gap-6">
          {scenes.map((scene, index) => {
            const localizedScene = {
              ...scene,
              title: pickLocalized(scene.title, language),
              description: pickLocalized(scene.description, language),
              characters: scene.characters.map((c) => ({
                ...c,
                name: pickLocalized(c.name, language),
                description: c.description ? pickLocalized(c.description, language) : undefined,
              })),
            };
            const completed = completedIds.has(scene.id);
            return (
              <div key={scene.id} className="animate-pop-in" style={{ animationDelay: `${index * 120}ms` }}>
                <SceneCard
                  scene={localizedScene}
                  index={index}
                  completed={completed}
                  onClick={() => selectScene(index)}
                />
              </div>
            );
          })}
        </div>

        {/* 全部完成激励 */}
        {doneCount === totalCount && (
          <div className="mt-10 text-center">
            <div className="inline-block bg-gradient-to-b from-yellow-300 to-orange-400 text-[#1a1a2e] font-black text-base md:text-lg px-6 py-3 rounded-2xl border-[4px] border-[#1a1a2e] shadow-[6px_6px_0_0_#1a1a2e] animate-wiggle">
              {t('select.allDone')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
