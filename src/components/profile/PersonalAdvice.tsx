import { useMemo } from 'react';
import { useI18n } from '../../i18n';
import { useGameStore } from '../../store/gameStore';
import { getReportHistory } from '../../utils/reportStorage';
import { audioManager } from '../../utils/audioManager';

// 5 维度 key 类型
type DimKey = 'advocate' | 'social' | 'pressure' | 'awkward' | 'growth';

// 建议文案库：按维度 × 类别
const ADVICE_LIBRARY: Record<DimKey, {
  philosophy: { zh: string; en: string };
  emotion: { zh: string; en: string };
  health: { zh: string; en: string };
}> = {
  advocate: {
    philosophy: {
      zh: '苏格拉底说"未经审视的人生不值得过"。你的嘴替力有待提升——在开口前，先审视自己的情绪，问自己"这句话说出去会伤害谁？"',
      en: 'Socrates said "the unexamined life is not worth living." Your advocacy needs work — before speaking, examine your emotions and ask "who will this hurt?"',
    },
    emotion: {
      zh: '练习"三秒法则"：听到刺激的话后，深呼吸三秒再回应。这三秒能让你的杏仁核从战斗模式切换到理性模式。',
      en: 'Practice the "3-second rule": after hearing something provocative, take 3 deep breaths before responding. This shifts your amygdala from fight mode to rational mode.',
    },
    health: {
      zh: '每天早晨喝一杯温水，激活副交感神经。研究表明，充足的水分摄入能提升 15% 的情绪稳定性。',
      en: 'Drink a glass of warm water every morning to activate your parasympathetic nervous system. Studies show proper hydration improves emotional stability by 15%.',
    },
  },
  social: {
    philosophy: {
      zh: '亚里士多德说"人是政治的动物"。社交力不足意味着你在群体中缺少存在感——尝试每天主动问候一个人，重建你的社交肌肉。',
      en: 'Aristotle said "man is a political animal." Low social skills means you lack presence in groups — try greeting one person proactively each day to rebuild your social muscle.',
    },
    emotion: {
      zh: '使用"镜像倾听法"：对方说完后，先用"你的意思是..."复述一遍再表达自己。这能让对方感到被理解，降低社交焦虑。',
      en: 'Use "mirror listening": after someone speaks, restate with "so you mean..." before expressing yourself. This makes others feel understood and reduces social anxiety.',
    },
    health: {
      zh: '每周进行 2 次有氧运动（慢跑/游泳 30 分钟），运动释放的内啡肽是天然的社交润滑剂。',
      en: 'Do aerobic exercise twice a week (jogging/swimming 30 min). Endorphins released are a natural social lubricant.',
    },
  },
  pressure: {
    philosophy: {
      zh: '尼采说"杀不死我的使我更强大"。你的抗压力偏弱——将每次压力视为肌肉训练，而非威胁。压力是成长的催化剂。',
      en: 'Nietzsche said "what doesn\'t kill me makes me stronger." Your stress resistance is weak — treat each pressure as muscle training, not threat. Stress is a catalyst for growth.',
    },
    emotion: {
      zh: '学习"认知重评"：把"我完蛋了"重构为"这是一个挑战"。语言塑造思维，思维决定情绪。',
      en: 'Learn "cognitive reappraisal": reframe "I\'m doomed" to "this is a challenge." Language shapes thought, thought determines emotion.',
    },
    health: {
      zh: '保证每天 7-8 小时睡眠。睡眠不足会让皮质醇（压力激素）升高 37%，直接削弱你的抗压能力。',
      en: 'Ensure 7-8 hours of sleep daily. Sleep deprivation raises cortisol (stress hormone) by 37%, directly weakening your stress resistance.',
    },
  },
  awkward: {
    philosophy: {
      zh: '庄子说"无用之用，方为大用"。社死预警高说明你太在意他人评价——学会接纳尴尬，它不是缺陷，而是真实人性的证明。',
      en: 'Zhuangzi said "the usefulness of the useless is the greatest usefulness." High awkwardness means you care too much about others\' judgment — learn to embrace awkwardness, it\'s not a flaw but proof of authentic humanity.',
    },
    emotion: {
      zh: '练习"尴尬暴露疗法"：故意做一个小尴尬的事（如在公共场合大声点错菜名），发现天没塌下来，脱敏就完成了。',
      en: 'Practice "awkwardness exposure therapy": deliberately do something mildly awkward (like mispronouncing a dish name in public). When the sky doesn\'t fall, desensitization is complete.',
    },
    health: {
      zh: '减少咖啡因摄入。过量咖啡因会放大焦虑感，让你在社交场合更容易紧张出汗。改喝洋甘菊茶 calming。',
      en: 'Reduce caffeine intake. Excess caffeine amplifies anxiety, making you more nervous in social situations. Switch to chamomile tea.',
    },
  },
  growth: {
    philosophy: {
      zh: '王阳明说"知行合一"。成长值不足说明你知行脱节——每天写下一件"今天学到了什么"，让成长可见化。',
      en: 'Wang Yangming said "unity of knowledge and action." Low growth means your knowledge and action are disconnected — write down "what I learned today" daily to make growth visible.',
    },
    emotion: {
      zh: '建立"成长日记"：每晚花 5 分钟记录今天的进步（哪怕很小）。持续 21 天，大脑会形成成长型思维回路。',
      en: 'Build a "growth journal": spend 5 min each night recording today\'s progress (even small). After 21 days, your brain forms a growth-mindset circuit.',
    },
    health: {
      zh: '尝试间歇性断食（16:8 模式）。研究证实，适度断食能促进脑源性神经营养因子(BDNF)分泌，提升学习记忆能力。',
      en: 'Try intermittent fasting (16:8). Studies confirm moderate fasting boosts BDNF secretion, improving learning and memory.',
    },
  },
};

