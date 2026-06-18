// 段位配置
// ------ 分数到段位的映射集中在这里
import type { Level, OptionLevel } from './types';

export const levels: Level[] = [
  {
    name: '抗压之王',
    tag: '反杀型情商天花板',
    emoji: '🔥',
    minScore: 100,
    maxScore: 100,
    slogan: '清醒自保，社交主动权掌控者',
    descModule: {
      core: '不走讨好型社交，擅长有理有节软反击，面对催婚、职场PUA、道德绑架不内耗；既不会撕破脸吵架，又能守住个人边界，把社交节奏牢牢握在自己手里，是当代稀缺的"情绪自给型人格"',
      history: '对标东方朔：汉武帝朝堂第一谐臣，敢于调侃帝王、巧妙怼人自保，说话有分寸、反击有底线，一辈子不得罪人还顺遂无忧，完美契合"温和反制、进退自由"的社交模式',
      comment: '亲戚催婚局、老板画饼局、客户施压局全能拆招，专治无效盘问与精神消耗；别人拿捏不了你的情绪，你却能轻松拿捏全场氛围',
    },
    socialCopy: '别人忙着人情世故，我忙着守住自己舒服的边界，本季社交整顿选手就位🔥',
  },
  {
    name: '情商之神',
    tag: '圆融型社交天花板',
    emoji: '👑',
    minScore: 90,
    maxScore: 99,
    slogan: '面面俱到，人情世故操盘手',
    descModule: {
      core: '全局思维型社交，说话滴水不漏；既能照顾所有人面子，委婉规避矛盾，又不动声色达成自身诉求，全场所有人都觉得舒服，挑不出半句毛病，是传统意义上的顶级社交高手',
      history: '对标诸葛亮：周旋东吴、蜀汉多方势力，斡旋人际顾全大局，遇事谋定而后动，权衡利弊给出最优话术方案，擅长化解僵局、拉拢人心',
      comment: '商务酒局、职场博弈、家族饭局通杀，人缘积累速度拉满，谈合作、升职、维系人脉天生自带优势',
    },
    socialCopy: '行走的人际关系教科书，但凡有我在，就没有聊崩的局👑',
  },
  {
    name: '情商达人',
    tag: '人情世故熟手',
    emoji: '😎',
    minScore: 70,
    maxScore: 89,
    slogan: '会接会捧，常规社交游刃有余',
    descModule: {
      core: '察言观色能力在线，懂场面话、会捧场圆场，熟悉世俗社交规则；主动规避大部分社交雷区，不会刻意讨好，也不会莽撞得罪人，是现实里最吃香的普通人类型',
      history: '对标王熙凤：大观园人情通透第一人，活络气氛、左右逢源，待人接物圆滑活络，日常饭局、人情往来处理得滴水不漏',
      comment: '同事相处、亲戚闲聊、普通应酬基本稳不出错；仅极端刁钻连环拷问容易卡壳，稍加打磨就能冲击社交天花板',
    },
    socialCopy: '日常社交基本稳赢，偶尔小翻车，但绝不社死😎',
  },
  {
    name: '及格选手',
    tag: '保守型安全玩家',
    emoji: '😅',
    minScore: 40,
    maxScore: 69,
    slogan: '不求出彩，但求不惹麻烦',
    descModule: {
      core: '被动型保守社交，回答四平八稳中庸不出错；不爱主动经营人情，也不愿顶撞别人，遇事习惯性妥协避让，属于人群里没存在感的"安全路人"',
      history: '对标鲁肃：忠厚稳重、处事求稳，做人本分不爱争抢矛盾，只求团队安稳不出乱子，缺少主动盘活局面的魄力',
      comment: '普通闲聊勉强过关，面对阴阳怪气、灵魂拷问极易慌乱冷场，时不时小幅社死，但不会闹出无法收场的大尴尬',
    },
    socialCopy: '社交苟住型选手，不出错就是我的最大胜利😅',
  },
  {
    name: '直球原生态选手',
    tag: '耿直嘴快选手',
    emoji: '💀',
    minScore: 0,
    maxScore: 39,
    slogan: '心口直给，聊天终结者体质',
    descModule: {
      core: '思维前置、说话不过滤，本性善良没有坏心眼，但表达直白莽撞；经常无意间戳中别人痛点，一句话聊死全场，事后才反应过来自己说错话，被动触发社死名场面',
      history: '对标李逵：性情坦率有啥说啥，本心纯粹，但口无遮拦容易惹祸伤人，得罪人自己往往后知后觉',
      comment: '亲戚盘问、职场问话高频翻车，社死常客；建议养成"开口慢三秒"习惯，先思考再发言，大幅降低尴尬概率',
    },
    socialCopy: '主打一个真诚坦荡，嘴比脑子跑得快，社死专业户本人💀',
  },
];

/** 根据分数拿到 Level */
export function getLevel(score: number): Level {
  for (const level of levels) {
    if (score >= level.minScore && score <= level.maxScore) {
      return level;
    }
  }
  return levels[levels.length - 1];
}

// OptionLevel -> Level 映射（用于选项直接判分后直接拿到 Level）
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

// ---------- UI 辅助：等级渐变配色 ----------
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

export const levelLabel: Record<OptionLevel, string> = {
  anti: '抗压之王',
  god: '情商之神',
  high: '情商达人',
  medium: '及格选手',
  low: '原生态直球',
};
