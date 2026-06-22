import type { Scene } from '../../types';

const scene: Scene = {
  id: 'graduation-ceremony',
  title: {
    zh: '毕业典礼·最后一课',
    en: 'Graduation · The Last Lesson',
  },
  emoji: '🎩',
  description: {
    zh: '毕业典礼社交名场面，告别与启程的情商大考',
    en: 'Graduation social minefield — a final EQ test before you launch',
  },
  bgImage: '',
  bgColor: 'from-emerald-500/80 via-teal-400/60 to-cyan-500/70',
  bgGradient: 'linear-gradient(180deg, #059669 0%, #14b8a6 50%, #06b6d4 100%)',
  accentColor: 'emerald',
  characters: [
    {
      name: { zh: '校长', en: 'President' },
      emoji: '🧑‍💼',
      description: {
        zh: '致辞嘉宾，握手时爱问人生规划',
        en: 'Guest speaker — loves asking about life plans during handshakes',
      },
    },
    {
      name: { zh: '家长', en: 'Parent' },
      emoji: '👩',
      description: {
        zh: '骄傲型家长，逢人就夸也逢人就比',
        en: 'The proud parent — brags and compares in equal measure',
      },
    },
    {
      name: { zh: '同学', en: 'Classmate' },
      emoji: '👨‍🎓',
      description: {
        zh: '攀比型同学，三句话不离offer和年薪',
        en: 'The competitive classmate — every sentence orbits offers and salary',
      },
    },
  ],
  questions: [
    {
      id: 'graduation-ceremony-q1',
      triggerDialog: {
        zh: "你同学那个XXX进了大厂年薪五十万，你签的那家多少？",
        en: "Your classmate XXX got into a big tech company — 500K a year! How much does the one you signed pay?",
      },
      options: [
        {
          id: 'graduation-q1-low',
          level: 'low',
          content: {
            zh: '别比了，烦死了。',
            en: "Stop comparing — it's so annoying.",
          },
          score: 20,
        },
        {
          id: 'graduation-q1-medium',
          level: 'medium',
          content: {
            zh: '差不多够生活吧。',
            en: "About enough to get by.",
          },
          score: 55,
        },
        {
          id: 'graduation-q1-high',
          level: 'high',
          content: {
            zh: '哈哈各有各的好，我选的这家虽然起薪没那么高，但发展前景不错，行业也是我感兴趣的。',
            en: "Haha, every path has its perks. The one I picked has a lower starting salary, but the growth prospects are solid and it's an industry I'm genuinely interested in.",
          },
          score: 80,
        },
        {
          id: 'graduation-q1-god',
          level: 'god',
          content: {
            zh: '谢谢爸妈关心！我选这家主要是看中XX业务方向和团队氛围，长期发展空间更大。其实能走到今天，全靠爸妈这些年供我读书、给我支持，比起年薪，我更想让你们为我骄傲。对了，今天典礼上您二老最感动的是哪个环节？',
            en: "Thanks for caring, mom and dad! I picked this company mainly for direction X and the team culture — there's more room for long-term growth. Honestly, getting here is all thanks to your years of support and sacrifices putting me through school. More than the salary, I want to make you proud. By the way — which part of the ceremony moved you the most today?",
          },
          score: 95,
        },
        {
          id: 'graduation-q1-anti',
          level: 'anti',
          content: {
            zh: '妈您是不是觉得养亏了？那同学年薪是高，可他996加班猝死风险也高啊，我选的是健康。',
            en: "Mom, do you feel like you got shortchanged? Sure, that classmate makes more — but with 996 overtime, his sudden-death risk is also higher. I picked health.",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'graduation-ceremony-q2',
      triggerDialog: {
        zh: "我拿了三个offer，最后选了那个年薪最高的。你呢？签了没？",
        en: "I got three offers and picked the one with the highest salary. You? Signed yet?",
      },
      options: [
        {
          id: 'graduation-q2-low',
          level: 'low',
          content: {
            zh: '关你什么事。',
            en: "None of your business.",
          },
          score: 20,
        },
        {
          id: 'graduation-q2-medium',
          level: 'medium',
          content: {
            zh: '签了一个一般的。',
            en: "Signed a so-so one.",
          },
          score: 55,
        },
        {
          id: 'graduation-q2-high',
          level: 'high',
          content: {
            zh: '祝贺你啊！我也签了，虽然不是年薪最高的，但很适合我的方向。适合自己的才是最好的，对吧？',
            en: "Congrats! I signed too — not the highest-paying, but a great fit for my direction. The right fit is the best fit, right?",
          },
          score: 80,
        },
        {
          id: 'graduation-q2-god',
          level: 'god',
          content: {
            zh: '真心祝贺你！能拿到三个offer说明你实力很强。我经过深思熟虑后选了XX公司，主要是看中XX团队和XX业务方向，符合我长期的职业规划。咱们以后在不同赛道上，多保持联系互相学习啊！',
            en: "Genuinely congrats! Three offers proves you're strong. After a lot of thought, I picked Company X — mainly for team Y and direction Z, which fit my long-term career plan. We'll be in different lanes going forward — let's stay in touch and learn from each other!",
          },
          score: 95,
        },
        {
          id: 'graduation-q2-anti',
          level: 'anti',
          content: {
            zh: '我拿了五个offer但都不想去，准备创业。对了，你选年薪最高的那家？你不知道他们刚裁了一批人吧？',
            en: "I got five offers but didn't want any of them — I'm starting a company. By the way, you picked the highest-paying one? You do know they just laid off a bunch of people, right?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'graduation-ceremony-q3',
      triggerDialog: {
        zh: "毕业后有什么打算？能为母校争光吗？",
        en: "What are your plans after graduation? Can you bring glory to your alma mater?",
      },
      options: [
        {
          id: 'graduation-q3-low',
          level: 'low',
          content: {
            zh: '走一步看一步吧。',
            en: "Take it one step at a time.",
          },
          score: 20,
        },
        {
          id: 'graduation-q3-medium',
          level: 'medium',
          content: {
            zh: '会努力的。',
            en: "I'll do my best.",
          },
          score: 55,
        },
        {
          id: 'graduation-q3-high',
          level: 'high',
          content: {
            zh: '感谢母校培养！我打算在XX行业发展，把在校学到的XX知识运用到实际工作中，会努力为母校争光的。',
            en: "Thank you for the education! I plan to grow in the X industry and apply what I learned — Y — to real work. I'll do my best to make the school proud.",
          },
          score: 80,
        },
        {
          id: 'graduation-q3-god',
          level: 'god',
          content: {
            zh: '感谢母校四年的培养，让我从XX成长为XX。我即将加入XX公司从事XX工作，会用到母校教给我的XX思维和XX技能。未来有能力时，我希望能回馈母校，比如回校分享行业经验、设立小额奖学金等。也想邀请校长保持联系，您的指点对我意义非凡。',
            en: "Thank you for four years of growth — I came in as X and leave as Y. I'll be joining Company Z to do work W, applying the X mindset and Y skills the school gave me. When I'm able, I hope to give back — sharing industry insights on campus, setting up a small scholarship, and so on. I'd also love to stay in touch, Mr. President — your guidance means a great deal to me.",
          },
          score: 95,
        },
        {
          id: 'graduation-q3-anti',
          level: 'anti',
          content: {
            zh: '校长，先能养活自己再说吧。对了，学校能不能给校友内推岗位？',
            en: "Mr. President, let me feed myself first. By the way — can the school hook alumni up with internal referrals?",
          },
          score: 100,
        },
      ],
    },
  ],
};

export default scene;
