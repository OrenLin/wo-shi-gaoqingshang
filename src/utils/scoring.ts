import { getLevel } from '../data/levels';
import type { Level } from '../data/types';

export interface ScoringResult {
  score: number;
  level: Level;
  comment: { zh: string; en: string };
  tips: { zh: string; en: string };
}

// ======================================================================
// 自由输入评分体系 v2 —— 基于心理学与社会沟通学
// ----------------------------------------------------------------------
// 评分维度（每条命中加分，最高累计到 99）：
//   1. 共情 / Empathy（Goleman 情商理论、Rogers 人本主义）
//   2. 非暴力沟通 NVC（Marshall Rosenberg: 观察+感受+需要+请求）
//   3. 边界设定 / Boundary Setting（健康自我主张）
//   4. 积极重构 / Reframing（认知行为疗法 CBT）
//   5. 主动倾听 / Active Listening（Rogers 反射性倾听）
//   6. 情绪命名 / Emotion Labeling（情绪智力）
//   7. 自我披露 / Self-Disclosure（社会渗透理论）
//   8. 幽默化解 / Humor Defusion（Freud 幽默防御机制）
//   9. 社交礼仪 / Social Etiquette（Goffman 拟剧理论·面子维护）
//  10. 转折过渡 / Transition（语用学·话轮转换）
//  11. 称赞 / Compliment（积极心理学·正向反馈）
//  12. 解决导向 / Solution-Oriented（焦点解决短期治疗 SFBT）
//
// 负向维度（命中减分）：
//   - 攻击性语言 / Aggression
//   - 纯拒绝无解释 / Pure Rejection
//   - 逃避 / Avoidance
//   - 评判指责 / Judgmental
//   - 情绪勒索 / Emotional Blackmail（Forward 情感勒索）
// ======================================================================

// ---- 正向词汇库（中英文） ----
const empathyWords = [
  // 中文
  '理解', '明白', '感受', '体会', '站在', '角度', '换位', '将心比心', '感同身受',
  '担心', '在意', '关心', '心疼', '不容易', '辛苦', '难为', '委屈',
  // 英文
  'understand', 'feel', 'empathy', 'perspective', 'stand in', 'put myself',
  'appreciate', 'care about', 'concerned', 'imagine',
];

const nvcWords = [
  // 非暴力沟通：观察+感受+需要+请求
  // 中文
  '观察到', '我看到', '我注意到', '我感觉', '我感到', '我需要', '我希望', '我请求',
  '因为', '所以', '当...时', '是否可以', '能不能', '可以吗',
  // 英文
  'i observe', 'i notice', 'i feel', 'i sense', 'i need', 'i hope', 'i request',
  'would you', 'could you', 'is it possible',
];

const boundaryWords = [
  // 健康边界设定
  // 中文
  '我个人', '我的底线', '我倾向于', '我选择', '我决定', '对我来说',
  '不方便', '需要时间', '需要考虑', '暂时不能', '目前无法',
  '保留', '坚持', '原则',
  // 英文
  'personally', 'my boundary', 'i prefer', 'i choose', 'i decide',
  'not comfortable', 'need time', 'need to consider', 'for now',
  'i insist', 'my principle',
];

const reframingWords = [
  // 积极重构
  // 中文
  '换个角度', '其实', '也许', '可能', '或许', '换个思路', '另一方面',
  '反过来看', '换个想法', '重新看', '从另一个', '不是坏事',
  // 英文
  'another angle', 'actually', 'perhaps', 'maybe', 'might',
  'on the other hand', 'looking at it differently', 'not necessarily bad',
];

const activeListeningWords = [
  // 主动倾听
  // 中文
  '我听到', '你说的是', '你的意思是', '我明白你的', '听起来',
  '让我确认', '我理解的是', '你是说', '也就是说',
  // 英文
  'i hear', 'you mean', 'sounds like', 'let me confirm',
  'what you\'re saying', 'so you\'re saying', 'if i understand',
];

