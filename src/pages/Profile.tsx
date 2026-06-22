import { useI18n } from '../i18n';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';

export default function Profile() {
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);
  const codename = useGameStore((s) => s.codename);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';

  // 未来功能列表
  const features = [
    {
      emoji: '📊',
      title: zh ? '报告历史' : 'Report History',
      desc: zh ? '查看你所有的情商鉴定报告' : 'View all your EQ assessment reports',
    },
    {
      emoji: '📈',
      title: zh ? '情商轨迹' : 'EQ Trajectory',
      desc: zh ? '追踪你的情商成长曲线' : 'Track your EQ growth curve over time',
    },
    {
      emoji: '💡',
      title: zh ? '个性化建议' : 'Personalized Tips',
      desc: zh ? '基于你的表现定制提升方案' : 'Tailored improvement plans based on your performance',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 px-4 py-6 pb-24">
      {/* 顶部标题区 */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-[#1a1a2e] flex items-center gap-2">
            <span aria-hidden="true">👤</span>
            {zh ? '个人中心' : 'My Profile'}
          </h1>
          <button
            onClick={() => {
              audioManager.userTapped();
              audioManager.play('click');
              setPage('home');
            }}
            aria-label={zh ? '返回首页' : 'Back to home'}
            className="inline-flex items-center gap-1 bg-white border-[3px] border-[#1a1a2e] rounded-full px-3 py-1.5 shadow-[2px_2px_0_0_#1a1a2e] font-black text-sm text-[#1a1a2e] transition-transform active:scale-95 hover:scale-105"
          >
            <span aria-hidden="true">←</span>
            {zh ? '首页' : 'Home'}
          </button>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 mb-5 animate-pop-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-[3px] border-[#1a1a2e] flex items-center justify-center text-3xl" aria-hidden="true">
              🧑
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-[#1a1a2e]/50">
                {zh ? '代号' : 'Codename'}
              </div>
              <div className="text-xl font-black text-[#1a1a2e]">
                {codename || (zh ? '匿名高手' : 'Anonymous Pro')}
              </div>
            </div>
          </div>
        </div>

        {/* 即将上线横幅 */}
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 mb-5 text-center animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-5xl mb-2 animate-bounce" style={{ animationDuration: '1.5s' }} aria-hidden="true">🚧</div>
          <div className="text-xl font-black mb-1">{zh ? '即将上线' : 'Coming Soon'}</div>
          <div className="text-sm font-bold opacity-90">
            {zh ? '我们正在精心打造个人中心功能' : 'We\'re crafting your personal center'}
          </div>
        </div>

        {/* 未来功能预告 */}
        <div className="space-y-3">
          <div className="text-sm font-black text-[#1a1a2e]/60 px-1">
            {zh ? '🎁 未来功能预告' : '🎁 Upcoming Features'}
          </div>
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/70 rounded-2xl border-[3px] border-[#1a1a2e]/20 p-4 flex items-center gap-3 animate-pop-in"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 border-[2px] border-[#1a1a2e]/20 flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
                {f.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm text-[#1a1a2e]">{f.title}</div>
                <div className="text-xs font-bold text-[#1a1a2e]/50">{f.desc}</div>
              </div>
              <div className="text-2xl flex-shrink-0 opacity-40" aria-hidden="true">🔒</div>
            </div>
          ))}
        </div>

        {/* 底部鼓励语 */}
        <div className="mt-6 text-center text-xs font-bold text-[#1a1a2e]/40">
          {zh ? '✨ 先去挑战场景，积累你的情商数据吧！' : '✨ Go challenge some scenes and build your EQ data!'}
        </div>
      </div>
    </div>
  );
}
