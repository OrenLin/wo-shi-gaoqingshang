// ============================================================
// CollectionViewer — 藏品3D模型查看器
// 使用 @google/model-viewer 展示 GLB 文件
// 特点：通过 CDN 加载，不增加打包体积，原生支持旋转交互
// ============================================================

import { useEffect } from 'react';
import { useI18n } from '../../i18n';

// 藏品数据（后续可以扩展为多个藏品）
const COLLECTION_ITEMS = [
  {
    id: 'taxi',
    name: {
      zh: '复古出租车',
      en: 'Vintage Taxi',
    },
    description: {
      zh: '一辆充满故事的老式出租车，承载着城市的记忆与温度。',
      en: 'A vintage taxi full of stories, carrying the memories and warmth of the city.',
    },
    modelPath: '/models/taxi.glb',
    poster: '/models/taxi-poster.jpg', // 可选的加载占位图
  },
];

export default function CollectionViewer() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';

  // 动态加载 model-viewer Web Component
  useEffect(() => {
    // 检查是否已加载
    if (customElements.get('model-viewer')) {
      return;
    }

    // 从 CDN 加载 model-viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      // 清理（但实际上 Web Component 不会卸载）
    };
  }, []);

  const currentItem = COLLECTION_ITEMS[0]; // 目前只有一个藏品

  return (
    <div className="animate-pop-in">
      {/* 藏品卡片 */}
      <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-4">
        {/* 藏品名称 */}
        <div className="text-center mb-3">
          <h3 className="text-lg font-black text-[#1a1a2e] mb-1">
            {zh ? currentItem.name.zh : currentItem.name.en}
          </h3>
          <p className="text-xs font-bold text-[#1a1a2e]/60">
            {zh ? currentItem.description.zh : currentItem.description.en}
          </p>
        </div>

        {/* 3D 模型查看器 */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border-[3px] border-[#1a1a2e] bg-gradient-to-br from-gray-100 to-gray-200">
          {/* @ts-ignore - model-viewer 是动态加载的 Web Component */}
          <model-viewer
            src={currentItem.modelPath}
            poster={currentItem.poster}
            alt={zh ? currentItem.name.zh : currentItem.name.en}
            camera-controls
            touch-action="pan-y"
            auto-rotate
            shadow-intensity="1"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
            }}
          >
            {/* 加载提示 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white" slot="progress-bar">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-2"></div>
                <div className="text-sm font-bold">{zh ? '加载中...' : 'Loading...'}</div>
              </div>
            </div>

            {/* 操作提示 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm pointer-events-none opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              {zh ? '👆 滑动旋转 · 双指缩放' : '👆 Swipe to rotate · Pinch to zoom'}
            </div>
          </model-viewer>
        </div>

        {/* 操作说明 */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-amber-50 rounded-lg p-2 border-[2px] border-amber-200">
            <div className="text-xl mb-0.5">👆</div>
            <div className="text-[9px] font-black text-[#1a1a2e]/70">
              {zh ? '滑动旋转' : 'Swipe'}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 border-[2px] border-orange-200">
            <div className="text-xl mb-0.5">🔍</div>
            <div className="text-[9px] font-black text-[#1a1a2e]/70">
              {zh ? '双指缩放' : 'Pinch'}
            </div>
          </div>
          <div className="bg-rose-50 rounded-lg p-2 border-[2px] border-rose-200">
            <div className="text-xl mb-0.5">🔄</div>
            <div className="text-[9px] font-black text-[#1a1a2e]/70">
              {zh ? '自动旋转' : 'Auto'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
