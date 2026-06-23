import type { Level, OptionLevel } from './types';

export const levels: Level[] = [
  {
    name: {
      zh: '抗压之王',
      en: 'Master of Pushback',
    },
    tag: {
      zh: '反杀型情商天花板',
      en: 'Counter-attack EQ zenith',
    },
    emoji: '🔥',
    minScore: 100,
    maxScore: 100,
    slogan: {
      zh: '清醒自保，社交主动权掌控者',
      en: 'Clear-eyed, self-protecting — you control the room',
    },
    descModule: {
      core: {
        zh: '不走讨好型社交，擅长有理有节软反击，面对催婚、职场PUA、道德绑架不内耗；既不会撕破脸吵架，又能守住个人边界，把社交节奏牢牢握在自己手里，是当代稀缺的"情绪自给型人格"',
        en: "You reject people-pleasing and master gentle, firm pushback. Against marriage pressure, workplace manipulation, or moral guilt-tripping — you stay emotionally intact. No drama, no shouting, just clear boundaries and total control of the interaction. A rare 'emotionally self-sufficient' personality.",
      },
      history: {
        zh: '对标东方朔：汉武帝朝堂第一谐臣，敢于调侃帝王、巧妙怼人自保，说话有分寸、反击有底线，一辈子不得罪人还顺遂无忧，完美契合"温和反制、进退自由"的社交模式',
        en: 'Ancient parallel: Dongfang Shuo, the witty court scholar under Emperor Wu of Han. Dared to tease the emperor and cleverly parried attacks — always with tact and limits. Never made enemies, lived long and prospered. The very model of "gentle counterplay, free to advance or retreat."',
      },
      comment: {
        zh: '亲戚催婚局、老板画饼局、客户施压局全能拆招，专治无效盘问与精神消耗；别人拿捏不了你的情绪，你却能轻松拿捏全场氛围',
        en: 'Relative interrogations, boss pie-in-the-sky meetings, client pressure tactics — you dismantle them all. No one can mess with your mood. You set the vibe of every room you walk into.',
      },
    },
    socialCopy: {
      zh: '别人忙着人情世故，我忙着守住自己舒服的边界。本季社交整顿 MVP 就位，专治各种无效盘问🔥',
      en: "Everyone else is busy performing social niceties — I'm busy defending my peace. This season's Social Cleanup MVP, specialist in shutting down nonsense 🔥",
    },
    recos: [
      {
        icon: '📖',
        title: { zh: '《沉思录》 马可·奥勒留', en: 'Meditations · Marcus Aurelius' },
        desc: {
          zh: '罗马皇帝写的人生修养日记，讲的不是怎么讨好别人，而是怎么在混乱里守住自己的情绪和原则。当你已经不需要证明什么时，"稳"就是最高阶的社交优势。',
          en: 'A Roman emperor\'s private journal on self-discipline and principle. Not about pleasing people — about keeping your ground in chaos. When nothing can rattle you, "steadiness" becomes your highest social superpower.',
        },
      },
      {
        icon: '🎬',
        title: { zh: '《教父》 The Godfather', en: 'The Godfather' },
        desc: {
          zh: '不是教你当黑帮，是教你看懂"话里有话"。高级的社交从来不是说得多，而是知道什么话不说、什么时候说、用什么身份说。每一场对话都是谋局的艺术，100分选手的高阶参考书。',
          en: 'Not about being a gangster — about reading subtext. High-end socializing isn\'t about talking more; it\'s about knowing what NOT to say, when to say it, and which persona to say it as. Every conversation is a chess move. Required viewing for 100-point operators.',
        },
      },
    ],
  },
  {
    name: {
      zh: '情商之神',
      en: 'EQ Deity',
    },
    tag: {
      zh: '圆融型社交天花板',
      en: 'Smooth operator supreme',
    },
    emoji: '👑',
    minScore: 90,
    maxScore: 99,
    slogan: {
      zh: '面面俱到，人情世故操盘手',
      en: 'Everyone feels good, nothing feels forced',
    },
    descModule: {
      core: {
        zh: '全局思维型社交，说话滴水不漏；既能照顾所有人面子，委婉规避矛盾，又不动声色达成自身诉求，全场所有人都觉得舒服，挑不出半句毛病，是传统意义上的顶级社交高手',
        en: 'A big-picture thinker in every interaction — your words are seamless. You protect everyone\'s dignity while gracefully reaching your own goals. Everyone in the room leaves feeling good. A true master of the social game, the old-school kind.',
      },
      history: {
        zh: '对标诸葛亮：周旋东吴、蜀汉多方势力，斡旋人际顾全大局，遇事谋定而后动，权衡利弊给出最优话术方案，擅长化解僵局、拉拢人心',
        en: 'Ancient parallel: Zhuge Liang. Navigated Wu and Shu warring states, managed delicate politics, always thought before speaking and delivered the optimal tactical words. A genius at defusing stalemates and winning hearts.',
      },
      comment: {
        zh: '商务酒局、职场博弈、家族饭局通杀，人缘积累速度拉满，谈合作、升职、维系人脉天生自带优势',
        en: 'Business dinners, office politics, family gatherings — you thrive everywhere. Your people-reading skills are maxed; negotiating partnerships, promotions, and relationships is your natural superpower.',
      },
    },
    socialCopy: {
      zh: '行走的人际关系教科书，但凡有我在，就没有聊崩的局。社交天花板，人间清醒本醒👑',
      en: 'A walking textbook on human relations. If I\'m in the room, no conversation can go wrong. The social ceiling, walking clarity 👑',
    },
    recos: [
      {
        icon: '📖',
        title: { zh: '《孙子兵法》', en: 'The Art of War · Sun Tzu' },
        desc: {
          zh: '别觉得兵书和情商无关。高阶社交本质是人心与利害的博弈——知己知彼、不战而屈人之兵。当你已经能做到说话滴水不漏，读这本能帮你从被动接招变成主动控场，不止会说话，更会谋局。',
          en: 'Don\'t dismiss a military manual. High-level socializing is, at its core, a game of perception and stakes — know yourself, know your opponent, win without fighting. When you already speak flawlessly, this book moves you from reacting to controlling the room.',
        },
      },
      {
        icon: '🎬',
        title: { zh: '《让子弹飞》', en: 'Let the Bullets Fly' },
        desc: {
          zh: '中式人情世故的顶级实景教学。全是话里有话的潜台词、明暗交错的利益拉扯，每一句对话、每一个场面都是处世智慧的博弈。常刷常新，高阶情商的中式范本。',
          en: 'A masterclass in Chinese-style personal politics. Loaded with subtext, double meanings, and shifting stakes — every conversation is a tactical exchange. You pick up new nuances every rewatch. The definitive reference for the advanced EQ operator.',
        },
      },
    ],
  },
  {
    name: {
      zh: '情商达人',
      en: 'EQ Proficient',
    },
    tag: {
      zh: '人情世故熟手',
      en: 'Veteran social operator',
    },
    emoji: '😎',
    minScore: 70,
    maxScore: 89,
    slogan: {
      zh: '会接会捧，常规社交游刃有余',
      en: 'Great comebacks, great flattery, standard socializing handled',
    },
    descModule: {
      core: {
        zh: '察言观色能力在线，懂场面话、会捧场圆场，熟悉世俗社交规则；主动规避大部分社交雷区，不会刻意讨好，也不会莽撞得罪人，是现实里最吃香的普通人类型',
        en: 'You read the room, speak the right language at the right time, and know how to make people look good. You actively dodge most social landmines — not obsequious, never reckless, the type of regular person who actually goes far in life.',
      },
      history: {
        zh: '对标王熙凤：大观园人情通透第一人，活络气氛、左右逢源，待人接物圆滑活络，日常饭局、人情往来处理得滴水不漏',
        en: 'Ancient parallel: Wang Xifeng from Dream of the Red Chamber. The undisputed master of the Grand View Garden social scene — set the room on fire, charmed everyone, and navigated every nuance of daily banquets and social obligations flawlessly.',
      },
      comment: {
        zh: '同事相处、亲戚闲聊、普通应酬基本稳不出错；仅极端刁钻连环拷问容易卡壳，稍加打磨就能冲击社交天花板',
        en: 'Colleague chat, relative small-talk, standard client entertaining — basically error-free. Only extreme, rapid-fire tricky questions can throw you. A little polishing and you\'re hitting the ceiling.',
      },
    },
    socialCopy: {
      zh: '日常社交基本稳赢，偶尔小翻车但绝不社死。情商在线，氛围组组长就是我😎',
      en: 'Winning at social life on autopilot, minor missteps but never social death. EQ online, I am the vibe captain 😎',
    },
    recos: [
      {
        icon: '📖',
        title: { zh: '《沟通的艺术：看入人里，看出人外》', en: 'Looking Out, Looking In · Adler & Proctor II' },
        desc: {
          zh: '美国高校40年经典教材，不灌鸡汤、讲的是真东西：怎么表达情绪、怎么倾听、怎么识别对方的防御机制。你已经会说场面话，这本书能帮你把"稳"升级到"暖"——从不错，变成让人印象深刻。',
          en: 'A 40-year classic in US communication studies. No fluff — straight tools for expressing emotion, active listening, and recognizing defensive patterns. You already say the right things; this book turns "polished" into "warm and memorable."',
        },
      },
      {
        icon: '🎬',
        title: { zh: '《布达佩斯大饭店》 The Grand Budapest Hotel', en: 'The Grand Budapest Hotel' },
        desc: {
          zh: '精致的人情世故里藏着最优雅的社交示范：门童零如何在各种大人物中间保持体面、化解窘境。节奏明快、画面讲究，学的不是话术，是"得体感"——一种让人舒服的高级气场。',
          en: 'A masterclass in elegant social performance under pressure. Watch how Zero the lobby boy navigates powerful personalities, defuses awkwardness, and keeps his dignity. You\'re learning not WHAT to say, but HOW to BE — a rare, refined sense of appropriateness.',
        },
      },
    ],
  },
  {
    name: {
      zh: '及格选手',
      en: 'Barely Passing',
    },
    tag: {
      zh: '保守型安全玩家',
      en: 'Play-it-safe survivalist',
    },
    emoji: '😅',
    minScore: 40,
    maxScore: 69,
    slogan: {
      zh: '不求出彩，但求不惹麻烦',
      en: 'Not trying to shine — just trying not to explode',
    },
    descModule: {
      core: {
        zh: '被动型保守社交，回答四平八稳中庸不出错；不爱主动经营人情，也不愿顶撞别人，遇事习惯性妥协避让，属于人群里没存在感的"安全路人"',
        en: 'A cautious, reactive socializer. Your answers are safe, steady, and inoffensive. You don\'t actively cultivate relationships and hate confrontation; when pressured your instinct is to compromise and yield. The "safe nobody" in a crowd.',
      },
      history: {
        zh: '对标鲁肃：忠厚稳重、处事求稳，做人本分不爱争抢矛盾，只求团队安稳不出乱子，缺少主动盘活局面的魄力',
        en: 'Ancient parallel: Lu Su. Loyal, steady, always playing it safe. A decent person who dislikes conflict — just wants the team to survive in peace. Lacks the boldness to actively reshape a situation.',
      },
      comment: {
        zh: '普通闲聊勉强过关，面对阴阳怪气、灵魂拷问极易慌乱冷场，时不时小幅社死，但不会闹出无法收场的大尴尬',
        en: 'Casual small-talk is fine. But passive-aggressive jabs or soul-searching interrogations? Instant deer-in-headlights, awkward silence, small-to-medium social deaths — though never catastrophic ones.',
      },
    },
    socialCopy: {
      zh: '社交苟住型选手，不出错就是我的最大胜利。主打一个安全下车，稳如老狗😅',
      en: 'Survival-mode socializer — "not messing up" is my biggest win. Safe landing every time, steady as a rock 😅',
    },
    recos: [
      {
        icon: '📖',
        title: { zh: '《非暴力沟通》 马歇尔·卢森堡', en: 'Nonviolent Communication · Marshall Rosenberg' },
        desc: {
          zh: '不是教你圆滑讨好，是教你怎么精准表达、怎么听懂对方的真实需求。很多人端水端得累，本质是把"评价"当"事实"、把"想法"当"感受"。这本书能帮你把"刻意维持体面"变成"自然的共情"，社交不再靠内耗硬撑。',
          en: 'Not about being artificially "nice" — about precise expression and hearing the real need behind words. The mental exhaustion of "balancing things" usually comes from confusing judgments with facts, thoughts with feelings. This book turns forced politeness into genuine empathy.',
        },
      },
      {
        icon: '🎬',
        title: { zh: '《触不可及》（法版） Intouchables', en: 'The Intouchables' },
        desc: {
          zh: '真实事件改编，跨越阶层与身份的友情故事。最高级的情商从来不是滴水不漏的客套，是尊重、真诚和恰到好处的分寸感。全程温暖松弛，看完会自然明白：好的社交，从来不需要委屈自己迎合别人。',
          en: 'Based on a true story — an unlikely friendship across class and identity. The highest form of EQ isn\'t polished small-talk; it\'s respect, authenticity, and knowing where the line is. Warm, relaxed, zero preaching. You\'ll just get it after watching.',
        },
      },
    ],
  },
  {
    name: {
      zh: '直球原生态选手',
      en: 'Raw Straight Shooter',
    },
    tag: {
      zh: '耿直嘴快选手',
      en: 'Tongue faster than brain',
    },
    emoji: '💀',
    minScore: 0,
    maxScore: 39,
    slogan: {
      zh: '心口直给，聊天终结者体质',
      en: 'Heart to mouth, no filter, conversation killer certified',
    },
    descModule: {
      core: {
        zh: '思维前置、说话不过滤，本性善良没有坏心眼，但表达直白莽撞；经常无意间戳中别人痛点，一句话聊死全场，事后才反应过来自己说错话，被动触发社死名场面',
        en: 'Your mouth runs ahead of your brain. Kind-hearted, zero malice — but your delivery is blunt and reckless. You accidentally hit raw nerves, kill conversations with one sentence, and realize what you said wrong way too late. A walking, passive social-death trigger.',
      },
      history: {
        zh: '对标李逵：性情坦率有啥说啥，本心纯粹，但口无遮拦容易惹祸伤人，得罪人自己往往后知后觉',
        en: 'Ancient parallel: Li Kui. Straight-up, says everything on his mind, pure at heart — but his unfiltered mouth causes trouble and hurts people. Usually realizes what he did wrong only after the fact.',
      },
      comment: {
        zh: '亲戚盘问、职场问话高频翻车，社死常客；建议养成"开口慢三秒"习惯，先思考再发言，大幅降低尴尬概率',
        en: 'Relatives asking questions, bosses probing the team — you crash hard. Regularly. Try the three-second rule: think for three full seconds before speaking. Drastically reduces awkward incidents.',
      },
    },
    socialCopy: {
      zh: '主打一个真诚坦荡，嘴比脑子跑得快，社死专业户本人。但我快乐，你管我💀',
      en: "Champion of unfiltered honesty — mouth outruns brain, official spokesperson for social death. But I\'m happy, mind your own business 💀",
    },
    recos: [
      {
        icon: '📖',
        title: { zh: '《所谓情商高，就是会说话》 佐佐木圭一', en: 'It\'s About How You Say It · Keiichi Sasaki' },
        desc: {
          zh: '薄薄一本口袋小书，没有鸡汤大道理，拆解了7个措辞突破口+8个实用技巧，全是可直接套用的话术公式。比如把"我不行"换成"我可以试试"，把"你错了"换成"换个角度看"，专治直来直去的踩雷体质，看完就能避开80%的日常社死场景。',
          en: 'A slim, pocket-sized handbook with zero fluff. Seven phrasing frameworks + eight practical techniques you can literally copy-paste into daily conversation. "I can\'t do this" → "Let me give it a try." "You\'re wrong" → "Interesting — what if we look at it differently." Eliminates roughly 80% of routine social misfires.',
        },
      },
      {
        icon: '🎬',
        title: { zh: '《好好先生》 Yes Man', en: 'Yes Man' },
        desc: {
          zh: '金·凯瑞主演的轻喜剧，讲一个凡事说"不"的封闭直男，被迫对所有邀约说"Yes"的人生反转。搞笑又治愈，能直观感受到"开放的回应方式"能给社交打开多少新可能，轻松看完就能get到主动接话的底层逻辑，完全不会有说教感。',
          en: 'A Jim Carrey comedy about a closed-off "No" guy forced to say yes to every invitation for a year. Funny and heartwarming — you\'ll literally SEE how opening your response patterns reshapes social outcomes. Zero lectures, pure "learn by watching" entertainment.',
        },
      },
    ],
  },
];