// 通用建议（无数据时）
const GENERAL_ADVICE = {
  philosophy: {
    zh: '孔子说"己所不欲，勿施于人"。情商的起点是同理心——在评判他人前，先站在对方的角度想一想。',
    en: 'Confucius said "do not do unto others what you don\'t want done to you." The starting point of EQ is empathy — before judging others, put yourself in their shoes.',
  },
  emotion: {
    zh: '每天进行 10 分钟正念冥想。关注呼吸，观察情绪而不评判。这是提升情商最有效的科学方法之一。',
    en: 'Practice 10 minutes of mindfulness meditation daily. Focus on breathing, observe emotions without judgment. This is one of the most effective scientific methods for improving EQ.',
  },
  health: {
    zh: '保持规律作息和适度运动。身心一体，身体的健康是情绪稳定的基石。',
    en: 'Maintain a regular schedule and moderate exercise. Body and mind are one; physical health is the foundation of emotional stability.',
  },
};

export default function PersonalAdvice() {
  const language = useI18n((s) => s.language);
  const setPage = useGameStore((s) => s.setPage);
  const zh = language === 'zh';

  const reports = useMemo(() => getReportHistory(), []);

  // 汇总 5 维数据，找最弱维度
  const { weakestDim, hasData } = useMemo(() => {
    if (reports.length === 0) {
      return { weakestDim: null as DimKey | null, hasData: false };
    }
    // 汇总所有报告的维度平均值
    const dimSums: Record<string, number> = {};
    const dimCounts: Record<string, number> = {};
    for (const r of reports) {
      for (const d of r.dims) {
        dimSums[d.key] = (dimSums[d.key] ?? 0) + d.value;
        dimCounts[d.key] = (dimCounts[d.key] ?? 0) + 1;
      }
    }
    const dimAvgs: Record<string, number> = {};
    for (const key of Object.keys(dimSums)) {
      dimAvgs[key] = dimSums[key] / dimCounts[key];
    }
    // 找最低维度
    let weakest: DimKey | null = null;
    let minVal = Infinity;
    for (const key of Object.keys(dimAvgs) as DimKey[]) {
      if (dimAvgs[key] < minVal) {
        minVal = dimAvgs[key];
        weakest = key;
      }
    }
    return { weakestDim: weakest, hasData: true };
  }, [reports]);

  // 获取建议文案
  const adviceSource = weakestDim && hasData ? ADVICE_LIBRARY[weakestDim] : GENERAL_ADVICE;
  const weakestLabel = weakestDim && hasData
    ? (zh
      ? { advocate: '嘴替力', social: '社交力', pressure: '抗压力', awkward: '社死预警', growth: '成长值' }[weakestDim]
      : { advocate: 'Advocate', social: 'Social', pressure: 'Pressure', awkward: 'Awkward', growth: 'Growth' }[weakestDim])
    : null;

  const cards = [
    {
      emoji: '💡',
      title: zh ? '哲学分析' : 'Philosophy',
      content: zh ? adviceSource.philosophy.zh : adviceSource.philosophy.en,
      color: 'from-amber-300 to-orange-400',
    },
    {
      emoji: '🧘',
      title: zh ? '情绪管理' : 'Emotion',
      content: zh ? adviceSource.emotion.zh : adviceSource.emotion.en,
      color: 'from-sky-300 to-blue-400',
    },
    {
      emoji: '💪',
      title: zh ? '健康管理' : 'Health',
      content: zh ? adviceSource.health.zh : adviceSource.health.en,
      color: 'from-emerald-300 to-teal-400',
    },
  ];

  return (
    <div className="space-y-3">
      {/* 最弱维度提示 */}
      {hasData && weakestLabel && (
        <div className="bg-amber-100 rounded-xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] p-3 animate-pop-in">
          <div className="text-[11px] font-black text-[#1a1a2e]">
            {zh ? `🎯 检测到你的薄弱维度：「${weakestLabel}」，以下建议为你量身定制` : `🎯 Your weakest dimension is "${weakestLabel}". The following advice is tailored for you.`}
          </div>
        </div>
      )}

      {/* 三段建议卡片 */}
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] overflow-hidden animate-pop-in"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className={`bg-gradient-to-r ${c.color} px-4 py-2 border-b-[2px] border-[#1a1a2e] flex items-center gap-2`}>
            <span className="text-xl" aria-hidden="true">{c.emoji}</span>
            <span className="font-black text-sm text-[#1a1a2e]">{c.title}</span>
          </div>
          <div className="p-4">
            <p className="text-[13px] font-bold text-[#1a1a2e]/80 leading-relaxed">
              {c.content}
            </p>
          </div>
        </div>
      ))}

      {/* 空状态引导 */}
      {!hasData && (
        <div className="bg-white/70 rounded-2xl border-[3px] border-dashed border-[#1a1a2e]/20 p-5 text-center">
          <div className="text-sm font-bold text-[#1a1a2e]/50 mb-3">
            {zh ? '完成测评后，这里会显示基于你个人数据的专属建议' : 'Complete an assessment to get personalized advice based on your data'}
          </div>
          <button
            onClick={() => {
              audioManager.userTapped();
              audioManager.play('click');
              setPage('modules');
            }}
            className="bg-amber-300 text-[#1a1a2e] font-black text-sm rounded-full px-5 py-2 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] transition-transform active:scale-95 hover:scale-105"
          >
            {zh ? '🎯 去测评' : '🎯 Start Assessment'}
          </button>
        </div>
      )}
    </div>
  );
}
