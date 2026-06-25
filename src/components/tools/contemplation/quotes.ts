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
];