const emotionLabelingWords = [
  // 情绪命名
  // 中文
  '焦虑', '紧张', '担心', '失落', '沮丧', '愤怒', '委屈', '不安',
  '兴奋', '开心', '难过', '失望', '尴尬', '无奈', '疲惫',
  // 英文
  'anxious', 'nervous', 'worried', 'frustrated', 'angry', 'hurt',
  'uncomfortable', 'excited', 'happy', 'sad', 'disappointed',
  'awkward', 'helpless', 'exhausted',
];

const selfDisclosureWords = [
  // 自我披露
  // 中文
  '我也曾经', '我也有过', '我之前也', '我经历过', '我也遇到过',
  '我自己也', '我懂', '我理解', '我也感到',
  // 英文
  'i\'ve also', 'i once', 'i went through', 'i experienced',
  'i\'ve been there', 'me too', 'i know how',
];

const humorWords = [
  '哈哈', '笑', '段子', '逗', '幽默', '风趣', '搞笑', '开玩笑', '嘿嘿', '呵呵',
  'haha', 'lol', 'lmao', 'funny', 'joke', 'kidding', 'humor',
];

const etiquetteWords = [
  '您', '谢谢', '感谢', '劳驾', '请教', '麻烦', '请', '辛苦了', '不好意思',
  'respect', 'please', 'thank', 'thanks', 'appreciate', 'sorry to bother',
];

const transitionWords = [
  '不过', '但是', '这样', '虽然', '然而', '可是', '同时', '而且', '另外', '或许',
  'however', 'but', 'although', 'though', 'yet', 'while', 'meanwhile', 'also',
];

const complimentWords = [
  '优秀', '厉害', '棒', '出色', '聪明', '能干', '专业', '精彩', '赞', '牛',
  'excellent', 'great', 'impressive', 'professional', 'amazing', 'wonderful', 'brilliant',
];

const solutionWords = [
  // 解决导向
  // 中文
  '我们可以', '一起', '试试', '建议', '方案', '办法', '解决',
  '不如', '或许可以', '要不要', '试试看', '讨论一下',
  // 英文
  'we can', 'let\'s', 'try', 'suggest', 'solution', 'how about',
  'why not', 'let\'s try', 'discuss',
];

// ---- 负向词汇库 ----
const aggressiveWords = [
  '滚', '烦', '关你啥事', '管不着', '闭嘴', '少管', '多管', '傻', '蠢', '白痴',
  'shut up', 'get lost', 'none of your business', 'stupid', 'idiot', 'fuck',
];

const judgmentalWords = [
  '你应该', '你必须', '你怎么', '你就是', '你总是', '你从不', '都怪你',
  'you should', 'you must', 'you always', 'you never', 'your fault',
];

const emotionalBlackmailWords = [
  '为你好', '都是因为', '要不是', '我为你', '牺牲', '白养',
  'for your own good', 'after all i', 'i sacrificed', 'because of you',
];

const avoidanceWords = [
  '随便', '不知道', '无所谓', '随便你', '不想说', '算了',
  'whatever', 'i don\'t know', 'don\'t care', 'never mind',
];

const pureRejectionPhrases = ['不能', '不要', '不行', '不愿意', '不会', "can't", 'no', 'won\'t'];

// ---- 工具函数 ----
function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.reduce((cnt, w) => {
    const wl = w.toLowerCase();
    if (lower.includes(wl)) return cnt + 1;
    return cnt;
  }, 0);
}

function hasAny(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w.toLowerCase()));
}

function isPureRejection(text: string): boolean {
  const hasTransition = hasAny(text, transitionWords);
  const hasHumor = hasAny(text, humorWords);
  const hasGreeting = hasAny(text, etiquetteWords);
  const hasEmpathy = hasAny(text, empathyWords);
  if (hasTransition || hasHumor || hasGreeting || hasEmpathy) return false;
  const rejectionCount = pureRejectionPhrases.filter((phrase) =>
    text.toLowerCase().includes(phrase.toLowerCase()),
  ).length;
  return rejectionCount > 0 && text.length < 20;
}

