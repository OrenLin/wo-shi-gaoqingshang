// 评分引擎
import { getLevel } from '../data/levels';
import type { Level } from '../data/types';

export interface ScoringResult {
  score: number;
  level: Level;
  comment: string;
  tips: string;
}

// 加分关键词
const politeWords = ['您', '谢谢', '感谢', '劳驾', '请教', '麻烦'];
const humorWords = ['哈哈', '笑', '段子', '逗', '幽默', '风趣', '搞笑'];
const transitionWords = ['不过', '但是', '这样', '虽然', '然而', '可是'];
const complimentWords = ['优秀', '厉害', '棒', '出色', '聪明', '能干', '专业'];

// 减分关键词
const aggressiveWords = ['滚', '烦', '关你啥事', '管不着', '闭嘴', '少管', '多管'];
const pureRejectionPhrases = ['不能', '不要', '不行', '不愿意', '不会'];

// 检查是否包含夸赞
function hasCompliment(text: string): boolean {
  return complimentWords.some(word => text.includes(word));
}

// 检查是否是纯拒绝（没有缓冲）
function isPureRejection(text: string): boolean {
  const hasTransition = transitionWords.some(word => text.includes(word));
  const hasHumor = humorWords.some(word => text.includes(word));
  const hasGreeting = politeWords.some(word => text.includes(word));

  // 如果有礼貌用语、幽默或转折，就不是纯拒绝
  if (hasTransition || hasHumor || hasGreeting) {
    return false;
  }

  // 如果包含拒绝词且很短，可能是纯拒绝
  const rejectionCount = pureRejectionPhrases.filter(phrase => text.includes(phrase)).length;
  return rejectionCount > 0 && text.length < 20;
}

// 自定义输入评分
export function scoreCustomInput(input: string): ScoringResult {
  let score = 50; // 基础分
  const trimmedInput = input.trim();

  // 加分项
  politeWords.forEach(word => {
    if (trimmedInput.includes(word)) {
      score += 5;
    }
  });

  humorWords.forEach(word => {
    if (trimmedInput.includes(word)) {
      score += 3;
    }
  });

  transitionWords.forEach(word => {
    if (trimmedInput.includes(word)) {
      score += 4;
    }
  });

  // 长度适中加分
  const length = trimmedInput.length;
  if (length >= 15 && length <= 80) {
    score += 10;
  } else if (length > 80) {
    score += 5;
  }

  // 夸赞对方
  if (hasCompliment(trimmedInput)) {
    score += 8;
  }

  // 减分项
  aggressiveWords.forEach(word => {
    if (trimmedInput.includes(word)) {
      score -= 15;
    }
  });

  // 回复过短
  if (length < 5) {
    score -= 10;
  }

  // 纯拒绝无缓冲
  if (isPureRejection(trimmedInput)) {
    score -= 10;
  }

  // 边界限制
  score = Math.max(10, Math.min(99, score));

  const level = getLevel(score);
  const { comment, tips } = generateFeedback(score, trimmedInput);

  return {
    score,
    level,
    comment,
    tips
  };
}

// 生成反馈
function generateFeedback(score: number, input: string): { comment: string; tips: string } {
  if (score >= 90) {
    return {
      comment: '绝了！你这是天生的社交高手吧？大姑/老板/客户听到这话估计都要给你鼓掌！',
      tips: '继续保持这份高情商，你就是下一个社交天花板！'
    };
  } else if (score >= 70) {
    return {
      comment: '不错不错！你这套话术已经相当成熟了，既给了对方面子，又没委屈自己。',
      tips: '可以再加点幽默感，让气氛更轻松！'
    };
  } else if (score >= 50) {
    return {
      comment: '中规中矩，不功不过。至少没有踩大雷，但也没什么亮眼的地方。',
      tips: '试试加点夸赞对方的话，或者用幽默化解尴尬？'
    };
  } else if (score >= 30) {
    return {
      comment: '呃...这话说完，空气都凝固了。你是来搞笑的吧？（不是）',
      tips: '记住：先给面子，再说话。没有人喜欢被直接怼！'
    };
  } else {
    return {
      comment: '朋友，你这是要当场社死的节奏啊！亲戚散了、老板怒了、客户走了...',
      tips: '出门右转，有个情商培训班在等你！'
    };
  }
}

// 预设选项评分
export function scorePresetOption(score: number): ScoringResult {
  const level = getLevel(score);
  const { comment, tips } = generatePresetFeedback(score);

  return {
    score,
    level,
    comment,
    tips
  };
}

// 预设选项反馈
function generatePresetFeedback(score: number): { comment: string; tips: string } {
  if (score === 100) {
    return {
      comment: '🔥 抗压之王！整顿职场，从我做起！老板听了想打人，但你赢麻了！💪',
      tips: '这就是传说中的"拒绝内耗"，打工人的精神支柱！佩服佩服！'
    };
  } else if (score >= 90) {
    return {
      comment: '👑 情商之神！你的回答堪称教科书级别！既给足了对方面子，又巧妙地化解了尴尬，说不定还能反将一军！',
      tips: '这就是传说中的"高情商话术"，学会了你就无敌了！'
    };
  } else if (score >= 70) {
    return {
      comment: '😎 情商达人！你的回答很有水平，既表达了尊重，又不失立场。大多数场合都能游刃有余！',
      tips: '如果能再加一点幽默感，效果会更好哦！'
    };
  } else if (score >= 40) {
    return {
      comment: '😅 及格选手！勉强及格，不至于得罪人，但也差点意思。属于"说了等于没说"类型。',
      tips: '试试多用"您"、多夸人、多用转折句？'
    };
  } else {
    return {
      comment: '💀 社交杀手！恭喜你，成功地让气氛降到冰点！这回答简直是教科书级别的"踩雷范本"。',
      tips: '记住：说话之前先过过脑子，别让嘴比脑子快！'
    };
  }
}
