import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getScenesByModule, getModuleById } from '../data';
import SceneCard from '../components/scene/SceneCard';
import ImmersiveScenePreview from '../components/scene/ImmersiveScenePreview';
import FloatingEmojis from '../components/ui/FloatingEmojis';
import MangaButton from '../components/ui/MangaButton';
import ConsentModal from '../components/ui/ConsentModal';
import PageHeader from '../components/ui/PageHeader';
import { audioManager } from '../utils/audioManager';
import { useI18n, pickLocalized } from '../i18n';

export default function SceneSelect() {
  const { selectScene, getAllCompletedSceneIds, setPage, consented, setConsented } = useGameStore();
  const currentModule = useGameStore((s) => s.currentModule);
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const t = useI18n((s) => s.t);
  const tLocal = (field: string | { zh: string; en: string } | undefined) =>
    pickLocalized(field, language);

  const scenes = getScenesByModule(currentModule);
  const currentModConfig = getModuleById(currentModule);

  const [previewScene, setPreviewScene] = useState<{ scene: typeof scenes[0]; index: number } | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [accept, setAccept] = useState(true);
  const [pendingScene, setPendingScene] = useState<{ scene: typeof scenes[0]; index: number } | null>(null);

  const completedIds = getAllCompletedSceneIds();
  const doneCount = completedIds.size;
  const totalCount = scenes.length;
  const allDone = doneCount === totalCount;

  // 分组：未完成在上、已完成在下（保持原始顺序）
  const pendingScenes = scenes.filter((s) => !completedIds.has(s.id));
  const doneScenes = scenes.filter((s) => completedIds.has(s.id));

  // 根据在原始 scenes 数组中的索引重新确定显示 index
  const getSceneOriginalIndex = (sceneId: string) => scenes.findIndex((s) => s.id === sceneId);

  const handleSceneClick = (scene: typeof scenes[0], index: number) => {
    if (!consented) {
      setPendingScene({ scene, index });
      setConsentOpen(true);
      return;
    }
    setPreviewScene({ scene, index });
  };

  const handleConsentConfirm = () => {
    if (!accept) return;
    setConsented(true);
    setConsentOpen(false);
    if (pendingScene) {
      setPreviewScene(pendingScene);
      setPendingScene(null);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden pt-8 pb-24 px-4"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 55%, #fbbf24 100%)' }}
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

        {/* 统一主标题 + 模块标签/进度 */}
        <PageHeader
          emoji="🎯"
          title={`${t('select.title1')}${t('select.title2')}${t('select.title3')}`}
          subtitle={t('select.tip')}
          onBack={() => setPage('modules')}
          backLabel={t('select.home')}
          rightSlot={
            <>
              {currentModConfig && (
                <div className="bg-white text-[#1a1a2e] text-xs font-black rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24]">
                  {currentModConfig.emoji} {tLocal(currentModConfig.title)}
                </div>
              )}
              <div className="bg-[#1a1a2e] text-white text-xs font-black rounded-full px-3 py-1 border-[3px] border-[#1a1a2e]">
                {t('select.progress')} {doneCount}{t('common.of')}{totalCount}
              </div>
              <button
                onClick={() => {
                  audioManager.userTapped();
                  audioManager.play('click');
                  setLanguage(language === 'zh' ? 'en' : 'zh');
                }}
                className="inline-flex items-center gap-1.5 bg-[#1a1a2e] text-white font-black text-xs rounded-full px-3 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#fbbf24] hover:-translate-y-[2px] active:translate-y-[1px] transition-transform"
              >
                <span>🌐</span>
                <span>{language === 'zh' ? 'EN' : '中文'}</span>
              </button>
            </>
          }
        />

        {/* 全部完成 → 报告入口 */}
        {allDone && (
          <div className="mb-8 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] p-6 text-center">
            <div className="text-5xl mb-2 animate-wiggle">🏆</div>
            <div className="text-xl md:text-2xl font-black text-[#1a1a2e] leading-tight">
              {t('select.allDone')}
            </div>
            <MangaButton
              variant="primary"
              onClick={() => {
                audioManager.userTapped();
                audioManager.play('success');
                setPage('report');
              }}
              className="w-full mt-5 !py-5 !text-xl"
            >
              <span className="text-2xl animate-bounce" style={{ animationDuration: '1.2s' }}>📊</span>
              {t('select.viewReport')}
            </MangaButton>
          </div>
        )}

        {/* 未完成场景 */}
        {pendingScenes.length > 0 && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-[#1a1a2e]/20 rounded-full" />
              <span className="inline-flex items-center gap-2 bg-white border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
                <span className="text-xs font-black text-[#1a1a2e]">
                  {language === 'zh' ? '🎯 未完成' : '🎯 Pending'}
                </span>
              </span>
              <div className="flex-1 h-[3px] bg-[#1a1a2e]/20 rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {pendingScenes.map((scene, i) => {
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
                return (
                  <div key={scene.id} className="animate-pop-in" style={{ animationDelay: `${i * 120}ms` }}>
                    <SceneCard
                      scene={localizedScene}
                      index={getSceneOriginalIndex(scene.id)}
                      completed={false}
                      onClick={() => {
                        audioManager.userTapped();
                        audioManager.play('click');
                        handleSceneClick(scene, getSceneOriginalIndex(scene.id));
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* 已完成场景 */}
        {doneScenes.length > 0 && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-[#1a1a2e]/20 rounded-full" />
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 border-[3px] border-[#1a1a2e] rounded-full px-4 py-1.5 shadow-[3px_3px_0_0_#1a1a2e]">
                <span className="text-xs font-black text-[#1a1a2e]">
                  {language === 'zh' ? '✅ 已完成' : '✅ Completed'}
                </span>
              </span>
              <div className="flex-1 h-[3px] bg-[#1a1a2e]/20 rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {doneScenes.map((scene, i) => {
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
                return (
                  <div key={scene.id} className="animate-pop-in" style={{ animationDelay: `${i * 120}ms` }}>
                    <SceneCard
                      scene={localizedScene}
                      index={getSceneOriginalIndex(scene.id)}
                      completed={true}
                      onClick={() => {
                        audioManager.userTapped();
                        audioManager.play('click');
                        handleSceneClick(scene, getSceneOriginalIndex(scene.id));
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {previewScene && (
        <ImmersiveScenePreview
          scene={previewScene.scene}
          index={previewScene.index}
          onEnter={() => {
            selectScene(previewScene.index);
            setPreviewScene(null);
          }}
          onClose={() => setPreviewScene(null)}
        />
      )}

      <ConsentModal
        open={consentOpen}
        accepted={accept}
        showPrivacy={showPrivacy}
        onToggleAccept={setAccept}
        onTogglePrivacy={setShowPrivacy}
        onConfirm={handleConsentConfirm}
        onClose={() => setConsentOpen(false)}
      />
    </div>
  );
}
