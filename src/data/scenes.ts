// 场景数据类型
export interface Character {
  name: string;
  emoji: string;
  description: string;
}

export type OptionLevel = 'low' | 'medium' | 'high' | 'god' | 'anti';

export interface Option {
  id: string;
  level: OptionLevel;
  content: string;
  score: number;
}

export interface Scene {
  id: string;
  title: string;
  emoji: string;
  description: string;
  bgImage: string; // 背景配图
  characters: Character[];
  triggerDialog: string;
  options: Option[];
}

// 场景数据
export const scenes: Scene[] = [
  {
    id: 'family-dinner',
    title: '年夜饭·七大姑八大姨',
    emoji: '🧨',
    description: '过年回家，年夜饭桌上的灵魂拷问',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Japanese+anime+comedy+style+first-person+POV+low+angle+shot+Chinese+New+Year+family+dinner+round+table+scene+players+hands+visible+at+bottom+on+table+left+side+aunt+standing+up+leaning+forward+toward+camera+fake+smile+four+relatives+around+table+all+leaning+forward+watching+camera+some+laughing+some+nodding+dumplings+fish+dishes+fireworks+decorations+on+table+warm+yellow+indoor+lighting+Q+version+cute+chibi+thick+paint+illustration+high+saturation+warm+colors+clean+lines+no+text+comic+speed+lines+for+tension+game+event+card+style+detailed+rich+atmosphere&image_size=landscape_16_9',
    characters: [
      { name: '大姑', emoji: '👩', description: '催婚主力军' },
      { name: '表姐', emoji: '👱‍♀️', description: '别人家的孩子' },
      { name: '奶奶', emoji: '👵', description: '慈祥的旁观者' }
    ],
    triggerDialog: '小X啊，你看你表姐都生二胎了，你咋还不找对象呢？来来来，大姑敬你一杯，祝你明年脱单！赶紧把这杯喝了！',
    options: [
      {
        id: 'family-low',
        level: 'low',
        content: '大姑，我的事不用你管，我又不是找不到。',
        score: 20
      },
      {
        id: 'family-medium',
        level: 'medium',
        content: '哈哈大姑，缘分还没到嘛，不着急~',
        score: 55
      },
      {
        id: 'family-high',
        level: 'high',
        content: '大姑！这杯我干了！但我得先找个像姑父这么优秀的，您帮我参谋参谋？',
        score: 80
      },
      {
        id: 'family-god',
        level: 'god',
        content: '大姑这杯酒我必须喝！您这是把我当自己孩子疼！不过我现在单身，年终奖全给您买保健品，脱单了可就没这待遇了哈！',
        score: 95
      },
      {
        id: 'family-anti',
        level: 'anti',
        content: '大姑，您说得对！表姐确实优秀，不像我就知道吃！不过您咋不问问表姐夫年终奖多少呢？比我爸给的零花钱多吗？对了二叔，您儿子今年考研咋样了？',
        score: 100
      }
    ]
  },
  {
    id: 'workplace',
    title: '职场·老板的送命题',
    emoji: '💼',
    description: '周五下班前的"不着急"任务',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Japanese+anime+exaggerated+comedy+style+first-person+POV+low+angle+office+scene+players+hands+holding+backpack+visible+at+bottom+bald+potbellied+middle-aged+boss+in+front+leaning+toward+camera+smiling+fake+smile+asking+about+overtime+right+side+female+colleague+leaning+on+desk+arms+crossed+smirking+watching+drama+background+desks+computers+files+sunset+window+lighting+other+colleagues+peeking+warm+office+lighting+Q+version+cute+chibi+thick+paint+style+clean+lines+high+saturation+no+text+comic+speed+lines+for+impact+game+level+background+detailed+rich+workplace+pressure+atmosphere&image_size=landscape_16_9',
    characters: [
      { name: '王总', emoji: '🤵', description: '笑里藏刀型领导' },
      { name: '李经理', emoji: '👨‍💼', description: '旁边看戏的同事' }
    ],
    triggerDialog: '小X啊，这个方案周一要用，你看看周末能不能加个班赶一下？放心，不着急，你看着安排就行。',
    options: [
      {
        id: 'work-low',
        level: 'low',
        content: '周末我有事，而且这也不是一个周末能搞完的。',
        score: 15
      },
      {
        id: 'work-medium',
        level: 'medium',
        content: '好的王总，我尽量周末赶出来。',
        score: 50
      },
      {
        id: 'work-high',
        level: 'high',
        content: '王总，我周末可以搞！不过有几个关键点想跟您确认下，免得周一还得改，您看明天方便打个电话吗？',
        score: 82
      },
      {
        id: 'work-god',
        level: 'god',
        content: '王总您放心！不过这方案要让客户眼前一亮，我可能需要李经理那边的数据支持，您看能不能帮我协调一下？咱争取一稿过！',
        score: 96
      },
      {
        id: 'work-anti',
        level: 'anti',
        content: '王总，周末加班可以啊！不过按劳动法，周末加班是平时工资的两倍，您看是申请调休还是现金结算？对了，您上周说报销的差旅费什么时候到账啊？',
        score: 100
      }
    ]
  },
  {
    id: 'business-dinner',
    title: '酒局·被迫营业',
    emoji: '🍻',
    description: '客户敬酒，项目生死未卜',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Japanese+anime+comedy+style+first-person+POV+low+angle+Chinese+restaurant+private+room+round+table+scene+players+hands+on+table+visible+at+bottom+center+bald+potbellied+middle-aged+leader+super+close-up+face+close+to+lens+flushed+red+cheeks+from+alcohol+fake+smile+holding+wine+glass+toward+camera+four+drunk+red-faced+business+clients+around+table+all+leaning+forward+raising+glasses+bottles+cheering+hotpot+skewers+beer+dishes+on+table+warm+gold+private+room+lighting+Q+version+cute+chibi+thick+paint+illustration+soft+brushstrokes+warm+colors+no+text+depth+of+field+blur+comic+speed+lines+pressure+tension+game+scene+card+style+rich+detailed+atmosphere&image_size=landscape_16_9',
    characters: [
      { name: '刘总', emoji: '👨', description: '豪爽型客户' },
      { name: '张哥', emoji: '🧔', description: '你的直属领导' }
    ],
    triggerDialog: '小X！我听说你们年轻人都能喝！来，咱俩走一个！这杯喝了，后面那个项目的事儿好说！',
    options: [
      {
        id: 'dinner-low',
        level: 'low',
        content: '刘总不好意思，我不能喝酒，医生不让。',
        score: 25
      },
      {
        id: 'dinner-medium',
        level: 'medium',
        content: '刘总我干了您随意！项目的事您放心！',
        score: 50
      },
      {
        id: 'dinner-high',
        level: 'high',
        content: '刘总！跟您喝酒是福气！这杯我先干为敬！不过项目的事儿，就算不喝酒我也得给您办漂亮了，谁让您是我最重视的客户呢！',
        score: 85
      },
      {
        id: 'dinner-god',
        level: 'god',
        content: '刘总！这杯必须喝！但我得跟您说实话——我酒量不行，喝多了怕耽误给您干活。这样，我先干三杯表诚意，剩下的让我用项目质量来还，您看行不？',
        score: 98
      },
      {
        id: 'dinner-anti',
        level: 'anti',
        content: '刘总！喝！但是我有个小问题——您说的项目是签完合同的那个，还是您随口说说那个？张哥，您知道吗？对了刘总，您血糖高不高？我看您脸色最近有点红啊...',
        score: 100
      }
    ]
  }
];

