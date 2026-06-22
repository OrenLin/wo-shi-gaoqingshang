// ======================================================================
// 焦虑急救问卷 —— 搞怪解压风格 + 4 条哲学路径
// ----------------------------------------------------------------------
// 路径理论基础：
//   stoic    斯多葛哲学（马可·奥勒留《沉思录》·控制二分法）
//   zen      禅宗（正念呼吸·《心经》·放下执念）
//   cognitive 认知行为疗法（Burns《伯恩斯新情绪疗法》·ABCDE 模型）
//   social   社交支持（人际关系疗法·倾诉与社群）
// ======================================================================

export type PathType = 'stoic' | 'zen' | 'cognitive' | 'social';

export interface AnxietyOption {
  id: string;
  text: { zh: string; en: string };
  emoji: string;
  scores: Record<PathType, number>;
}

export interface AnxietyQuestion {
  id: string;
  question: { zh: string; en: string };
  options: AnxietyOption[];
}

export interface PathResult {
  type: PathType;
  emoji: string;
  name: { zh: string; en: string };
  philosophy: { zh: string; en: string };
  framework: { zh: string; en: string };
  actions: { zh: string; en: string }[];
  book: { title: { zh: string; en: string }; author: { zh: string; en: string } };
}

// ======================================================================
// 8 道搞怪题目
// ======================================================================
export const ANXIETY_QUESTIONS: AnxietyQuestion[] = [
  {
    id: 'q1',
    question: {
      zh: '半夜三点突然醒来，脑子里开始循环播放明天的尴尬事，你会？',
      en: 'You wake up at 3 AM and your brain starts looping tomorrow\'s awkward moments. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '告诉自己"控制不了的就别想了"，翻身继续睡', en: 'Tell yourself "can\'t control it, let it go" and go back to sleep' },
        scores: { stoic: 3, zen: 1, cognitive: 0, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '深呼吸 4-7-8，数呼吸次数让自己平静', en: 'Breathe 4-7-8, count breaths to calm down' },
        scores: { stoic: 0, zen: 3, cognitive: 1, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '把焦虑写下来，分析"最坏情况是什么"', en: 'Write down the anxiety, analyze "what\'s the worst case"' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '打开手机给闺蜜/兄弟发消息吐槽', en: 'Grab your phone and vent to your bestie' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q2',
    question: {
      zh: '老板又双叒加需求，而且今晚就要，你的第一反应？',
      en: 'Boss adds ANOTHER requirement due tonight. Your first reaction?',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"我能控制的只有我的工作质量"，专注做事', en: '"I can only control my work quality", focus on doing' },
        scores: { stoic: 3, zen: 0, cognitive: 1, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '先去茶水间倒杯水，闭眼 30 秒', en: 'Get water first, close eyes for 30 seconds' },
        scores: { stoic: 0, zen: 3, cognitive: 0, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '列清单：哪些必须做、哪些可以推、哪些能简化', en: 'Make a list: must-do, push-back, simplify' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '找同事吐槽"老板是不是疯了"，寻求共鸣', en: 'Vent to colleagues "is the boss crazy?", seek resonance' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q3',
    question: {
      zh: '相亲对象已读不回 3 天了，你会？',
      en: 'Your date has left you on read for 3 days. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"对方的反应不是我能控制的"，放下继续生活', en: '"Their reaction isn\'t mine to control", move on' },
        scores: { stoic: 3, zen: 1, cognitive: 0, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '冥想 10 分钟，观察自己的情绪而不评判', en: 'Meditate 10 min, observe emotions without judgment' },
        scores: { stoic: 0, zen: 3, cognitive: 1, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '分析"已读不回"的 5 种可能，理性评估', en: 'Analyze 5 possible reasons for being left on read' },
        scores: { stoic: 0, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '约朋友出来喝一杯，让她/他帮你分析', en: 'Ask a friend out for drinks to analyze together' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q4',
    question: {
      zh: '同事当众甩锅给你，你会？',
      en: 'A colleague publicly throws you under the bus. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"我知道真相即可，不必当众争辩"，事后单独沟通', en: '"I know the truth, no need to argue publicly", talk privately later' },
        scores: { stoic: 3, zen: 0, cognitive: 1, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '深呼吸，先让自己冷静下来再回应', en: 'Breathe deeply, calm down before responding' },
        scores: { stoic: 0, zen: 3, cognitive: 0, social: 1 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '用事实和数据反驳，"根据邮件记录..."', en: 'Refute with facts: "According to the email..."' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '找信任的同事商量对策，寻求支持', en: 'Discuss strategy with a trusted colleague' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q5',
    question: {
      zh: '周一早上闹钟响，瞬间不想上班，你会？',
      en: 'Monday morning alarm rings, instant "don\'t want to work" feeling. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"工作是我的选择，我选择负责"，起床', en: '"Work is my choice, I choose responsibility", get up' },
        scores: { stoic: 3, zen: 0, cognitive: 1, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '做 5 分钟晨间冥想，设定今日意图', en: '5-min morning meditation, set today\'s intention' },
        scores: { stoic: 0, zen: 3, cognitive: 0, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '列出今天 3 件值得期待的小事', en: 'List 3 small things to look forward to today' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '和同事约好一起吃早餐，有动力起床', en: 'Plan breakfast with a colleague, motivation to get up' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q6',
    question: {
      zh: '看到朋友圈别人晒旅游/晒娃/晒成就，你会？',
      en: 'Seeing friends post travel/kids/achievements on social media. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"别人的生活与我无关"，关掉手机做自己的事', en: '"Others\' lives are not my concern", put phone away' },
        scores: { stoic: 3, zen: 1, cognitive: 0, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '观察自己的嫉妒情绪，不评判地接纳', en: 'Observe your envy without judgment, accept it' },
        scores: { stoic: 0, zen: 3, cognitive: 1, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '提醒自己"朋友圈是精选集，不是全貌"', en: 'Remind yourself "social media is a highlight reel"' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '给对方点赞评论，真心为朋友高兴', en: 'Like and comment, genuinely happy for them' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q7',
    question: {
      zh: '考试/汇报前紧张到手心出汗，你会？',
      en: 'Sweaty palms before an exam/presentation. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"紧张是正常的，我已做好准备"', en: '"Nervousness is normal, I\'m prepared"' },
        scores: { stoic: 3, zen: 0, cognitive: 1, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '做 4-7-8 呼吸法 3 次，平复心率', en: 'Do 4-7-8 breathing 3 times to steady heart rate' },
        scores: { stoic: 0, zen: 3, cognitive: 0, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '把紧张重新定义为"兴奋"，告诉自己"我很期待"', en: 'Reframe nervousness as excitement: "I\'m excited"' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '找同学/同事互相鼓励打气', en: 'Find a classmate/colleague to encourage each other' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
  {
    id: 'q8',
    question: {
      zh: '连续加班一周，身心俱疲，你会？',
      en: 'After a week of overtime, physically and mentally drained. You:',
    },
    options: [
      {
        id: 'a', emoji: '🛡️',
        text: { zh: '"疲惫是暂时的，坚持有意义的目标"', en: '"Fatigue is temporary, persist for meaningful goals"' },
        scores: { stoic: 3, zen: 0, cognitive: 1, social: 0 },
      },
      {
        id: 'b', emoji: '🧘',
        text: { zh: '周末彻底放空，做瑜伽/冥想/泡澡', en: 'Weekend total reset: yoga/meditation/bath' },
        scores: { stoic: 0, zen: 3, cognitive: 0, social: 0 },
      },
      {
        id: 'c', emoji: '🧠',
        text: { zh: '复盘这周，找出可优化的工作流程', en: 'Review the week, find optimizable workflows' },
        scores: { stoic: 1, zen: 0, cognitive: 3, social: 0 },
      },
      {
        id: 'd', emoji: '🤝',
        text: { zh: '约三五好友聚餐吐槽，释放压力', en: 'Gather friends for dinner and venting' },
        scores: { stoic: 0, zen: 0, cognitive: 0, social: 3 },
      },
    ],
  },
];

// ======================================================================
// 4 条路径结果
// ======================================================================
export const PATH_RESULTS: Record<PathType, PathResult> = {
  stoic: {
    type: 'stoic',
    emoji: '🏛️',
    name: { zh: '斯多葛路径', en: 'Stoic Path' },
    philosophy: {
      zh: '斯多葛哲学的核心是"控制二分法"：区分什么是你能控制的，什么是你不能控制的。把精力集中在前者，对后者保持平静。',
      en: 'The core of Stoicism is the "dichotomy of control": distinguish what you can control from what you cannot. Focus energy on the former, remain calm about the latter.',
    },
    framework: {
      zh: '马可·奥勒留在《沉思录》中写道："如果你因外部事物而痛苦，那不是事物本身让你痛苦，而是你对它的判断。"焦虑往往来自我们试图控制不可控的事物。',
      en: 'Marcus Aurelius wrote in "Meditations": "If you are pained by external things, it is not they that disturb you, but your own judgment of them." Anxiety often comes from trying to control the uncontrollable.',
    },
    actions: [
      { zh: '每日晨间"控制二分法"练习：列出今日焦虑的事，标注"可控/不可控"', en: 'Morning dichotomy-of-control practice: list today\'s anxieties, mark controllable/uncontrollable' },
      { zh: '焦虑时问自己："这件事我能控制吗？能，就行动；不能，就放下"', en: 'When anxious, ask: "Can I control this? If yes, act; if no, let go"' },
      { zh: '睡前写"感恩三件事"，培养接纳心态', en: 'Write 3 gratitudes before bed, cultivate acceptance' },
    ],
    book: {
      title: { zh: '沉思录', en: 'Meditations' },
      author: { zh: '马可·奥勒留', en: 'Marcus Aurelius' },
    },
  },
  zen: {
    type: 'zen',
    emoji: '🧘',
    name: { zh: '禅宗路径', en: 'Zen Path' },
    philosophy: {
      zh: '禅宗强调"活在当下"，不执著于过去的遗憾和未来的焦虑。《心经》云："心无挂碍，无挂碍故，无有恐怖。"',
      en: 'Zen emphasizes "living in the present", without clinging to past regrets or future anxieties. The Heart Sutra says: "With no obstacles in mind, no fear exists."',
    },
    framework: {
      zh: '正念呼吸是禅修的基础。4-7-8 呼吸法（吸气 4 秒、屏息 7 秒、呼气 8 秒）能激活副交感神经，快速平复焦虑。',
      en: 'Mindful breathing is the foundation of Zen practice. The 4-7-8 method (inhale 4s, hold 7s, exhale 8s) activates the parasympathetic nervous system, quickly calming anxiety.',
    },
    actions: [
      { zh: '每日 10 分钟正念冥想：观察呼吸，走神时温柔地拉回', en: '10-min daily mindfulness meditation: observe breath, gently return when distracted' },
      { zh: '焦虑时做 3 轮 4-7-8 呼吸法', en: 'Do 3 rounds of 4-7-8 breathing when anxious' },
      { zh: '尝试"行禅"：走路时专注感受脚底触地', en: 'Try walking meditation: focus on soles touching ground' },
    ],
    book: {
      title: { zh: '正念的奇迹', en: 'The Miracle of Mindfulness' },
      author: { zh: '一行禅师', en: 'Thich Nhat Hanh' },
    },
  },
  cognitive: {
    type: 'cognitive',
    emoji: '🧠',
    name: { zh: '认知行为路径', en: 'Cognitive Behavioral Path' },
    philosophy: {
      zh: '认知行为疗法（CBT）认为：不是事件本身让我们焦虑，而是我们对事件的"认知扭曲"导致焦虑。识别并重构这些扭曲思维，焦虑自然缓解。',
      en: 'Cognitive Behavioral Therapy (CBT) holds: events don\'t cause anxiety, our "cognitive distortions" about them do. Identify and reframe these distortions, anxiety naturally eases.',
    },
    framework: {
      zh: 'ABCDE 模型：A 事件 → B 信念 → C 后果 → D 辩驳 → E 新效果。当你焦虑时，写下这五步，会发现很多焦虑源于不合理的信念。',
      en: 'ABCDE Model: A (Activating event) → B (Belief) → C (Consequence) → D (Dispute) → E (New Effect). When anxious, write these 5 steps; you\'ll find much anxiety stems from irrational beliefs.',
    },
    actions: [
      { zh: '焦虑时用 ABCDE 模型记录：事件、信念、后果、辩驳、新效果', en: 'When anxious, record with ABCDE: event, belief, consequence, dispute, new effect' },
      { zh: '识别常见认知扭曲：灾难化、非黑即白、过度概括、读心术', en: 'Identify common distortions: catastrophizing, all-or-nothing, overgeneralization, mind-reading' },
      { zh: '每周写一次"焦虑日记"，回顾并重构思维模式', en: 'Weekly anxiety journal, review and reframe thought patterns' },
    ],
    book: {
      title: { zh: '伯恩斯新情绪疗法', en: 'Feeling Good: The New Mood Therapy' },
      author: { zh: '大卫·伯恩斯', en: 'David D. Burns' },
    },
  },
  social: {
    type: 'social',
    emoji: '🤝',
    name: { zh: '社交支持路径', en: 'Social Support Path' },
    philosophy: {
      zh: '人是社会性动物。哈佛大学 85 年追踪研究发现：良好的人际关系是幸福感最强的预测因素。焦虑时不要独自承受，连接本身就是疗愈。',
      en: 'Humans are social creatures. Harvard\'s 85-year study found: quality relationships are the strongest predictor of happiness. Don\'t bear anxiety alone; connection itself is healing.',
    },
    framework: {
      zh: '倾诉不是软弱，而是智慧。但要注意"有效倾诉"：选择信任的人、明确表达需要（建议还是倾听）、控制时长避免变成纯抱怨。',
      en: 'Venting isn\'t weakness, it\'s wisdom. But practice "effective venting": choose trusted people, clarify your need (advice or listening), control duration to avoid pure complaining.',
    },
    actions: [
      { zh: '建立"3 人支持网络"：家人、朋友、同事各一位，定期交流', en: 'Build a "3-person support network": one family, one friend, one colleague' },
      { zh: '焦虑时主动约人面谈，比线上聊天更有效', en: 'When anxious, meet in person — more effective than online chat' },
      { zh: '加入兴趣社群（读书会/运动群），拓展弱连接社交', en: 'Join interest communities (book clubs/sports), expand weak-tie socializing' },
    ],
    book: {
      title: { zh: '亲密关系', en: 'Close Relationships' },
      author: { zh: '罗兰·米勒', en: 'Rowland S. Miller' },
    },
  },
};

// ======================================================================
// 评分逻辑
// ======================================================================
export interface QuizResult {
  primary: PathResult;
  secondary: PathResult;
  scores: Record<PathType, number>;
}

export function calculatePath(answers: string[]): QuizResult {
  const scores: Record<PathType, number> = { stoic: 0, zen: 0, cognitive: 0, social: 0 };

  answers.forEach((answerId, qIdx) => {
    const question = ANXIETY_QUESTIONS[qIdx];
    if (!question) return;
    const option = question.options.find((o) => o.id === answerId);
    if (!option) return;
    (Object.keys(option.scores) as PathType[]).forEach((k) => {
      scores[k] += option.scores[k];
    });
  });

  // 排序找主路径和次路径
  const sorted = (Object.keys(scores) as PathType[])
    .map((k) => ({ type: k, score: scores[k] }))
    .sort((a, b) => b.score - a.score);

  const primary = PATH_RESULTS[sorted[0].type];
  const secondary = PATH_RESULTS[sorted[1].type];

  return { primary, secondary, scores };
}
