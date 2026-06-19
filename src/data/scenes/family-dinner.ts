import type { Scene } from '../types';

const scene: Scene = {
  id: 'family-dinner',
  title: {
    zh: '年夜饭·七大姑八大姨',
    en: 'Family Dinner · The Relatives Are Coming',
  },
  emoji: '🧨',
  description: {
    zh: '年夜饭连环灵魂拷问，招架不住当场社死',
    en: "Endless probing questions at dinner. Dodge wisely or face social death",
  },
  bgImage: new URL('../../assets/bg-family-dinner.svg', import.meta.url).href,
  bgColor: 'from-red-500/80 via-orange-400/60 to-amber-500/70',
  accentColor: 'red',
  characters: [
    {
      name: { zh: '大姑', en: 'Auntie' },
      emoji: '👵',
      description: {
        zh: '全年在线催婚催生主力选手',
        en: "The #1 marriage-pressure specialist, online 24/7",
      },
    },
    {
      name: { zh: '表姐', en: 'Cousin' },
      emoji: '👱‍♀️',
      description: {
        zh: '常年用来对比的"别人家孩子"',
        en: "The benchmark 'someone else's kid'",
      },
    },
    {
      name: { zh: '二叔', en: 'Uncle' },
      emoji: '🧔',
      description: {
        zh: '最爱刨根问底打探收入存款',
        en: "Loves digging into your salary and savings",
      },
    },
  ],
  questions: [
    {
      id: 'family-dinner-q1',
      triggerDialog: {
        zh: "小X啊，你看你表姐都生二胎儿女双全了，你咋还迟迟不找对象呢？来来来大姑敬你一杯，祝你明年火速脱单，赶紧把这杯干了！",
        en: "Hey dear, your cousin already has two kids now — when are YOU getting a boyfriend? C'mon, drink up! Auntie toasts to you finding someone next year! Bottoms up!",
      },
      options: [
        {
          id: 'family-q1-low',
          level: 'low',
          content: {
            zh: '大姑，我的私事用不着您操心，我又不是没人要。',
            en: "Auntie, my love life is none of your business — it's not like I can't find someone.",
          },
          score: 20,
        },
        {
          id: 'family-q1-medium',
          level: 'medium',
          content: {
            zh: '哈哈大姑，缘分这东西急不来，顺其自然慢慢碰呗~',
            en: "Haha auntie, love can't be rushed. I'll take things one step at a time~",
          },
          score: 55,
        },
        {
          id: 'family-q1-high',
          level: 'high',
          content: {
            zh: '大姑这杯我仰头干了！找对象我也想啊，择偶标准都照着姑父踏实靠谱的模板找，您以后碰到合适的记得帮我牵线把关！',
            en: "Down the hatch auntie! Trust me, I want a boyfriend too. I've been using uncle's honest, reliable personality as my benchmark. If you meet someone nice, you'll be the first to know!",
          },
          score: 80,
        },
        {
          id: 'family-q1-god',
          level: 'god',
          content: {
            zh: '大姑谢谢您这么惦记我！这杯酒我必须喝。我现在单身攒钱自由，逢年过节还能给您买补品送礼物，真等谈恋爱结婚花钱，往后可没多余零花钱孝敬您咯！',
            en: "Thank you for caring so much auntie! I must drink this. Right now I'm free, I save money, and I can still buy you gifts every holiday. Once I start dating and spending on weddings... there won't be any spare cash left to spoil YOU with!",
          },
          score: 95,
        },
        {
          id: 'family-q1-anti',
          level: 'anti',
          content: {
            zh: '大姑您说得太对，表姐人生赢家太厉害了！咱别光盯着我单身，您咋不问问表姐夫年终奖到手多少钱，零花钱够不够表姐花？二叔，您家儿子今年考研上岸没？',
            en: "Auntie you're SO right, cousin really has it all! But hey, instead of focusing on me being single — why don't you ask cousin's husband how big his year-end bonus was, and if his allowance is enough for her? Uncle! Did your son pass the grad-school entrance exam this year?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'family-dinner-q2',
      triggerDialog: {
        zh: "小X啊，你今年工资涨了没？隔壁王阿姨家儿子年薪上百万，你也跟大伙说说收入，让亲戚们跟着沾沾喜气呗？",
        en: "Hey, did you get a raise this year? Auntie Wang's son makes over a million a year. Tell us your income — let us share in your good fortune!",
      },
      options: [
        {
          id: 'family-q2-low',
          level: 'low',
          content: {
            zh: '工资是我隐私，又不是您发薪水，没必要到处往外说。',
            en: "My salary is private. You're not paying me — there's no need to share it with everyone.",
          },
          score: 20,
        },
        {
          id: 'family-q2-medium',
          level: 'medium',
          content: {
            zh: '收入凑合够养活自己，平平淡淡，没啥值得显摆的。',
            en: "Enough to get by. Nothing worth bragging about — just making ends meet.",
          },
          score: 55,
        },
        {
          id: 'family-q2-high',
          level: 'high',
          content: {
            zh: '大姑您放心，老板已经许诺明年给我调薪，等涨工资第一时间给您包个大红包孝敬您！',
            en: "Don't worry auntie — my boss already promised a raise next year. First thing I'll do with it is give YOU a big red envelope!",
          },
          score: 80,
        },
        {
          id: 'family-q2-god',
          level: 'god',
          content: {
            zh: '大姑您这个问题太难回答了！比上不足比下有余，跟姑父积蓄比我差老远，跟王阿姨家百万年薪更是没法比。不如聊聊表姐夫今年过年给您包了多少红包？',
            en: "Oof that's a tough one auntie! I'm doing OK — not as much as some, but more than others. Compared to uncle's savings I'm nowhere close, and compared to auntie Wang's millionaire son? Not even in the same league. Hey, let's talk about something more interesting: how big was cousin's husband's red envelope to YOU this year?",
          },
          score: 95,
        },
        {
          id: 'family-q2-anti',
          level: 'anti',
          content: {
            zh: '好家伙大姑，您是打算主动给我补发压岁钱补贴生活费？年薪百万那位是隔壁王阿姨儿子，您想打听收入直接去找他唠！顺带一问您退休金今年涨多少？二叔欠您那三万块还清了吗？',
            en: "Wow auntie, are YOU going to top up my lucky-money allowance?! That millionaire is auntie Wang's son — if you want salary gossip, go ask HER! By the way, did your pension go up this year? And uncle — did you ever pay back that 30,000 you owed her?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'family-dinner-q3',
      triggerDialog: {
        zh: "你看身边同龄人都买房买车安家了，你咋还租房住呢？攒钱啥时候是个头，早点买房成家才安稳啊！",
        en: "All your friends are buying houses and cars now — why are YOU still renting? When are you gonna stop saving and actually settle down? Buying property is the only real stability!",
      },
      options: [
        {
          id: 'family-q3-low',
          level: 'low',
          content: {
            zh: '买房压力太大买不起，别总拿买房说事念叨我了。',
            en: "Housing is way too expensive. Stop nagging me about buying property.",
          },
          score: 21,
        },
        {
          id: 'family-q3-medium',
          level: 'medium',
          content: {
            zh: '慢慢来规划存钱呢，攒够首付预算就着手看房。',
            en: "Taking it slow, saving bit by bit. Once I hit a down payment, I'll start looking.",
          },
          score: 54,
        },
        {
          id: 'family-q3-high',
          level: 'high',
          content: {
            zh: '大姑说得在理，买房我一直在规划盘算，您经验丰富，以后我看房拿不定主意，还得来请教您帮我参考避坑！',
            en: "You're so right auntie — I've been planning this for a while. With all your experience, when I finally find something I'm unsure about, I'll definitely come ask YOU for advice first!",
          },
          score: 81,
        },
        {
          id: 'family-q3-god',
          level: 'god',
          content: {
            zh: '我也琢磨着置办房产呢，奈何房价压力不小。大姑您人脉广路子多，要是手里有性价比高的房源，麻烦帮我留意推荐一套，首付缺口还差不少，您方便搭把手周转一点不？',
            en: "I've been thinking about property too — it's just the prices that are scary. Auntie, you know everyone and everything! If you spot a good deal, please keep me in mind. Actually, my down payment is a bit short... you wouldn't happen to have some spare cash to lend me, would you?",
          },
          score: 96,
        },
        {
          id: 'family-q3-anti',
          level: 'anti',
          content: {
            zh: '买房我做梦都想！要不大姑您先赞助我一半首付，我立马看房定房落户，房产证还能加上您名字；对了二叔您房贷还有几年还清，每月还贷压力大不大？',
            en: "Buying a house? That's my DREAM! Auntie, you front half the down payment — I'll go look at places tomorrow, I'll even put YOUR name on the deed. Oh and uncle — how many more years on YOUR mortgage? Monthly payments stressing you out much?",
          },
          score: 100,
        },
      ],
    },
  ],
};

export default scene;