// ======================================================================
// 主评分函数 v2
// ======================================================================
export function scoreCustomInput(input: string): ScoringResult {
  let score = 50; // 基础分
  const trimmedInput = input.trim();
  const length = trimmedInput.length;
  const lowerInput = trimmedInput.toLowerCase();

  // ===== 正向评分（每类最多累计一定分值，避免单一维度刷分） =====

  // 1. 共情（最高 +12）
  const empathyHits = countMatches(trimmedInput, empathyWords);
  score += Math.min(12, empathyHits * 4);

  // 2. 非暴力沟通 NVC（最高 +10）
  const nvcHits = countMatches(trimmedInput, nvcWords);
  score += Math.min(10, nvcHits * 3);

  // 3. 边界设定（最高 +10）—— 健康自我主张
  const boundaryHits = countMatches(trimmedInput, boundaryWords);
  score += Math.min(10, boundaryHits * 4);

  // 4. 积极重构（最高 +8）
  const reframingHits = countMatches(trimmedInput, reframingWords);
  score += Math.min(8, reframingHits * 4);

  // 5. 主动倾听（最高 +8）
  const listeningHits = countMatches(trimmedInput, activeListeningWords);
  score += Math.min(8, listeningHits * 3);

  // 6. 情绪命名（最高 +6）—— 情绪智力核心
  const emotionHits = countMatches(trimmedInput, emotionLabelingWords);
  score += Math.min(6, emotionHits * 2);

  // 7. 自我披露（最高 +6）
  const disclosureHits = countMatches(trimmedInput, selfDisclosureWords);
  score += Math.min(6, disclosureHits * 3);

  // 8. 幽默化解（最高 +6）
  const humorHits = countMatches(trimmedInput, humorWords);
  score += Math.min(6, humorHits * 2);

  // 9. 社交礼仪（最高 +5）
  const etiquetteHits = countMatches(trimmedInput, etiquetteWords);
  score += Math.min(5, etiquetteHits * 2);

  // 10. 转折过渡（最高 +5）—— 让拒绝更柔和
  const transitionHits = countMatches(trimmedInput, transitionWords);
  score += Math.min(5, transitionHits * 2);

  // 11. 称赞（最高 +6）
  const complimentHits = countMatches(trimmedInput, complimentWords);
  score += Math.min(6, complimentHits * 3);

  // 12. 解决导向（最高 +8）—— SFBT 焦点解决
  const solutionHits = countMatches(trimmedInput, solutionWords);
  score += Math.min(8, solutionHits * 3);

  // ===== 长度/结构评分 =====
  // 中等长度且有实质内容最佳
  if (length >= 15 && length <= 80) score += 6;
  else if (length > 80 && length <= 150) score += 4;
  else if (length > 150) score += 2;

  // 包含标点（说明结构化表达）—— 句号/逗号/感叹号
  if (/[。，！？!?,.]/.test(trimmedInput)) score += 2;

  // 包含"我"开头（自我主张）+ 包含"你"（关注对方）—— 双向沟通
  if (/我/.test(trimmedInput) && /你/.test(trimmedInput)) score += 3;

  // ===== 负向评分 =====
  // 攻击性语言（每命中 -15）
  const aggressiveHits = countMatches(trimmedInput, aggressiveWords);
  score -= aggressiveHits * 15;

  // 评判指责（每命中 -8）—— "你应该..."破坏关系
  const judgmentalHits = countMatches(trimmedInput, judgmentalWords);
  score -= judgmentalHits * 8;

  // 情绪勒索（每命中 -10）
  const blackmailHits = countMatches(trimmedInput, emotionalBlackmailWords);
  score -= blackmailHits * 10;

  // 逃避（每命中 -5）
  const avoidanceHits = countMatches(trimmedInput, avoidanceWords);
  score -= avoidanceHits * 5;

  // 太短
  if (length < 5) score -= 12;
  else if (length < 10) score -= 5;

  // 纯拒绝
  if (isPureRejection(trimmedInput)) score -= 10;

  // 全大写（情绪激动）—— 英文场景
  if (lowerInput === trimmedInput && length > 5 && /[a-z]/i.test(trimmedInput) && trimmedInput === trimmedInput.toUpperCase()) {
    score -= 5;
  }

  // ===== 多维度综合奖励 =====
  // 命中 4+ 个不同正向维度 → 高情商综合表现
  const positiveDimensions = [
    empathyHits > 0, nvcHits > 0, boundaryHits > 0, reframingHits > 0,
    listeningHits > 0, emotionHits > 0, disclosureHits > 0, humorHits > 0,
    etiquetteHits > 0, transitionHits > 0, complimentHits > 0, solutionHits > 0,
  ].filter(Boolean).length;

  if (positiveDimensions >= 5) score += 8; // 多维度大师
  else if (positiveDimensions >= 3) score += 4;
  else if (positiveDimensions >= 2) score += 2;

  // ===== 夹紧到合理区间 =====
  score = Math.max(10, Math.min(99, Math.round(score)));

  const level = getLevel(score);
  const { comment, tips } = generateFeedback(score, trimmedInput, {
    empathy: empathyHits,
    nvc: nvcHits,
    boundary: boundaryHits,
    humor: humorHits,
    aggressive: aggressiveHits,
    judgmental: judgmentalHits,
    positiveDimensions,
  });

  return { score, level, comment, tips };
}

