import { useState } from 'react';
import { useI18n } from '../i18n';
import { useGameStore } from '../store/gameStore';
import { sceneModules, getScenesByModule } from '../data';
import { audioManager } from '../utils/audioManager';
import type { SceneModule } from '../data/types';

export default function SceneModules() {
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);
  const selectModule = useGameStore((s) => s.selectModule);
  const setPage = useGameStore((s) => s.setPage);
  const getCompletedSceneIds = useGameStore((s) => s.getCompletedSceneIds);
  const zh = language === 'zh';

  const [lockedShake, setLockedShake] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const completedIds = getCompletedSceneIds();

  const handleModuleClick = (moduleId: SceneModule) => {
    // 先跳转，不阻塞
    selectModule(moduleId);
    // 延迟播放音频，不阻塞 UI
    requestAnimationFrame(() => {
      audioManager.userTapped();
      audioManager.play('click');
    });
  };

  const handleLockedClick = () => {
    setLockedShake(true);
    setShowToast(true);
    setTimeout(() => setLockedShake(false), 500);
    setTimeout(() => setShowToast(false), 2500);
    requestAnimationFrame(() => {
      audioManager.userTapped();
      audioManager.play('caw');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 px-4 py-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* 顶部标题区 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-[#1a1a2e] flex items-center gap-2">
            <span aria-hidden="true">🎯</span>
            {zh ? '选择场景' : 'Scenes'}
          </h1>
          <button
            onClick={() => {
              setPage('home');
              requestAnimationFrame(() => {
                audioManager.userTapped();
                audioManager.play('click');
              });
            }}
            aria-label={zh ? '返回首页' : 'Back to home'}
            className="inline-flex items-center gap-1 bg-white border-[3px] border-[#1a1a2e] rounded-full px-3 py-1.5 shadow-[2px_2px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-transform active:scale-95 hover:scale-105"
          >
            <span aria-hidden="true">←</span>
            {zh ? '首页' : 'Home'}
          </button>
        </div>

        {/* 副标题 */}
        <div className="text-sm font-bold text-[#1a1a2e]/50 mb-5 px-1">
          {zh ? '👉 选择一个主题模块，开始你的挑战' : '👉 Pick a theme module to start your challenge'}
        </div>

        {/* 模块卡片网格 */}
        <div className="grid grid-cols-1 gap-4">
          {sceneModules.map((mod, i) => {
            const moduleScenes = getScenesByModule(mod.id);
            const doneCount = moduleScenes.filter((s) => completedIds.has(s.id)).length;
            const totalCount = moduleScenes.length;
            const allDone = doneCount === totalCount && totalCount > 0;
            const modTitle = typeof mod.title === 'string' ? mod.title : (zh ? mod.title.zh : mod.title.en);
            const modDesc = typeof mod.description === 'string' ? mod.description : (zh ? mod.description.zh : mod.description.en);

            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod.id)}
                aria-label={`${modTitle}，${doneCount}/${totalCount} ${zh ? '已完成' : 'completed'}`}
                className={`relative bg-gradient-to-br ${mod.bgColor} rounded-2xl border-[4px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e] p-5 text-left transition-transform hover:-translate-y-[3px] active:translate-y-[1px] animate-pop-in overflow-hidden`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* 背景大 emoji 装饰 */}
                <div aria-hidden="true" className="absolute -right-4 -top-4 text-8xl opacity-15 select-none">
                  {mod.emoji}
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0" aria-hidden="true">{mod.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-black text-white mb-1" style={{ textShadow: '2px 2px 0 rgba(26,26,46,0.3)' }}>
                      {modTitle}
                    </div>
                    <div className="text-sm font-bold text-white/90 mb-3" style={{ textShadow: '1px 1px 0 rgba(26,26,46,0.3)' }}>
                      {modDesc}
                    </div>
                    {/* 进度条 */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-white/30 rounded-full border-2 border-[#1a1a2e] overflow-hidden">
                        <div
                          className="h-full bg-amber-300 transition-all"
                          style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-white bg-[#1a1a2e]/40 rounded-full px-2 py-0.5">
                        {doneCount}/{totalCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 全部完成徽章 */}
                {allDone && (
                  <div className="absolute top-3 right-3 bg-amber-300 text-[#1a1a2e] font-black text-xs rounded-full px-3 py-1 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] animate-wiggle" aria-hidden="true">
                    ✓ {zh ? '已通关' : 'Cleared'}
                  </div>
                )}

                {/* 进入箭头 */}
                <div className="absolute bottom-3 right-3 text-2xl text-white/80" aria-hidden="true">
                  →
                </div>
              </button>
            );
          })}

          {/* 锁定的"更多场景"卡片 */}
          <button
            onClick={handleLockedClick}
            aria-label={zh ? '更多场景，即将上线' : 'More scenes, coming soon'}
            className={`relative bg-slate-100 rounded-2xl border-[4px] border-dashed border-[#1a1a2e]/30 p-5 text-center transition-transform ${lockedShake ? 'animate-shake' : ''}`}
          >
            <div className="text-5xl mb-2 opacity-40" aria-hidden="true">🔒</div>
            <div className="text-lg font-black text-[#1a1a2e]/40">
              {zh ? '更多场景' : 'More Scenes'}
            </div>
            <div className="text-xs font-bold text-[#1a1a2e]/30 mt-1">
              {zh ? '即将上线，敬请期待' : 'Coming Soon'}
            </div>
          </button>
        </div>

        {/* Toast 提示 */}
        {showToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a2e] text-amber-300 font-black text-sm rounded-full px-5 py-3 border-[3px] border-amber-300 shadow-[3px_3px_0_0_#fbbf24] animate-pop-in whitespace-nowrap">
            {zh ? '🚧 更多场景即将上线，敬请期待！' : '🚧 More scenes coming soon!'}
          </div>
        )}
      </div>
    </div>
  );
}
