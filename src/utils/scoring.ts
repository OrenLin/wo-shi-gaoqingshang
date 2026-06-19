import { getLevel } from '../data/levels';
import type { Level } from '../data/types';

export interface ScoringResult {
  score: number;
  level: Level;
  comment: { zh: string; en: string };
  tips: { zh: string; en: string };
}

const politeWords = ['您', '谢谢', '感谢', '劳驾', '请教', '麻烦', 'respect', 'please', 'thank', 'thank you'];
const humorWords = ['哈哈', '笑', '段子', '逗', '幽默', '风趣', '搞笑', 'haha', 'lol', 'funny'];
const transitionWords = ['不过', '但是', '这样', '虽然', '然而', '可是', 'however', 'but', 'although'];
const complimentWords = ['优秀', '厉害', '棒', '出色', '聪明', '能干', '专业', 'excellent', 'great', 'impressive', 'professional'];

const aggressiveWords = ['滚', '烦', '关你啥事', '管不着', '闭嘴', '少管', '多管', 'shut', 'quit', 'leave'];
const pureRejectionPhrases = ['不能', '不要', '不行', '不愿意', '不会', "can't", 'no'];

function hasCompliment(text: string): boolean {
  return complimentWords.some(word => text.includes(word));
}

function isPureRejection(text: string): boolean {
  const hasTransition = transitionWords.some(word => text.includes(word));
  const hasHumor = humorWords.some(word => text.includes(word));
  const hasGreeting = politeWords.some(word => text.includes(word));
  if (hasTransition || hasHumor || hasGreeting) return false;
  const rejectionCount = pureRejectionPhrases.filter(phrase => text.includes(phrase)).length;
  return rejectionCount > 0 && text.length < 20;
}

export function scoreCustomInput(input: string): ScoringResult {
  let score = 50;
  const trimmedInput = input.trim();

  politeWords.forEach(word => { if (trimmedInput.includes(word)) score += 5; });
  humorWords.forEach(word => { if (trimmedInput.includes(word)) score += 3; });
  transitionWords.forEach(word => { if (trimmedInput.includes(word)) score += 4; });

  const length = trimmedInput.length;
  if (length >= 15 && length <= 80) score += 10;
  else if (length > 80) score += 5;

  if (hasCompliment(trimmedInput)) score += 8;

  aggressiveWords.forEach(word => { if (trimmedInput.includes(word)) score -= 15; });
  if (length < 5) score -= 10;
  if (isPureRejection(trimmedInput)) score -= 10;

  score = Math.max(10, Math.min(99, score));
  const level = getLevel(score);
  const { comment, tips } = generateFeedback(score, trimmedInput);

  return { score, level, comment, tips };
}

function generateFeedback(score: number, _input: string): {
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
    return {
      comment: {
        zh: '不错不错！你这套话术已经相当成熟了，既给了对方面子，又没委屈自己。',
        en: 'Nice! Your delivery is solid — you\'ve saved their face while standing your ground.',
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
    return {
      comment: {
        zh: '呃...这话说完，空气都凝固了。你是来搞笑的吧？（不是）',
        en: 'Oof... that answer just turned the room silent. You\'re doing this on purpose, right? (Please say yes)',
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
