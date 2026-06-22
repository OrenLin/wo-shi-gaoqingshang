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
  // ===== 新增 18 组签（编号 13-30）=====
  {
    id: 'lot-13',
    number: 13,
    level: 'supreme',
    element: 'fire',
    poem: {
      zh: '云开月朗照乾坤\n万里山河一片明\n莫道前路无知己\n天下谁人不识君',
      en: 'Clouds part, the moon illuminates all,\nA thousand miles of mountains and rivers glow bright.\nDo not say the road ahead lacks friends,\nWho in this world does not know you?',
    },
    interpretation: {
      zh: '你正处在被看见、被认可的时刻。过去的努力没有白费，此刻光芒开始外显。不必再自我怀疑——你的价值不需要别人批准，但别人的认可会自然到来。继续保持真诚，让光照向更远的地方。',
      en: 'You are in a moment of being seen and recognized. Past efforts were not in vain; your light is now shining outward. No need for self-doubt — your worth needs no approval, yet recognition will come naturally. Keep being authentic and let your light reach further.',
    },
    blessing: { zh: '云开月明，光芒自现', en: 'Clouds part, the moon reveals your light' },
  },
  {
    id: 'lot-14',
    number: 14,
    level: 'supreme',
    element: 'wood',
    poem: {
      zh: '春风得意马蹄疾\n一日看尽长安花\n好事近在不远处\n只待君心一念通',
      en: 'Spring wind rides swift hooves,\nIn one day, all of Chang\'an\'s flowers seen.\nGood things are near at hand,\nAwaiting only your heart\'s alignment.',
    },
    interpretation: {
      zh: '好消息正在路上。你不需要拼命追赶，只需要保持开放的心态去接收。有时候最大的障碍不是外部世界，而是我们内心"我不配"的声音。今天，允许自己相信：好事可以发生在我身上。',
      en: 'Good news is on its way. You need not chase desperately — only stay open to receive. Sometimes the greatest obstacle is not the external world, but the inner voice saying "I don\'t deserve this." Today, allow yourself to believe: good things can happen to me.',
    },
    blessing: { zh: '春风得意，好事将近', en: 'Spring wind favors you; good things draw near' },
  },
  {
    id: 'lot-15',
    number: 15,
    level: 'supreme',
    element: 'water',
    poem: {
      zh: '久旱逢甘霖\n他乡遇故知\n洞房花烛夜\n金榜题名时',
      en: 'Long drought meets sweet rain,\nIn a foreign land, an old friend appears.\nWedding night by candlelight,\nThe moment your name tops the list.',
    },
    interpretation: {
      zh: '这是人生四大喜事的签。你渴望已久的某件事，正在从"等待"转向"到来"。喜悦不是罪过，允许自己尽情享受。记住这份感觉——它会成为你未来低谷时的力量源泉。',
      en: 'This is the lot of life\'s four great joys. Something you have long awaited is shifting from "waiting" to "arriving." Joy is not a sin — allow yourself to feel it fully. Remember this feeling; it will be your strength in future low moments.',
    },
    blessing: { zh: '四喜临门，久盼终至', en: 'Four joys arrive; long hopes fulfilled' },
  },
  {
    id: 'lot-16',
    number: 16,
    level: 'supreme',
    element: 'earth',
    poem: {
      zh: '厚积薄发有时辰\n静水深流不显痕\n一朝破壁乘风去\n万里长空任我行',
      en: 'Deep accumulation, slow release, in due time,\nStill waters run deep, leaving no trace.\nOne day you break the wall and ride the wind,\nTen thousand miles of sky are yours to roam.',
    },
    interpretation: {
      zh: '你积累的能量即将爆发。那些看似"没有进展"的日子，其实都在暗中蓄力。不要因为暂时看不到结果就否定过程。破壁的时刻往往来得突然——保持准备，机会来时才能接住。',
      en: 'The energy you have accumulated is about to burst forth. Those days that seemed "without progress" were actually storing power in the dark. Do not dismiss the process just because results are not yet visible. The breakthrough often comes suddenly — stay prepared so you can catch it when it arrives.',
    },
    blessing: { zh: '厚积薄发，一飞冲天', en: 'Deep roots, sudden flight' },
  },
  {
    id: 'lot-17',
    number: 17,
    level: 'upper',
    element: 'metal',
    poem: {
      zh: '宝剑锋从磨砺出\n梅花香自苦寒来\n今日辛苦非白费\n他日回首笑开颜',
      en: 'The sword\'s edge comes from sharpening,\nPlum blossom fragrance born of bitter cold.\nToday\'s hardship is not in vain,\nTomorrow you will look back and smile.',
    },
    interpretation: {
      zh: '你正在经历的困难，是塑造你的工具。不是所有痛苦都有意义，但主动面对的痛苦会让你更强。区分"无意义的消耗"和"有成长的挑战"——前者要远离，后者要拥抱。',
      en: 'The difficulty you are experiencing is a tool that shapes you. Not all suffering has meaning, but pain you actively face makes you stronger. Distinguish between "meaningless drain" and "growth-bringing challenge" — avoid the former, embrace the latter.',
    },
    blessing: { zh: '苦尽甘来，锋芒自现', en: 'After hardship, sweetness; your edge emerges' },
  },
  {
    id: 'lot-18',
    number: 18,
    level: 'upper',
    element: 'fire',
    poem: {
      zh: '红日初升照大千\n万物苏醒向晴天\n心中有火不惧冷\n一路向前自生光',
      en: 'The red sun rises, illuminating all,\nAll things awaken toward the clear sky.\nWith fire in your heart, fear no cold,\nWalk forward and light your own way.',
    },
    interpretation: {
      zh: '你的热情是你最珍贵的资源。当外部环境冷淡时，内在的火种能让你继续前行。但记住：火需要燃料——给自己足够的休息和滋养，让这把火持续燃烧，而不是燃尽自己。',
      en: 'Your passion is your most precious resource. When the external environment is cold, the inner flame keeps you moving forward. But remember: fire needs fuel — give yourself enough rest and nourishment so this flame sustains, rather than burns you out.',
    },
    blessing: { zh: '心有烈火，自带光芒', en: 'Fire within; you carry your own light' },
  },
  {
    id: 'lot-19',
    number: 19,
    level: 'upper',
    element: 'water',
    poem: {
      zh: '水到渠成事自顺\n强求反生许多烦\n放下执念随缘去\n柳暗花明又一村',
      en: 'Water flows, the channel forms, things align,\nForcing only breeds endless trouble.\nRelease attachment, let fate unfold,\nPast the dark willows, another village blooms.',
    },
    interpretation: {
      zh: '有些事越用力越远离。这不是让你放弃，而是让你学会"松弛地努力"——尽人事，听天命。把注意力放在你能控制的部分，把结果交给时间。往往你松手的那一刻，事情反而开始流动。',
      en: 'Some things recede the harder you push. This is not asking you to give up, but to learn "relaxed effort" — do your best, leave the rest to fate. Focus on what you can control, entrust the outcome to time. Often the moment you let go, things begin to flow.',
    },
    blessing: { zh: '随缘而行，柳暗花明', en: 'Flow with fate; a new village appears' },
  },
  {
    id: 'lot-20',
    number: 20,
    level: 'upper',
    element: 'wood',
    poem: {
      zh: '青松挺且直\n傲雪凌霜姿\n莫羡百花艳\n岁寒见真知',
      en: 'The green pine stands tall and straight,\nProud against snow and frost.\nDo not envy the hundred flowers\' brilliance,\nTrue character shows in winter\'s cold.',
    },
    interpretation: {
      zh: '你不需要成为所有人喜欢的样子。松树的美在于它在寒冬依然挺立。你的独特性——那些让你"和别人不一样"的特质——正是你最珍贵的部分。不必迎合，做你自己。',
      en: 'You need not become what everyone likes. The pine\'s beauty lies in standing tall through winter. Your uniqueness — those traits that make you "different" — are your most precious parts. No need to conform; be yourself.',
    },
    blessing: { zh: '岁寒知松，本色长青', en: 'Winter reveals the pine; your true self endures' },
  },
  {
    id: 'lot-21',
    number: 21,
    level: 'upper',
    element: 'earth',
    poem: {
      zh: '山高自有客行路\n水深自有渡船人\n莫愁前路无知己\n天下谁人不识君',
      en: 'High mountains still have travelers\' paths,\nDeep waters still have ferrymen.\nFear not the road ahead without friends,\nWho in this world does not know you?',
    },
    interpretation: {
      zh: '无论眼前的困难看起来多大，总有人走过类似的路。你不是第一个，也不会是最后一个。寻求帮助不是软弱，而是智慧。这个世界上有人愿意帮你——你需要做的是开口。',
      en: 'However daunting your difficulty seems, someone has walked a similar path. You are neither the first nor the last. Asking for help is not weakness but wisdom. Someone in this world is willing to help — what you need to do is speak up.',
    },
    blessing: { zh: '路在脚下，贵人相随', en: 'The path is underfoot; helpers appear' },
  },
  {
    id: 'lot-22',
    number: 22,
    level: 'middle',
    element: 'earth',
    poem: {
      zh: '半亩方塘一鉴开\n天光云影共徘徊\n问渠那得清如许\n为有源头活水来',
      en: 'A half-acre pond opens like a mirror,\nSky light and cloud shadows linger together.\nHow does it stay so clear?\nFrom the living water at its source.',
    },
    interpretation: {
      zh: '保持内心的清明，需要持续输入"活水"——新的体验、新的知识、新的人际关系。如果你感到停滞，可能不是能力问题，而是输入不够。今天去做一件没做过的事，哪怕很小。',
      en: 'To keep your inner clarity, you need continuous "living water" — new experiences, new knowledge, new relationships. If you feel stagnant, it may not be a capability issue but insufficient input. Today, do one thing you have never done, however small.',
    },
    blessing: { zh: '源头活水，心境常清', en: 'Living water at the source; a clear mind endures' },
  },
  {
    id: 'lot-23',
    number: 23,
    level: 'middle',
    element: 'metal',
    poem: {
      zh: '千锤百炼始成钢\n烈火焚烧若等闲\n粉骨碎身浑不怕\n要留清白在人间',
      en: 'A thousand hammerings forge the steel,\nFierce fire is taken in stride.\nShattered bones and crushed body, feared not,\nTo leave integrity in this world.',
    },
    interpretation: {
      zh: '你正在经历一个"锻造"的过程。这很痛，但痛不等于错。问自己：这次经历在把我塑造成什么样的人？如果答案是"更坚韧、更真实"，那就值得。如果只是"更麻木、更愤怒"，需要重新选择。',
      en: 'You are going through a "forging" process. It hurts, but pain does not mean wrong. Ask yourself: what kind of person is this experience shaping me into? If the answer is "more resilient, more authentic," it is worth it. If only "more numb, more angry," you need to choose again.',
    },
    blessing: { zh: '千锤百炼，终成真钢', en: 'A thousand forgings; true steel emerges' },
  },
  {
    id: 'lot-24',
    number: 24,
    level: 'middle',
    element: 'water',
    poem: {
      zh: '行到水穷处\n坐看云起时\n偶然值林叟\n谈笑无还期',
      en: 'Walking to where the water ends,\nSitting to watch the clouds rise.\nBy chance meeting a forest elder,\nTalking and laughing, forgetting to return.',
    },
    interpretation: {
      zh: '当你觉得"走到尽头"时，也许那不是终点，而是转换视角的契机。水穷之处，云正在升起。你不需要立刻找到答案——坐下来，看看，让事情自然展开。有时候"不作为"本身就是一种作为。',
      en: 'When you feel you have "reached the end," perhaps it is not a dead end but a chance to shift perspective. Where water ends, clouds are rising. You need not find an answer immediately — sit down, observe, let things unfold. Sometimes "non-action" is itself a form of action.',
    },
    blessing: { zh: '水穷云起，顺其自然', en: 'Water ends, clouds rise; let nature flow' },
  },
  {
    id: 'lot-25',
    number: 25,
    level: 'middle',
    element: 'fire',
    poem: {
      zh: '采菊东篱下\n悠然见南山\n山气日夕佳\n飞鸟相与还',
      en: 'Picking chrysanthemums by the eastern hedge,\nLeisurely I gaze at the southern mountain.\nMountain air grows fine at dusk,\nBirds fly home together.',
    },
    interpretation: {
      zh: '幸福不在远方，而在你愿意停下来欣赏的瞬间。你一直在追赶目标，却忘了目标本身就是为了此刻的安宁。今天给自己一个"无所事事"的时刻——不是偷懒，而是给灵魂喘息的空间。',
      en: 'Happiness is not far away, but in the moments you are willing to pause and appreciate. You have been chasing goals, forgetting that goals exist for this very peace. Today give yourself a moment of "doing nothing" — not laziness, but space for the soul to breathe.',
    },
    blessing: { zh: '悠然见山，心安即归', en: 'Leisurely gazing at mountains; peace is home' },
  },
  {
    id: 'lot-26',
    number: 26,
    level: 'middle',
    element: 'wood',
    poem: {
      zh: '野火烧不尽\n春风吹又生\n远芳侵古道\n晴翠接荒城',
      en: 'Wildfire cannot burn it all,\nSpring wind blows and it grows again.\nDistant fragrance invades the ancient road,\nSunny green meets the ruined city.',
    },
    interpretation: {
      zh: '你的生命力比你以为的更强。即使经历了"烧毁一切"的打击，只要根还在，春风一吹就能重生。不要用现在的状态定义未来的可能。你现在需要的不是"努力"，而是"等待春天"。',
      en: 'Your vitality is stronger than you think. Even after a blow that "burned everything," as long as the roots remain, spring wind will bring rebirth. Do not define future possibilities by your current state. What you need now is not "effort" but "waiting for spring."',
    },
    blessing: { zh: '野火不尽，春风再生', en: 'Fire cannot end it; spring brings rebirth' },
  },
  {
    id: 'lot-27',
    number: 27,
    level: 'lower',
    element: 'metal',
    poem: {
      zh: '独上高楼望尽天涯路\n欲寄彩笺兼尺素\n山长水阔知何处\n灯火阑珊人独立',
      en: 'Alone on the high tower, gazing at the world\'s end,\nWanting to send a colored note and a letter.\nMountains long, waters wide, where to find you?\nLanterns dim, a figure stands alone.',
    },
    interpretation: {
      zh: '你正感到孤独和迷茫。这不是你的错，也不代表你做错了什么。孤独是人生的常态，学会与它共处比逃避它更重要。今天，试着把这份感受写下来，或者告诉一个信任的人——表达本身就是疗愈。',
      en: 'You are feeling lonely and lost. This is not your fault, nor does it mean you did something wrong. Loneliness is a normal part of life; learning to coexist with it matters more than escaping it. Today, try writing this feeling down, or telling someone you trust — expression itself is healing.',
    },
    blessing: { zh: '独处有时，灯火可亲', en: 'Solitude has its time; lamplight brings warmth' },
  },
  {
    id: 'lot-28',
    number: 28,
    level: 'lower',
    element: 'water',
    poem: {
      zh: '昨夜西风凋碧树\n独上高楼望尽天涯路\n欲寄彩笺兼尺素\n山长水阔知何处',
      en: 'Last night west wind withered the green trees,\nAlone on the high tower, gazing at the world\'s end.\nWanting to send a colored note and a letter,\nMountains long, waters wide, where to find you?',
    },
    interpretation: {
      zh: '有些东西正在离你而去。失去是痛苦的，但紧抓不放更痛。允许自己悲伤——悲伤不是软弱，而是爱的证明。当你准备好时，放手会让空间打开，新的可能才能进入。',
      en: 'Something is leaving you. Loss is painful, but gripping tighter hurts more. Allow yourself to grieve — grief is not weakness but proof of love. When you are ready, letting go opens space for new possibilities to enter.',
    },
    blessing: { zh: '放手有时，新生将至', en: 'A time to release; renewal approaches' },
  },
  {
    id: 'lot-29',
    number: 29,
    level: 'lower',
    element: 'earth',
    poem: {
      zh: '山重水复疑无路\n柳暗花明又一村\n莫疑前路无知己\n天下谁人不识君',
      en: 'Mountains pile, waters wind, doubting there is a way,\nPast dark willows, another village blooms.\nDoubt not the road ahead lacks friends,\nWho in this world does not know you?',
    },
    interpretation: {
      zh: '你正处在"疑无路"的阶段。这种迷茫是真实的，但不是永恒的。你现在看不到出路，不代表出路不存在。给自己一点耐心——很多时候，转机就在你准备放弃的下一刻。坚持不是硬撑，而是带着怀疑继续走。',
      en: 'You are in the "doubting there is a way" phase. This confusion is real but not eternal. Not seeing a way out now does not mean one does not exist. Give yourself some patience — often the turning point comes the moment after you were ready to give up. Persistence is not forcing; it is continuing with doubt.',
    },
    blessing: { zh: '疑路将尽，转机在望', en: 'The doubtful road ends; a turning point nears' },
  },
  {
    id: 'lot-30',
    number: 30,
    level: 'bottom',
    element: 'water',
    poem: {
      zh: '寒雨连江夜入吴\n平明送客楚山孤\n洛阳亲友如相问\n一片冰心在玉壶',
      en: 'Cold rain joins the river, night entering Wu,\nAt dawn I see you off, Chu mountains lonely.\nIf Luoyang friends ask of me,\nA heart of ice in a jade jug.',
    },
    interpretation: {
      zh: '这是最艰难的时刻，但也是最考验真心的时刻。外界寒冷，但你内心的"冰心"——那份清明和坚守——是你最大的财富。这段经历会过去，而你会带着更深的自己走出来。不必假装坚强，真实的脆弱也是力量。寻求支持，不要独自承受。',
      en: 'This is the hardest moment, but also the one that most tests your true heart. The outside is cold, but your inner "heart of ice" — that clarity and steadfastness — is your greatest wealth. This experience will pass, and you will emerge with a deeper self. No need to pretend strength; authentic vulnerability is also power. Seek support; do not bear it alone.',
    },
    blessing: { zh: '冰心玉壶，守得云开', en: 'Ice heart in jade; clouds will part' },
  },
];

// 随机抽签（加权概率：上上签/上签较多给惊喜，中签最多，下签/下下签略少但保留）
const WEIGHTS: Record<LotLevel, number> = {
  supreme: 3,   // 上上签 — 较多，给用户惊喜与鼓励
  upper: 4,     // 上签 — 较多
  middle: 5,    // 中签 — 最多，平和稳妥
  lower: 2,     // 下签 — 略少但保留
  bottom: 1,    // 下下签 — 最少但保留
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