interface ScoreBreakdown {
  empathy: number;
  nvc: number;
  boundary: number;
  humor: number;
  aggressive: number;
  judgmental: number;
  positiveDimensions: number;
}

function generateFeedback(score: number, _input: string, dim: ScoreBreakdown): {
  comment: { zh: string; en: string };
  tips: { zh: string; en: string };
} {
  if (score >= 90) {
    return {
      comment: {
        zh: '绝了！你这是天生的社交高手吧？大姑/老板/客户听到这话估计都要给你鼓掌！',
        en: 'Incredible! You\'re a natural-born social savant — your aunt/boss/client might literally be applauding right now!',
      },
      tips: {
        zh: '继续保持这份高情商，你就是下一个社交天花板！',
        en: 'Keep it up — you\'re the next ceiling of social competence!',
      },
    };
  } else if (score >= 70) {
    const extra = dim.empathy > 0
      ? { zh: '共情到位', en: 'great empathy' }
      : dim.boundary > 0
      ? { zh: '边界清晰', en: 'clear boundaries' }
      : { zh: '表达成熟', en: 'mature delivery' };
    return {
      comment: {
        zh: `不错不错！${extra.zh}，既给了对方面子，又没委屈自己。`,
        en: `Nice! ${extra.en} — you saved their face while standing your ground.`,
      },
      tips: {
        zh: '可以再加点幽默感，让气氛更轻松！',
        en: 'Add a little more humor and you\'ll be lightening the room every time!',
      },
    };
  } else if (score >= 50) {
    return {
      comment: {
        zh: '中规中矩，不功不过。至少没有踩大雷，但也没什么亮眼的地方。',
        en: 'Safe and steady — didn\'t blow up the room, didn\'t light it up either. Classic middle ground.',
      },
      tips: {
        zh: '试试加点夸赞对方的话，或者用幽默化解尴尬？',
        en: 'Try tossing in a genuine compliment, or defusing tension with a joke?',
      },
    };
  } else if (score >= 30) {
    const issue = dim.aggressive > 0
      ? { zh: '攻击性太强', en: 'too aggressive' }
      : dim.judgmental > 0
      ? { zh: '指责味太重', en: 'too judgmental' }
      : { zh: '表达太生硬', en: 'too blunt' };
    return {
      comment: {
        zh: `呃...${issue.zh}，空气都凝固了。你是来搞笑的吧？（不是）`,
        en: `Oof... ${issue.en}, the room just went silent. You\'re doing this on purpose, right? (Please say yes)`,
      },
      tips: {
        zh: '记住：先给面子，再说话。没有人喜欢被直接怼！',
        en: 'Remember: give face first, THEN speak. Nobody enjoys being directly attacked.',
      },
    };
  } else {
    return {
      comment: {
        zh: '朋友，你这是要当场社死的节奏啊！亲戚散了、老板怒了、客户走了...',
        en: 'Buddy, you just detonated a social bomb. Relatives scattered, the boss is furious, the client left...',
      },
      tips: {
        zh: '出门右转，有个情商培训班在等你！',
        en: 'There\'s an EQ training class waiting for you. Right now.',
      },
    };
  }
}

