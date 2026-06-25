export interface Quote {
  zh: string;
  en: string;
  author: string;
}

export interface Theme {
  id: string;
  emoji: string;
  name: { zh: string; en: string };
  quotes: Quote[];
}

export const contemplationThemes: Theme[] = [
  {
    id: 'universe',
    emoji: '🌌',
    name: { zh: '宇宙', en: 'Universe' },
    quotes: [
      {
        zh: '我们都在阴沟里，但仍有人仰望星空。',
        en: 'We are all in the gutter, but some of us are looking at the stars.',
        author: '王尔德 / Oscar Wilde',
      },
      {
        zh: '宇宙不仅比我们想象的更奇怪，而且比我们能想象的更奇怪。',
        en: 'The universe is not only queerer than we suppose, but queerer than we can suppose.',
        author: '霍尔丹 / J.B.S. Haldane',
      },
      {
        zh: '星辰大海，不过是意识的一场梦。',
        en: 'The stars and seas are but a dream of consciousness.',
        author: '原创 / Original',
      },
      {
        zh: '在无限的时间面前，我们都是过客；但在无限的宇宙面前，我们都是孩子。',
        en: 'Before infinite time, we are all travelers; but before infinite space, we are all children.',
        author: '原创 / Original',
      },
      {
        zh: '两个事物无穷地占据着我的灵魂：我头顶的星空和我心中的道德法则。',
        en: 'Two things fill the mind with ever new and increasing admiration: the starry heavens above and the moral law within.',
        author: '康德 / Immanuel Kant',
      },
      {
        zh: '宇宙的内部是沉默，沉默的内部是宇宙。',
        en: 'Within the universe is silence; within silence is the universe.',
        author: '原创 / Original',
      },
      {
        zh: '每一颗星星都是一面镜子，映照着我们未曾说出口的话。',
        en: 'Every star is a mirror, reflecting the words we never spoke.',
        author: '原创 / Original',
      },
      {
        zh: '在宇宙的尺度上，我们渺小如尘；但在意识的尺度上，我们就是宇宙本身。',
        en: 'On the scale of the universe, we are dust; but on the scale of consciousness, we are the universe itself.',
        author: '原创 / Original',
      },
      {
        zh: '夜空不是空无，而是无数光年外的问候。',
        en: 'The night sky is not emptiness, but greetings from countless light-years away.',
        author: '原创 / Original',
      },
      {
        zh: '当我们仰望星空时，星空也在仰望我们。',
        en: 'When we gaze at the stars, the stars gaze back at us.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'electromagnetism',
    emoji: '⚡',
    name: { zh: '电磁', en: 'Electromagnetism' },
    quotes: [
      {
        zh: '电与磁，是宇宙最优雅的二重奏。',
        en: 'Electricity and magnetism are the universe\'s most elegant duet.',
        author: '原创 / Original',
      },
      {
        zh: '场，是物质与空间之间无声的对话。',
        en: 'A field is the silent dialogue between matter and space.',
        author: '原创 / Original',
      },
      {
        zh: '光，不过是电磁波的一场舞蹈。',
        en: 'Light is but a dance of electromagnetic waves.',
        author: '原创 / Original',
      },
      {
        zh: '麦克斯韦方程组，是上帝写给宇宙的情书。',
        en: 'Maxwell\'s equations are God\'s love letter to the universe.',
        author: '物理学家谚语 / Physicists\' proverb',
      },
      {
        zh: '每一个电荷都在呼唤，每一个磁场都在回应。',
        en: 'Every charge calls out, every magnetic field responds.',
        author: '原创 / Original',
      },
      {
        zh: '法拉第看见了看不见的力线，从此世界改变了模样。',
        en: 'Faraday saw the invisible lines of force, and the world was changed forever.',
        author: '原创 / Original',
      },
      {
        zh: '电磁波穿越虚空，携带着信息的种子，在接收者心中生根发芽。',
        en: 'Electromagnetic waves traverse the void, carrying seeds of information that take root in the receiver\'s mind.',
        author: '原创 / Original',
      },
      {
        zh: '正负相吸，同极相斥，这是宇宙最基本的社交法则。',
        en: 'Opposites attract, likes repel—this is the universe\'s most basic social rule.',
        author: '原创 / Original',
      },
      {
        zh: '电流的方向是人为的，但能量的流动是真实的。',
        en: 'The direction of current is arbitrary, but the flow of energy is real.',
        author: '原创 / Original',
      },
      {
        zh: '在电磁的世界里，每一次感应都是一场跨越时空的握手。',
        en: 'In the world of electromagnetism, every induction is a handshake across space and time.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'digital',
    emoji: '💻',
    name: { zh: '数字世界', en: 'Digital World' },
    quotes: [
      {
        zh: '代码是新的咒语，程序员是现代的巫师。',
        en: 'Code is the new magic, and programmers are the modern wizards.',
        author: '原创 / Original',
      },
      {
        zh: '在 0 和 1 之间，藏着整个宇宙的可能性。',
        en: 'Between 0 and 1 lies the possibility of an entire universe.',
        author: '原创 / Original',
      },
      {
        zh: '我们创造了计算机，计算机重塑了我们。',
        en: 'We created the computer, and the computer remade us.',
        author: '原创 / Original',
      },
      {
        zh: '图灵机可以计算一切，除了意义本身。',
        en: 'A Turing machine can compute everything, except meaning itself.',
        author: '原创 / Original',
      },
      {
        zh: '虚拟不是真实的对立面，而是真实的延伸。',
        en: 'Virtual is not the opposite of real, but its extension.',
        author: '原创 / Original',
      },
      {
        zh: '每一行代码，都是人类思维的一次呼吸。',
        en: 'Every line of code is a breath of human thought.',
        author: '原创 / Original',
      },
      {
        zh: '算法是决策的乐谱，数据是演奏的乐器。',
        en: 'Algorithms are the sheet music of decisions, data the instruments that play them.',
        author: '原创 / Original',
      },
      {
        zh: '在数字的洪流中，我们既是冲浪者，也是浪花。',
        en: 'In the digital flood, we are both the surfers and the waves.',
        author: '原创 / Original',
      },
      {
        zh: '比特是信息的原子，构建起无形的帝国。',
        en: 'Bits are the atoms of information, building invisible empires.',
        author: '原创 / Original',
      },
      {
        zh: '当机器学会思考，人类才真正开始认识自己。',
        en: 'When machines learn to think, humans truly begin to understand themselves.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'cycle',
    emoji: '🔄',
    name: { zh: '轮回', en: 'Cycle' },
    quotes: [
      {
        zh: '死亡不是终点，而是另一段旅程的起点。',
        en: 'Death is not the end, but the beginning of another journey.',
        author: '原创 / Original',
      },
      {
        zh: '生如夏花之绚烂，死如秋叶之静美。',
        en: 'Life is like summer flowers, splendid; death is like autumn leaves, serene.',
        author: '泰戈尔 / Rabindranath Tagore',
      },
      {
        zh: '轮回不是重复，而是螺旋上升的觉醒。',
        en: 'Reincarnation is not repetition, but a spiraling awakening.',
        author: '原创 / Original',
      },
      {
        zh: '每一次结束，都是新开始的伪装。',
        en: 'Every ending is a beginning in disguise.',
        author: '原创 / Original',
      },
      {
        zh: '时间是一条河，我们都是其中的水滴，既是起点也是终点。',
        en: 'Time is a river, and we are all drops within it—both the beginning and the end.',
        author: '原创 / Original',
      },
      {
        zh: '永恒不在时间之中，而在时间之外。',
        en: 'Eternity is not within time, but beyond it.',
        author: '原创 / Original',
      },
      {
        zh: '四季更替，不是岁月的流逝，而是生命的呼吸。',
        en: 'The changing seasons are not the passage of time, but the breathing of life.',
        author: '原创 / Original',
      },
      {
        zh: '凤凰涅槃，不是毁灭，而是重生的仪式。',
        en: 'The phoenix rises not from destruction, but from the ritual of rebirth.',
        author: '原创 / Original',
      },
      {
        zh: '每一个清晨，都是黑夜的轮回；每一次日落，都是光明的暂别。',
        en: 'Every dawn is a reincarnation of night; every sunset, a temporary farewell of light.',
        author: '原创 / Original',
      },
      {
        zh: '轮回的真谛，不是记住过去，而是活在当下。',
        en: 'The truth of reincarnation is not to remember the past, but to live in the present.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'light',
    emoji: '💡',
    name: { zh: '光线与时间', en: 'Light & Time' },
    quotes: [
      {
        zh: '光是时间的信使，每一束都跨越了漫长的旅程。',
        en: 'Light is the messenger of time, each beam crossing a long journey.',
        author: '原创 / Original',
      },
      {
        zh: '我们看见的星光，来自亿万年前；时间在光中被折叠。',
        en: 'The starlight we see is billions of years old; time is folded in light.',
        author: '原创 / Original',
      },
      {
        zh: '光速是宇宙的速度极限，也是时间的边界。',
        en: 'The speed of light is the universe\'s speed limit, and the boundary of time.',
        author: '原创 / Original',
      },
      {
        zh: '在光的世界里，过去与未来同时存在。',
        en: 'In the world of light, past and future exist simultaneously.',
        author: '原创 / Original',
      },
      {
        zh: '一道光从太阳到地球，需要八分钟；这是光的呼吸。',
        en: 'Light takes eight minutes from sun to earth; this is the breath of light.',
        author: '原创 / Original',
      },
      {
        zh: '时间是光影的雕刻师，将瞬间塑造成永恒。',
        en: 'Time is the sculptor of light and shadow, shaping moments into eternity.',
        author: '原创 / Original',
      },
      {
        zh: '光不认识时间，它只认识方向。',
        en: 'Light knows not time, only direction.',
        author: '原创 / Original',
      },
      {
        zh: '当光足够快，时间就足够慢。',
        en: 'When light is fast enough, time slows enough.',
        author: '原创 / Original',
      },
      {
        zh: '每一缕阳光，都是时间写给地球的情书。',
        en: 'Every ray of sunlight is a love letter from time to earth.',
        author: '原创 / Original',
      },
      {
        zh: '光的颜色，是时间的频率；时间的流逝，是光的波长。',
        en: 'The color of light is the frequency of time; the flow of time is the wavelength of light.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'inspiration',
    emoji: '✨',
    name: { zh: '灵感', en: 'Inspiration' },
    quotes: [
      {
        zh: '灵感像蝴蝶，你越追逐它，它越飞远；静下来，它落在你肩上。',
        en: 'Inspiration is like a butterfly; chase it and it flees, sit still and it lands on your shoulder.',
        author: '原创 / Original',
      },
      {
        zh: '灵感不会敲门，它从缝隙中溜进来。',
        en: 'Inspiration doesn\'t knock; it slips through the cracks.',
        author: '原创 / Original',
      },
      {
        zh: '最好的灵感，往往来自最不经意的瞬间。',
        en: 'The best inspiration often comes from the most unexpected moments.',
        author: '原创 / Original',
      },
      {
        zh: '灵感是潜意识的礼物，包装是直觉，拆开需要勇气。',
        en: 'Inspiration is a gift from the subconscious, wrapped in intuition, opened with courage.',
        author: '原创 / Original',
      },
      {
        zh: '创意不是无中生有，而是旧元素的新组合。',
        en: 'Creativity isn\'t making something from nothing, but new combinations of old elements.',
        author: '原创 / Original',
      },
      {
        zh: '灵感来时如闪电，去时如晨雾。',
        en: 'Inspiration comes like lightning, leaves like morning mist.',
        author: '原创 / Original',
      },
      {
        zh: '保持好奇，灵感无处不在；关闭心门，世界一片灰暗。',
        en: 'Stay curious, inspiration is everywhere; close your heart, and the world goes grey.',
        author: '原创 / Original',
      },
      {
        zh: '灵感不是等来的，是走出来的。',
        en: 'Inspiration isn\'t waited for, it\'s walked into.',
        author: '原创 / Original',
      },
      {
        zh: '最可爱的想法，往往诞生于最放松的时刻。',
        en: 'The loveliest ideas are often born in the most relaxed moments.',
        author: '原创 / Original',
      },
      {
        zh: '灵感是心灵的彩虹，需要雨后才有光。',
        en: 'Inspiration is the rainbow of the soul; it needs rain before there is light.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'nature',
    emoji: '🌿',
    name: { zh: '大自然', en: 'Nature' },
    quotes: [
      {
        zh: '大自然不急于求成，而万事皆成。',
        en: 'Nature does not hurry, yet everything is accomplished.',
        author: '老子 / Lao Tzu',
      },
      {
        zh: '走进森林，就是走进自己的内心。',
        en: 'To walk into the forest is to walk into your own heart.',
        author: '原创 / Original',
      },
      {
        zh: '山教会我们沉稳，水教会我们柔软。',
        en: 'Mountains teach us steadiness, water teaches us softness.',
        author: '原创 / Original',
      },
      {
        zh: '每一片叶子，都是大自然写给世界的诗。',
        en: 'Every leaf is a poem nature writes to the world.',
        author: '原创 / Original',
      },
      {
        zh: '户外的风，吹散心头的雾。',
        en: 'The outdoor wind disperses the fog in the mind.',
        author: '原创 / Original',
      },
      {
        zh: '在大自然面前，所有的烦恼都变得渺小。',
        en: 'Before nature, all worries become small.',
        author: '原创 / Original',
      },
      {
        zh: '仰望一棵老树，你看见的是时间的形状。',
        en: 'Look up at an old tree, and you see the shape of time.',
        author: '原创 / Original',
      },
      {
        zh: '河流不问前路，只管前行；它教会我们坚持。',
        en: 'The river doesn\'t ask the way, just flows forward; it teaches persistence.',
        author: '原创 / Original',
      },
      {
        zh: '日出是大自然的微笑，日落是它的叹息。',
        en: 'Sunrise is nature\'s smile, sunset its sigh.',
        author: '原创 / Original',
      },
      {
        zh: '我们不是自然的主人，只是它的一部分。',
        en: 'We are not masters of nature, only a part of it.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'rules',
    emoji: '📐',
    name: { zh: '规则', en: 'Rules' },
    quotes: [
      {
        zh: '规则是自由的边界，自由是规则的呼吸。',
        en: 'Rules are the boundary of freedom; freedom is the breath of rules.',
        author: '原创 / Original',
      },
      {
        zh: '懂得规则，才能超越规则。',
        en: 'Only by understanding the rules can you transcend them.',
        author: '原创 / Original',
      },
      {
        zh: '规则像铁轨，限制方向，却让列车飞驰。',
        en: 'Rules are like rails: they limit direction, yet let the train speed.',
        author: '原创 / Original',
      },
      {
        zh: '最好的规则，是让人忘记规则的存在。',
        en: 'The best rules make you forget they exist.',
        author: '原创 / Original',
      },
      {
        zh: '规则保护弱者，也约束强者。',
        en: 'Rules protect the weak, and restrain the strong.',
        author: '原创 / Original',
      },
      {
        zh: '打破规则容易，建立新规则很难。',
        en: 'Breaking rules is easy; building new ones is hard.',
        author: '原创 / Original',
      },
      {
        zh: '规则的尽头，是直觉的起点。',
        en: 'The end of rules is the beginning of intuition.',
        author: '原创 / Original',
      },
      {
        zh: '宇宙运行靠规则，人生亦然。',
        en: 'The universe runs on rules, and so does life.',
        author: '原创 / Original',
      },
      {
        zh: '规则是前人摔过的跤，铺成的路。',
        en: 'Rules are the path paved by the stumbles of those before us.',
        author: '原创 / Original',
      },
      {
        zh: '遵守规则是礼貌，理解规则是智慧。',
        en: 'Following rules is courtesy; understanding rules is wisdom.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'chaos',
    emoji: '👁️',
    name: { zh: '混沌与人性', en: 'Chaos & Human' },
    quotes: [
      {
        zh: '混沌中诞生秩序，秩序中孕育混沌。',
        en: 'Order is born of chaos, and chaos brews within order.',
        author: '原创 / Original',
      },
      {
        zh: '人性是光明与黑暗的交汇地。',
        en: 'Human nature is where light and darkness meet.',
        author: '原创 / Original',
      },
      {
        zh: '在混沌中，我们看见自己的影子。',
        en: 'In chaos, we see our own shadow.',
        author: '原创 / Original',
      },
      {
        zh: '每个人心中都有一只野兽，文明只是它的笼子。',
        en: 'There\'s a beast in every heart; civilization is merely its cage.',
        author: '原创 / Original',
      },
      {
        zh: '混沌不是无序，而是更高维度的秩序。',
        en: 'Chaos is not disorder, but order of a higher dimension.',
        author: '原创 / Original',
      },
      {
        zh: '人性复杂如迷宫，连自己也常迷路。',
        en: 'Human nature is a maze; even we ourselves often get lost.',
        author: '原创 / Original',
      },
      {
        zh: '欲望是混沌的引擎，理性是它的方向盘。',
        en: 'Desire is the engine of chaos, reason its steering wheel.',
        author: '原创 / Original',
      },
      {
        zh: '在人性的深渊里，凝视也会回望你。',
        en: 'In the abyss of human nature, the gaze looks back at you.',
        author: '原创 / Original',
      },
      {
        zh: '混沌让我们谦卑，秩序让我们自信。',
        en: 'Chaos makes us humble, order makes us confident.',
        author: '原创 / Original',
      },
      {
        zh: '理解混沌，就是理解自由的代价。',
        en: 'To understand chaos is to understand the price of freedom.',
        author: '原创 / Original',
      },
    ],
  },
  {
    id: 'time',
    emoji: '⏳',
    name: { zh: '时间', en: 'Time' },
    quotes: [
      {
        zh: '时间是唯一公平的东西，每人每天 24 小时。',
        en: 'Time is the only fair thing: 24 hours a day for everyone.',
        author: '原创 / Original',
      },
      {
        zh: '过去无法改变，未来尚未到来，唯有现在属于你。',
        en: 'The past can\'t be changed, the future hasn\'t come, only the present is yours.',
        author: '原创 / Original',
      },
      {
        zh: '时间不语，却回答了所有问题。',
        en: 'Time says nothing, yet answers everything.',
        author: '原创 / Original',
      },
      {
        zh: '快乐时时间飞逝，痛苦时度秒如年。',
        en: 'Time flies when happy, drags when in pain.',
        author: '原创 / Original',
      },
      {
        zh: '时间是最伟大的作者，它写出完美的结局。',
        en: 'Time is the greatest author; it writes perfect endings.',
        author: '原创 / Original',
      },
      {
        zh: '浪费别人的时间是谋财，浪费自己的时间是自杀。',
        en: 'Wasting others\' time is robbery; wasting your own is suicide.',
        author: '原创 / Original',
      },
      {
        zh: '时间像河水，你无法两次踏入同一条河。',
        en: 'Time is like a river; you can\'t step into the same river twice.',
        author: '赫拉克利特 / Heraclitus',
      },
      {
        zh: '时间治愈一切，也冲淡一切。',
        en: 'Time heals everything, and dilutes everything.',
        author: '原创 / Original',
      },
      {
        zh: '时间是幻觉，但它是非常顽固的幻觉。',
        en: 'Time is an illusion, but a very stubborn one.',
        author: '爱因斯坦 / Einstein',
      },
      {
        zh: '抓住今天，因为明天永不确定。',
        en: 'Seize the day, for tomorrow is never certain.',
        author: '贺拉斯 / Horace',
      },
    ],
  },
];
