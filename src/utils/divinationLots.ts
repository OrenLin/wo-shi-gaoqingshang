// ============================================================
// 抽签数据 — 12 支签，结合禅宗 / 斯多葛 / CBT 减压智慧
// 中英文双语兼容
// ============================================================

export type LotLevel = 'supreme' | 'upper' | 'middle' | 'lower' | 'bottom';
export type FiveElement = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

export interface DivinationLot {
  id: string;
  number: number;          // 签号（传统寺庙风格编号）
  level: LotLevel;
  element: FiveElement;
  poem: { zh: string; en: string };         // 签诗（四句）
  interpretation: { zh: string; en: string }; // 签语（减压阐释）
  blessing: { zh: string; en: string };      // 祝福语
}

// 签级配置
export const LEVEL_CONFIG: Record<LotLevel, {
  label: { zh: string; en: string };
  shortLabel: { zh: string; en: string };
  sealChar: string;       // 印章字
  accentColor: string;    // 主题色
  glowColor: string;      // 光晕色
  rarity: string;         // 概率权重
}> = {
  supreme: {
    label: { zh: '上上签', en: 'Supreme Lot' },
    shortLabel: { zh: '上上', en: 'Supreme' },
    sealChar: '吉',
    accentColor: '#c89b3c',
    glowColor: 'rgba(200, 155, 60, 0.35)',
    rarity: 'rare',
  },
  upper: {
    label: { zh: '上签', en: 'Fortunate Lot' },
    shortLabel: { zh: '上吉', en: 'Fortunate' },
    sealChar: '福',
    accentColor: '#6b9d6f',
    glowColor: 'rgba(107, 157, 111, 0.3)',
    rarity: 'uncommon',
  },
  middle: {
    label: { zh: '中签', en: 'Neutral Lot' },
    shortLabel: { zh: '中平', en: 'Neutral' },
    sealChar: '平',
    accentColor: '#7a8b6b',
    glowColor: 'rgba(122, 139, 107, 0.2)',
    rarity: 'common',
  },
  lower: {
    label: { zh: '下签', en: 'Caution Lot' },
    shortLabel: { zh: '下', en: 'Caution' },
    sealChar: '守',
    accentColor: '#6b7d8c',
    glowColor: 'rgba(107, 125, 140, 0.2)',
    rarity: 'uncommon',
  },
  bottom: {
    label: { zh: '下下签', en: 'Trial Lot' },
    shortLabel: { zh: '下下', en: 'Trial' },
    sealChar: '忍',
    accentColor: '#8c7b6b',
    glowColor: 'rgba(140, 123, 107, 0.2)',
    rarity: 'rare',
  },
};

// 五行配置
export const ELEMENT_CONFIG: Record<FiveElement, {
  char: string;
  label: { zh: string; en: string };
  desc: { zh: string; en: string };
}> = {
  metal: { char: '金', label: { zh: '五行属金', en: 'Element: Metal' }, desc: { zh: '刚毅果决', en: 'Resolute & firm' } },
  wood: { char: '木', label: { zh: '五行属木', en: 'Element: Wood' }, desc: { zh: '生机勃勃', en: 'Vital & growing' } },
  water: { char: '水', label: { zh: '五行属水', en: 'Element: Water' }, desc: { zh: '柔韧包容', en: 'Adaptive & yielding' } },
  fire: { char: '火', label: { zh: '五行属火', en: 'Element: Fire' }, desc: { zh: '热情进取', en: 'Passionate & driven' } },
  earth: { char: '土', label: { zh: '五行属土', en: 'Element: Earth' }, desc: { zh: '厚德载物', en: 'Grounded & nurturing' } },
};