// 段位信息
export interface Level {
  name: string;
  emoji: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export const levels: Level[] = [
  { name: '抗压之王', emoji: '🔥', description: '整顿职场，拒绝内耗！老板听了都沉默', minScore: 100, maxScore: 100 },
  { name: '情商之神', emoji: '👑', description: '社交天花板，行走的人际关系教科书', minScore: 90, maxScore: 99 },
  { name: '情商达人', emoji: '😎', description: '八面玲珑，大多数场合游刃有余', minScore: 70, maxScore: 89 },
  { name: '及格选手', emoji: '😅', description: '不功不过，偶尔踩雷', minScore: 40, maxScore: 69 },
  { name: '社交杀手', emoji: '💀', description: '建议闭关修炼，先从微笑开始', minScore: 0, maxScore: 39 }
];

// 获取段位
export function getLevel(score: number): Level {
  for (const level of levels) {
    if (score >= level.minScore && score <= level.maxScore) {
      return level;
    }
  }
  return levels[levels.length - 1];
}

// 获取段位对应的等级
export function getOptionLevel(level: OptionLevel): Level {
  const levelMap: Record<OptionLevel, Level> = {
    'anti': levels[0],
    'low': levels[4],
    'medium': levels[3],
    'high': levels[2],
    'god': levels[1]
  };
  return levelMap[level];
}