// 全段位通用：彩蛋纪录片推荐
export const bonusReco = {
  icon: '🎞️',
  title: {
    zh: '《约翰·威尔逊的十万个怎么做》 How to with John Wilson',
    en: 'How to with John Wilson',
  },
  desc: {
    zh: '豆瓣9.5分的"社恐社交观察日记"，用絮絮叨叨的镜头记录纽约街头的真实社交：怎么和陌生人搭话、怎么应对聚餐AA尴尬、怎么处理闲聊冷场。没有标准答案，却满是真实的人间观察，看完会对"日常社交"有全新的松弛感理解，有趣又治愈。',
    en: 'A 9.5-rated "social-observation diary for introverts." A rambling, deadpan lens on real-life New York socializing — how to talk to strangers, how to handle splitting the check, how to survive small-talk silences. No prescriptive answers. Just raw, relatable, strangely comforting observations. Funny and therapeutic.',
  },
};

/** 根据分数拿到 Level */
export function getLevel(score: number): Level {
  for (const level of levels) {
    if (score >= level.minScore && score <= level.maxScore) {
      return level;
    }
  }
  return levels[levels.length - 1];
}

const optionLevelToIndex: Record<OptionLevel, number> = {
  anti: 0,
  god: 1,
  high: 2,
  medium: 3,
  low: 4,
};

export function getOptionLevel(optionLevel: OptionLevel): Level {
  return levels[optionLevelToIndex[optionLevel] ?? 3];
}

export const levelGradient: Record<OptionLevel, string> = {
  anti: 'from-rose-500 via-orange-500 to-rose-600',
  god: 'from-amber-300 via-yellow-400 to-amber-500',
  high: 'from-emerald-400 via-teal-500 to-cyan-600',
  medium: 'from-amber-300 via-yellow-400 to-orange-400',
  low: 'from-slate-400 via-gray-500 to-slate-600',
};

export const levelEmoji: Record<OptionLevel, string> = {
  anti: '🔥',
  god: '👑',
  high: '😎',
  medium: '😅',
  low: '💀',
};

export const levelLabel: Record<OptionLevel, { zh: string; en: string }> = {
  anti: { zh: '抗压之王', en: 'Master of Pushback' },
  god: { zh: '情商之神', en: 'EQ Deity' },
  high: { zh: '情商达人', en: 'EQ Proficient' },
  medium: { zh: '及格选手', en: 'Barely Passing' },
  low: { zh: '直球原生态选手', en: 'Raw Straight Shooter' },
};
