import type { Scene } from '../types';

const scene: Scene = {
  id: 'workplace',
  title: {
    zh: '职场·老板的送命题',
    en: 'Workplace · Boss Trap Questions',
  },
  emoji: '💼',
  description: {
    zh: '周五下班夺命提问，句句都是职场生死选择题',
    en: "The Friday trap — survive the boss's deadly questions or go down trying",
  },
  bgImage: new URL('../../assets/bg-office.svg', import.meta.url).href,
  bgColor: 'from-orange-500/80 via-amber-400/60 to-yellow-500/70',
  accentColor: 'orange',
  characters: [
    {
      name: { zh: '王总', en: 'Boss Wang' },
      emoji: '🤵',
      description: {
        zh: '擅长画饼、笑里藏刀的阴阳怪气型领导',
        en: "Master of the empty promise, and fake-smile backstabbing",
      },
    },
    {
      name: { zh: '李经理', en: 'Manager Li' },
      emoji: '👨‍💼',
      description: {
        zh: '在一旁吃瓜看戏的中层同事',
        en: "Middle manager enjoying the drama from the sidelines",
      },
    },
  ],
  questions: [
    {
      id: 'workplace-q1',
      triggerDialog: {
        zh: "小X啊，这个方案周一就要交付，你看看周末能不能抽空加个班赶出来？放心哈，也不着急，你自己看着灵活安排就行。",
        en: "Hey, this project needs to ship on Monday. Think you could come in on the weekend to wrap it up? No pressure though — totally up to you, arrange it however you like!",
      },
      options: [
        {
          id: 'wp-q1-low',
          level: 'low',
          content: {
            zh: '周末我早就安排私事了，而且这个工作量根本不是一个周末能做完的。',
            en: "I already have personal plans this weekend, and honestly this workload couldn't be finished in one weekend anyway.",
          },
          score: 15,
        },
        {
          id: 'wp-q1-medium',
          level: 'medium',
          content: {
            zh: '好的王总，我尽量压缩个人时间，周末加班赶出来交付。',
            en: "OK boss. I'll squeeze some personal time and come in on the weekend to get it done.",
          },
          score: 50,
        },
        {
          id: 'wp-q1-high',
          level: 'high',
          content: {
            zh: '王总周末我可以推进方案！不过有几个核心细节我想提前跟您对齐，避免反复修改返工，您看明天抽空方便通几分钟电话吗？',
            en: "Boss, I can push this forward on the weekend! But there are a few key details I want to align with you first so we don't waste time on revisions. Can we spare a few minutes tomorrow to chat?",
          },
          score: 82,
        },
        {
          id: 'wp-q1-god',
          level: 'god',
          content: {
            zh: '王总您放心交付交给我！想要方案惊艳客户一稿过，我需要李经理手里一部分业务数据支撑，麻烦您帮忙协调对接一下，我周末全速推进落地。',
            en: "Leave it to me boss! For a real first-draft wow moment though, I'll need some of the business data that manager Li has. If you could help connect us, I'll go full-steam on the weekend and get this done right!",
          },
          score: 96,
        },
        {
          id: 'wp-q1-anti',
          level: 'anti',
          content: {
            zh: '加班没问题王总！先说清楚，劳动法规定周末加班双倍薪资，您看是事后给我折算现金加班费，还是后续申请调休抵扣？顺带问问您上周我提交的差旅费报销啥时候审批到账？',
            en: "Weekend overtime is fine boss! Just to be clear though — labor law says double pay for weekend work. Should I bill this as cash overtime, or use it toward comp days later? Also — that travel expense I submitted last week? When's that getting approved?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'workplace-q2',
      triggerDialog: {
        zh: "小X，你客观聊聊，咱们团队里谁最需要优化淘汰？大胆说实话，我就私下问问，绝对不会外传是你说的。",
        en: "Be honest — who on this team most needs to be 'optimized out'? Speak your mind, this is totally off the record, it'll never get out that it was you who said it.",
      },
      options: [
        {
          id: 'wp-q2-low',
          level: 'low',
          content: {
            zh: '我感觉XXX平时摸鱼混日子最严重，您可以重点考察这个人。',
            en: "I feel like so-and-so slacks off the most — you might want to look into that person.",
          },
          score: 20,
        },
        {
          id: 'wp-q2-medium',
          level: 'medium',
          content: {
            zh: '王总，团队每个人各司其职都挺好的，暂时没有觉得谁不合适。',
            en: "Boss, everyone on the team pulls their own weight — no one feels like a bad fit to me.",
          },
          score: 55,
        },
        {
          id: 'wp-q2-high',
          level: 'high',
          content: {
            zh: '王总您这个问题属实把我难住了，每位同事都有自己擅长的领域，与其优化人员，不如梳理优化重复低效的工作流程，整体效率提升更实在。',
            en: "You've stumped me boss — every colleague brings different strengths. Instead of optimizing people, wouldn't it be better to optimize our overlapping, inefficient processes? That'd give us real efficiency gains.",
          },
          score: 80,
        },
        {
          id: 'wp-q2-god',
          level: 'god',
          content: {
            zh: '王总扪心自问，我觉得现阶段最该打磨优化的人是我自己！近期感觉个人成长速度变慢，您能不能指点我短板在哪，或者推荐一些提升能力的书籍方向？',
            en: "If I'm being honest boss, the person who most needs 'optimizing' right now is ME! I feel my growth has slowed down lately. Could you point out where I could improve? Maybe recommend some books or directions to level up?",
          },
          score: 95,
        },
        {
          id: 'wp-q2-anti',
          level: 'anti',
          content: {
            zh: '王总您这纯纯钓鱼执法套路啊！说真话打小报告的人往往第一个被优化，您心里早就想好要裁谁直接明说，需要我帮忙传话安抚其他同事不？',
            en: "Boss this is such a trap question! The person who snitches usually gets eliminated first. If you've already decided who to cut, just say it straight. Want me to help break the news gently to the rest of the team?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'workplace-q3',
      triggerDialog: {
        zh: "这次项目搞砸出纰漏了，部门上下都有责任，你分析下问题根源，说说主要是谁的问题？",
        en: "This project blew up and everyone shares some blame. Analyze the root cause for me — whose fault do YOU think this mainly is?",
      },
      options: [
        {
          id: 'wp-q3-low',
          level: 'low',
          content: {
            zh: '这事主要是对接环节李经理给的数据出错，才导致项目翻车。',
            en: "This is mainly manager Li's fault — the data he gave us was wrong, that's what derailed everything.",
          },
          score: 18,
        },
        {
          id: 'wp-q3-medium',
          level: 'medium',
          content: {
            zh: '多方环节都有疏漏，大家都有考虑不周的地方，没法单归责某一个人。',
            en: "There were slips at multiple stages — everyone missed something. It's not fair to pin it on one person.",
          },
          score: 52,
        },
        {
          id: 'wp-q3-high',
          level: 'high',
          content: {
            zh: '王总我复盘梳理过了，前期沟通衔接出现信息差是核心问题，我整理一份整改方案，后续规避同类问题再次出错，责任我该承担的部分绝不推诿。',
            en: "I've thought this through boss — the core issue was a miscommunication at the hand-off stage. I'm putting together a correction plan to prevent this happening again, and I take full ownership of my part in it.",
          },
          score: 84,
        },
        {
          id: 'wp-q3-god',
          level: 'god',
          content: {
            zh: '整体失误我有不可推卸的执行责任，我先主动认领自己的问题，连夜出复盘整改方案。后续我们开短会全员梳理漏洞，定好权责划分，杜绝下次踩同款坑。',
            en: "I take ownership of my execution mistakes in this. First, I'll own my share and draft a post-mortem tonight. Then let's schedule a short meeting with the whole team to map out gaps, clarify responsibilities, and make sure this never happens the same way twice.",
          },
          score: 97,
        },
        {
          id: 'wp-q3-anti',
          level: 'anti',
          content: {
            zh: '要论根源追到底，最开始拍板定方案的是您王总，中途改需求来回折腾也是临时通知；要不咱开全员大会，挨个逐层往上溯源追责，把前因后果全摊开讨论？',
            en: "If we're tracing this to the root — YOU signed off on the original plan, and all those mid-flight requirement changes came as last-minute notices from you. Wanna call a company-wide meeting and trace accountability upward, layer by layer, and lay all the cards on the table?",
          },
          score: 100,
        },
      ],
    },
  ],
};

export default scene;