export function scorePresetOption(score: number): ScoringResult {
  const level = getLevel(score);
  const { comment, tips } = generatePresetFeedback(score);
  return { score, level, comment, tips };
}

function generatePresetFeedback(score: number): {
  comment: { zh: string; en: string };
  tips: { zh: string; en: string };
} {
  if (score === 100) {
    return {
      comment: {
        zh: '🔥 抗压之王！整顿职场，从我做起！老板听了想打人，但你赢麻了！💪',
        en: '🔥 MASTER OF PUSHBACK! Office reform starts with YOU. The boss wants to throw hands, but you WON this conversation 💪',
      },
      tips: {
        zh: '这就是传说中的"拒绝内耗"，打工人的精神支柱！佩服佩服！',
        en: 'Legendary "reject the internalized guilt" energy — the spiritual backbone of every hardworking person. Respect.',
      },
    };
  } else if (score >= 90) {
    return {
      comment: {
        zh: '👑 情商之神！你的回答堪称教科书级别！既给足了对方面子，又巧妙地化解了尴尬，说不定还能反将一军！',
        en: '👑 EQ DEITY! This is textbook-level response. You gave them full face, gracefully defused the tension, and might have flipped the situation on them!',
      },
      tips: {
        zh: '这就是传说中的"高情商话术"，学会了你就无敌了！',
        en: 'This is the real "high-EQ script" — master it and you are UNSTOPPABLE.',
      },
    };
  } else if (score >= 70) {
    return {
      comment: {
        zh: '😎 情商达人！你的回答很有水平，既表达了尊重，又不失立场。大多数场合都能游刃有余！',
        en: '😎 EQ Proficient! Solid response — respectful but firm. You\'d navigate most scenarios comfortably!',
      },
      tips: {
        zh: '如果能再加一点幽默感，效果会更好哦！',
        en: 'Add a dash of humor and it\'d be perfect!',
      },
    };
  } else if (score >= 40) {
    return {
      comment: {
        zh: '😅 及格选手！勉强及格，不至于得罪人，但也差点意思。属于"说了等于没说"类型。',
        en: '😅 Barely Passing! You didn\'t offend anyone, but you didn\'t impress either. Classic "saying words without really saying anything."',
      },
      tips: {
        zh: '试试多用"您"、多夸人、多用转折句？',
        en: 'Try more respectful language, genuine compliments, and graceful transitions?',
      },
    };
  } else {
    return {
      comment: {
        zh: '💀 社交杀手！恭喜你，成功地让气氛降到冰点！这回答简直是教科书级别的"踩雷范本"。',
        en: '💀 SOCIAL KILLER! Congratulations, you took the room temperature down to absolute zero. This is textbook "how to accidentally start a beef."',
      },
      tips: {
        zh: '记住：说话之前先过过脑子，别让嘴比脑子快！',
        en: 'Remember: brain first, mouth second. Don\'t let your tongue outrun your brain!',
      },
    };
  }
}