// 12 支签
export const divinationLots: DivinationLot[] = [
  {
    id: 'lot-01',
    number: 1,
    level: 'supreme',
    element: 'wood',
    poem: {
      zh: '春风化雨润枯枝\n万物生发正当时\n莫愁前路无知己\n天道酬勤自有期',
      en: 'Spring rain revives the withered branch,\nAll things awaken at the right hour.\nFear not the road without friends,\nHeaven rewards the diligent in time.',
    },
    interpretation: {
      zh: '枯木逢春，万物复苏。你正处在转折点上，过去的压力和困境即将化解。保持耐心，像春天的种子一样默默积蓄力量——时机成熟时，自然会破土而出。不必焦虑于眼前的停滞，生长正在地下悄悄发生。',
      en: 'Like dead wood meeting spring, renewal is coming. You stand at a turning point where past pressures will soon dissolve. Be patient — like a seed gathering strength underground, growth is happening even when invisible. Do not fear the stillness; breakthrough comes in its own season.',
    },
    blessing: { zh: '枯木逢春，否极泰来', en: 'Dead wood meets spring; fortune turns' },
  },
  {
    id: 'lot-08',
    number: 8,
    level: 'upper',
    element: 'water',
    poem: {
      zh: '流水不争先\n涓涓汇成海\n心静自然凉\n烦恼随风散',
      en: 'Flowing water does not rush to lead,\nTrickles gather into an ocean.\nA calm heart stays cool naturally,\nWorries scatter with the wind.',
    },
    interpretation: {
      zh: '水善利万物而不争。最近的你可能太急于求成，反而给自己增加了压力。试着放慢节奏，像流水一样顺应自然——不强求、不执着，烦恼自然会消散。真正的力量不在于速度，而在于持续。',
      en: 'Water benefits all things without competing. You may be rushing too much, creating pressure that need not exist. Slow down — flow like water, adapt without forcing. True strength lies not in speed but in persistence. Worries dissolve when you stop resisting the current.',
    },
    blessing: { zh: '上善若水，顺其自然', en: 'Be like water; let nature take its course' },
  },
  {
    id: 'lot-15',
    number: 15,
    level: 'middle',
    element: 'earth',
    poem: {
      zh: '山重水复疑无路\n柳暗花明又一村\n守得云开见月明\n静待花开终有时',
      en: 'Mountains and waters block the path,\nYet willows and flowers reveal a village.\nWait for clouds to part, the moon appears,\nFlowers bloom in their own season.',
    },
    interpretation: {
      zh: '你可能正感到迷茫，觉得前路受阻。但请记住：最黑暗的时刻往往在黎明之前。不要急于寻找出路，静下心来——转机就在你不经意间出现。有时候，"不知道往哪走"本身就是一种答案，它邀请你停下来，重新审视方向。',
      en: 'You may feel lost, the path blocked. But remember: the darkest moment often precedes dawn. Do not rush to find a way out — be still, and opportunity will appear when you least expect it. Sometimes "not knowing where to go" is itself an answer, inviting you to pause and reconsider your direction.',
    },
    blessing: { zh: '柳暗花明，峰回路转', en: 'Beyond the willows, a new village awaits' },
  },
  {
    id: 'lot-23',
    number: 23,
    level: 'middle',
    element: 'metal',
    poem: {
      zh: '宝剑锋从磨砺出\n梅花香自苦寒来\n今朝磨砺虽辛苦\n他日锋芒耀九州',
      en: 'The sword\'s edge comes from sharpening,\nPlum blossoms bloom from bitter cold.\nToday\'s hardship is the whetstone,\nTomorrow your brilliance will shine.',
    },
    interpretation: {
      zh: '当下的困难是在打磨你。每一份压力都在锻炼你的韧性，就像磨刀石磨砺宝剑。不要害怕辛苦——你正在变得更强大。压力本身不是敌人，对压力的抗拒才是。试着接纳它，看看它能教会你什么。',
      en: 'Current difficulties are sharpening you. Each pressure tempers your resilience, like a whetstone forging a blade. Do not fear the hardship — you are growing stronger. Stress itself is not the enemy; resistance to it is. Try accepting it and see what it can teach you.',
    },
    blessing: { zh: '宝剑锋出，梅花香来', en: 'From hardship, brilliance is born' },
  },
  {
    id: 'lot-28',
    number: 28,
    level: 'upper',
    element: 'fire',
    poem: {
      zh: '星火可以燎原\n微光亦能照夜\n莫以善小而不为\n积少成多终见功',
      en: 'A single spark can start a prairie fire,\nA faint glow can illuminate the night.\nDo not skip small kindnesses,\nDrops fill the bucket, effort bears fruit.',
    },
    interpretation: {
      zh: '不要小看微小的改变。每天一个小小的积极行动——深呼吸一次、对陌生人微笑、早睡五分钟——累积起来就能带来巨大的转变。从今天开始，做一件让自己开心的小事。改变不必惊天动地，持续才是关键。',
      en: 'Do not underestimate small changes. One tiny positive action daily — a deep breath, a smile, sleeping five minutes earlier — accumulates into transformation. Start today: do one small thing that brings you joy. Change need not be dramatic; consistency is the key.',
    },
    blessing: { zh: '星火燎原，积少成多', en: 'A spark ignites; small steps build greatness' },
  },
  {
    id: 'lot-33',
    number: 33,
    level: 'middle',
    element: 'wood',
    poem: {
      zh: '竹影扫阶尘不动\n月穿潭底水无痕\n心如止水鉴常明\n万事随缘自在行',
      en: 'Bamboo shadows sweep the steps, dust stays still,\nMoon pierces the pool, water leaves no trace.\nA mind like still water reflects clearly,\nWalk freely, flowing with fate.',
    },
    interpretation: {
      zh: '外界的纷扰就像竹影扫过台阶——看似动静很大，其实尘土并未移动。学会区分"外在的喧嚣"和"内心的平静"。你无法控制外界发生什么，但可以选择如何回应。当心如止水时，万物皆清晰可见。',
      en: 'External disturbances are like bamboo shadows sweeping steps — seemingly dramatic, yet the dust never moves. Learn to distinguish outer noise from inner peace. You cannot control what happens around you, but you can choose how to respond. When the mind is like still water, everything becomes clear.',
    },
    blessing: { zh: '心如止水，自在随缘', en: 'A still heart; flowing freely with fate' },
  },
  {
    id: 'lot-45',
    number: 45,
    level: 'lower',
    element: 'water',
    poem: {
      zh: '惊涛骇浪一时来\n守得云开见月明\n莫被浮云遮望眼\n静心等待自逢春',
      en: 'Stormy waves come for a moment,\nWait for clouds to part, the moon appears.\nLet not floating clouds block your view,\nWait calmly, spring will come.',
    },
    interpretation: {
      zh: '你正经历一段艰难时期，情绪像惊涛骇浪。这很正常——允许自己感受这些情绪，不必强装坚强。但请记住：风暴终会过去，不要被暂时的困境遮蔽了双眼。情绪是天气，不是气候。给自己时间，等风浪平息。',
      en: 'You are going through a difficult time, emotions like stormy waves. This is normal — allow yourself to feel, without pretending to be strong. But remember: storms always pass. Do not let temporary trials obscure your vision. Emotions are weather, not climate. Give yourself time; the waves will settle.',
    },
    blessing: { zh: '风浪终息，云开月明', en: 'Storms will pass; the moon will show' },
  },
  {
    id: 'lot-56',
    number: 56,
    level: 'supreme',
    element: 'earth',
    poem: {
      zh: '厚德载物天地宽\n有容乃大古今同\n放下执念心自在\n万般皆是命中缘',
      en: 'Great virtue carries all, heaven and earth are wide,\nTolerance brings greatness, past and present the same.\nLet go of attachments, the heart is free,\nAll things are threads of destiny.',
    },
    interpretation: {
      zh: '大地承载万物而不言。你最近的压力，很多来自于"想要控制一切"的执念。试着放下一些——接纳自己无法改变的事情，心宽了，路就宽了。放下不是放弃，而是不再用双手紧握，让事物自然流淌。这就是禅宗说的"无心"。',
      en: 'The earth carries all things without a word. Much of your pressure comes from the attachment to "controlling everything." Try letting go — accept what you cannot change. When the heart is wide, the road is wide. Letting go is not giving up; it is releasing your grip so things can flow naturally. This is what Zen calls "no-mind."',
    },
    blessing: { zh: '厚德载物，心宽路宽', en: 'Virtue carries all; a wide heart makes a wide road' },
  },
  {
    id: 'lot-64',
    number: 64,
    level: 'middle',
    element: 'fire',
    poem: {
      zh: '野火烧不尽\n春风吹又生\n挫折不过一时事\n重新出发正当时',
      en: 'Wildfire cannot burn it all,\nSpring wind brings life again.\nSetbacks are but temporary,\nNow is the time to start anew.',
    },
    interpretation: {
      zh: '野火烧不尽草根，春风一吹又生新芽。无论你经历了什么挫折，你的生命力比你想象的更顽强。跌倒了就爬起来——现在就是重新出发的最好时机。白居易说"野火烧不尽，春风吹又生"，你也是那根草，火过之后，依然会绿。',
      en: 'Wildfire cannot destroy the roots; spring wind brings new life. Whatever setback you face, your resilience is stronger than you imagine. Fall, then rise — now is the perfect time to begin again. As Bai Juyi wrote: wildfire cannot burn it all; the spring wind blows, and life returns. You are that grass: after the fire, you will still turn green.',
    },
    blessing: { zh: '野火不尽，春风再生', en: 'Fire cannot end you; spring will revive you' },
  },
  {
    id: 'lot-72',
    number: 72,
    level: 'upper',
    element: 'metal',
    poem: {
      zh: '千锤百炼始成钢\n百折不挠方显刚\n莫道桑榆晚\n为霞尚满天',
      en: 'A thousand hammerings forge the steel,\nA hundred bendings reveal true strength.\nSay not the evening is late,\nThe sunset still fills the sky.',
    },
    interpretation: {
      zh: '真正的坚强不是从不跌倒，而是每次跌倒都能站起来。不要觉得现在开始太晚了——刘禹锡说"莫道桑榆晚，为霞尚满天"，只要心中有光，任何时候都可以绽放光彩。年龄、时机都不是障碍，唯一的障碍是"觉得自己来不及了"这个念头本身。',
      en: 'True strength is not never falling, but rising every time. Do not think it is too late — as Liu Yuxi wrote: "Say not the evening is late, the sunset still fills the sky." With light in your heart, you can shine at any age, any moment. The only real barrier is the thought "it\'s too late" itself.',
    },
    blessing: { zh: '百炼成钢，桑榆非晚', en: 'Forged through fire; never too late to shine' },
  },
  {
    id: 'lot-88',
    number: 88,
    level: 'bottom',
    element: 'water',
    poem: {
      zh: '乌云遮日暂无光\n风雨交加路难行\n但信阴霾终会散\n守得本心待天明',
      en: 'Dark clouds hide the sun, no light for now,\nWind and rain make the road hard.\nBut believe the haze will clear,\nGuard your true heart, wait for dawn.',
    },
    interpretation: {
      zh: '这是一支下下签，但请记住：最深的夜离黎明最近。你现在的压力和焦虑是真实的，不必强装坚强。允许自己脆弱，寻求帮助——这不是软弱，而是勇气。守住本心，天总会亮的。如果觉得撑不住，请找人倾诉，或拨打心理援助热线。你不需要独自承受。',
      en: 'This is a difficult lot, but remember: the deepest night is closest to dawn. Your pressure and anxiety are real — you need not pretend to be strong. Allow yourself to be vulnerable, seek help. This is not weakness but courage. Guard your heart; dawn will come. If it feels like too much, please reach out to someone, or call a support hotline. You do not have to carry this alone.',
    },
    blessing: { zh: '守得本心，终见天明', en: 'Guard your heart; dawn will come' },
  },
  {
    id: 'lot-96',
    number: 96,
    level: 'middle',
    element: 'earth',
    poem: {
      zh: '种瓜得瓜种豆得豆\n因果循环理不差\n今日之行明日果\n善待自己亦善待他',
      en: 'Plant melons, get melons; plant beans, get beans,\nCause and effect cycles without error.\nToday\'s actions are tomorrow\'s fruit,\nBe kind to yourself and to others.',
    },
    interpretation: {
      zh: '你现在的状态，是过去行为的结果；你未来的状态，取决于现在的选择。对自己温柔一些——像对待好朋友一样对待自己，这份善意终会回报到你身上。自我批评不会带来改变，自我关怀才会。今天对自己说一句："你已经做得很好了。"',
      en: 'Your current state is the result of past actions; your future depends on present choices. Be gentle with yourself — treat yourself as you would a dear friend, and this kindness will return to you. Self-criticism does not create change; self-compassion does. Today, tell yourself: "You are doing well enough."',
    },
    blessing: { zh: '善待自己，因果不负', en: 'Be kind to yourself; kindness returns' },
  },
];

// 随机抽签（加权概率：中签最多，下签/下下签极少，尽量讨喜）
const WEIGHTS: Record<LotLevel, number> = {
  supreme: 2,   // 上上签 — 略增，给用户惊喜
  upper: 4,     // 上签 — 较多
  middle: 6,    // 中签 — 最多，平和稳妥
  lower: 1,     // 下签 — 很少
  bottom: 1,    // 下下签 — 极少
};

export function drawRandomLot(): DivinationLot {
  const weighted: DivinationLot[] = [];
  for (const lot of divinationLots) {
    const w = WEIGHTS[lot.level];
    for (let i = 0; i < w; i++) weighted.push(lot);
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}

// localStorage 持久化
const STORAGE_KEY = 'eq_divination_history';

export interface DivinationRecord {
  lotId: string;
  level: LotLevel;
  number: number;
  timestamp: number;
}

export function getDivinationHistory(): DivinationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDivinationRecord(record: DivinationRecord) {
  try {
    const history = getDivinationHistory();
    history.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
  } catch {}
}

export function getTodayDrawCount(): number {
  const today = new Date().toDateString();
  return getDivinationHistory().filter(
    (r) => new Date(r.timestamp).toDateString() === today,
  ).length;
}
