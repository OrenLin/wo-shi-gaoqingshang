import type { Scene } from '../types';

const scene: Scene = {
  id: 'business-dinner',
  title: {
    zh: '酒局·被迫营业',
    en: 'Business Dinner · Forced to Perform',
  },
  emoji: '🍻',
  description: {
    zh: '客户疯狂劝酒，项目命运全在一张嘴上',
    en: "The client keeps pushing drinks — your project hangs on your silver tongue",
  },
  bgImage: new URL('../../assets/bg-dinner.svg', import.meta.url).href,
  bgColor: 'from-amber-600/80 via-orange-500/60 to-red-500/70',
  accentColor: 'amber',
  characters: [
    {
      name: { zh: '刘总', en: 'Mr. Liu (Client)' },
      emoji: '👨',
      description: {
        zh: '酒量惊人、爱拿项目拿捏人的豪爽型客户',
        en: "Huge drinker — loves using the project as leverage",
      },
    },
    {
      name: { zh: '张哥', en: 'Zhang' },
      emoji: '🧔',
      description: {
        zh: '坐旁边看热闹的直属领导',
        en: "Your boss — quietly enjoying the show from the side",
      },
    },
  ],
  questions: [
    {
      id: 'business-dinner-q1',
      triggerDialog: {
        zh: "小X！我听说你们年轻人都能喝！来，咱俩走一个！这杯喝了，后面那个项目的事儿好说！",
        en: "Hey kid! I hear all you youngsters can really drink! C'mon, let's toast! You drink this one, and that project we've been talking about? Smooth sailing!",
      },
      options: [
        {
          id: 'bd-q1-low',
          level: 'low',
          content: {
            zh: '刘总不好意思，我不能喝酒，医生不让。',
            en: "Sorry Mr. Liu, I can't drink — doctor's orders.",
          },
          score: 25,
        },
        {
          id: 'bd-q1-medium',
          level: 'medium',
          content: {
            zh: '刘总我干了您随意！项目的事您放心！',
            en: "Down the hatch sir! I'll take care of the project, no worries!",
          },
          score: 50,
        },
        {
          id: 'bd-q1-high',
          level: 'high',
          content: {
            zh: '刘总！跟您喝酒是我的荣幸！这杯我先干为敬！不过项目就算不喝酒，我也一定给您落地得漂漂亮亮，绝不糊弄您！',
            en: "Mr. Liu, drinking with you is an honor! Down it goes! But honestly — even without the drinking, I'm gonna nail this project for you. No cutting corners, I promise!",
          },
          score: 85,
        },
        {
          id: 'bd-q1-god',
          level: 'god',
          content: {
            zh: '刘总这杯必须领情！实话说我酒量浅，喝晕了怕脑子不清醒耽误对接您的项目。我先干三杯表诚意，剩下的诚意我用后续交付质量补齐，您看行不行？',
            en: "I respect this toast sir, I really do! But honestly, I'm a lightweight — if I get dizzy, my work on YOUR project suffers. Let me drink three small ones to show commitment, and I'll make up the rest with delivery quality. Deal?",
          },
          score: 98,
        },
        {
          id: 'bd-q1-anti',
          level: 'anti',
          content: {
            zh: '刘总酒我肯定喝！先问一嘴：您说的项目是已经盖章敲定那个，还是您随口画的大饼？对了张哥，您帮我作证，刘总这酒喝了要是项目黄了，回头报销医药费不？',
            en: "I'll absolutely drink with you sir! Quick question first — this project you mentioned: is it the one that's already signed and sealed? Or the one you're drawing in the air right now? And hey boss (Zhang), you witness this: if the project goes south after this drink, are we reimbursing hospital bills or what?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'business-dinner-q2',
      triggerDialog: {
        zh: "小X啊，你们公司最近好像挺多人离职的？不会是你们老板太抠门留不住人吧？哈哈我就是随口唠嗑，你别多想！",
        en: "So I hear people have been leaving your company lately. Is your boss too stingy to keep them? Haha just casual conversation — don't read too much into it!",
      },
      options: [
        {
          id: 'bd-q2-low',
          level: 'low',
          content: {
            zh: '确实，我们老板真的很抠，福利也差，走的人都有道理。',
            en: "Yeah honestly, our boss is really cheap, benefits are terrible — the departures are totally justified.",
          },
          score: 20,
        },
        {
          id: 'bd-q2-medium',
          level: 'medium',
          content: {
            zh: '还好吧，各行各业人员来来去去，流动也挺正常的。',
            en: "It's fine — people come and go in every industry. Normal turnover.",
          },
          score: 55,
        },
        {
          id: 'bd-q2-high',
          level: 'high',
          content: {
            zh: '刘总您消息也太灵通了！确实有同事选择新发展，但留下来的都是看重长期合作的，就像我跟您合作这么舒心，说啥也舍不得跳槽跑路！',
            en: "You hear everything sir! Some colleagues did pursue other opportunities — but the ones who stayed are all about long-term partnerships. Kind of like how comfortable I feel working with YOU — I'd never want to leave!",
          },
          score: 82,
        },
        {
          id: 'bd-q2-god',
          level: 'god',
          content: {
            zh: '刘总这您都听说了！其实公司是在精简人员，把人力资源全部倾斜给您这种优质大客户。我敬您一杯，也特别感谢您愿意持续给我们合作机会！',
            en: "Word travels fast sir! Actually the company is streamlining — reallocating talent toward premium clients like yourself. Here's a toast to YOU — and thank you for continuing to give us your business!",
          },
          score: 95,
        },
        {
          id: 'bd-q2-anti',
          level: 'anti',
          content: {
            zh: '刘总您这是打算挖我跳槽，还是暗中摸底打探我们公司底细？想挖人您直接开薪资报价，想调研我当场推老板微信您私聊！顺带一提我要是跳槽跑路，您手里项目交接麻烦，成本都得您承担哦！',
            en: "Sir, are you trying to poach me or just gathering intel on my company? If it's poaching — name the salary, I'll think about it. If it's research — I can give you my boss's WeChat right now. Quick side note though: if I leave, handover on YOUR projects gets messy. On YOUR dollar, of course.",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'business-dinner-q3',
      triggerDialog: {
        zh: "来小X，别光顾着小口抿！我三杯下肚面不改色，你酒量也练练，连着闷三杯，以后咱们合作更好办事！",
        en: "C'mon don't just sip! I've had three and I'm not even buzzing. Build up your tolerance — three shots straight, and working together will be so much smoother later!",
      },
      options: [
        {
          id: 'bd-q3-low',
          level: 'low',
          content: {
            zh: '我真喝不了三杯，您别逼我了，再喝就要醉倒失态了。',
            en: "I really can't do three — please don't push me, I'll get embarrassingly drunk.",
          },
          score: 22,
        },
        {
          id: 'bd-q3-medium',
          level: 'medium',
          content: {
            zh: '那我慢慢喝，一杯一杯陪您尽兴，尽力跟上您节奏。',
            en: "I'll pace myself then — one by one, I'll keep up with you as best I can.",
          },
          score: 53,
        },
        {
          id: 'bd-q3-high',
          level: 'high',
          content: {
            zh: '刘总酒量属实佩服！三杯我量力而为，前两杯我一口气干完，最后一杯我小口慢饮，稍后我多敬您两杯茶补礼数，您看可以不？',
            en: "Your tolerance is genuinely impressive sir! I'll do my best on these three — first two in one go, the last one slow and small. Then let me make up the rest with toasts of tea out of respect. Fair?",
          },
          score: 83,
        },
        {
          id: 'bd-q3-god',
          level: 'god',
          content: {
            zh: '刘总气场太强我属实佩服！喝酒是表达敬重，不是拼酒量，我两杯白酒表忠心，剩下一杯换成浓茶，后续项目细节我头脑清醒才能给您捋得面面俱到，不让您踩坑吃亏。',
            en: "Your energy is unmatched sir! Drinking is about respect, not about how much someone can handle. Let me drink two baijiu to show my commitment, and swap the third for strong tea — I need a clear head to make sure your project details are covered perfectly. No corners cut, no pitfalls missed.",
          },
          score: 97,
        },
        {
          id: 'bd-q3-anti',
          level: 'anti',
          content: {
            zh: '三杯没问题！咱提前说好，喝吐了饭店打扫费您报销，喝进医院急诊医药费您兜底，要是我喝醉乱说话得罪其他客户，锅可不能甩我头上啊刘总！',
            en: "Three shots? No problem! Just ground rules first: if I puke, you cover the restaurant cleaning fee. If I end up in the ER, you're on the hook for the bill. And if I get hammered and accidentally offend other clients? That can't come back to bite ME, right boss?",
          },
          score: 100,
        },
      ],
    },
  ],
};

export default scene;
