import type { Scene } from '../../types';

const scene: Scene = {
  id: 'advisor-talk',
  title: {
    zh: '导师谈话·前途抉择',
    en: 'Advisor Talk · Crossroads',
  },
  emoji: '📚',
  description: {
    zh: '导师找你谈话，句句关乎毕业和前途',
    en: 'Your advisor wants to talk — every word shapes your future',
  },
  bgImage: '',
  bgColor: 'from-purple-500/80 via-indigo-400/60 to-blue-500/70',
  bgGradient: 'linear-gradient(180deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)',
  accentColor: 'purple',
  characters: [
    {
      name: { zh: '导师', en: 'Advisor' },
      emoji: '👨‍🔬',
      description: {
        zh: '威严但关心学生，话里有话',
        en: 'Stern but caring — every word carries subtext',
      },
    },
    {
      name: { zh: '师兄', en: 'Senior Labmate' },
      emoji: '👨‍🎓',
      description: {
        zh: '过来人，时不时递话点拨',
        en: 'Been there, done that — drops the occasional hint',
      },
    },
    {
      name: { zh: '同门', en: 'Labmate' },
      emoji: '👩‍🎓',
      description: {
        zh: '焦虑型，气氛紧张制造机',
        en: 'The anxious type — amplifies every tense moment',
      },
    },
  ],
  questions: [
    {
      id: 'advisor-talk-q1',
      triggerDialog: {
        zh: "你最近进度有点慢啊，是不是在外面实习影响科研了？科研才是你的主业。",
        en: "Your progress has been slow lately — is that internship affecting your research? Research is your main job, you know.",
      },
      options: [
        {
          id: 'advisor-q1-low',
          level: 'low',
          content: {
            zh: '实习对就业很重要，不能放弃。',
            en: "The internship is important for my job search — I can't give it up.",
          },
          score: 20,
        },
        {
          id: 'advisor-q1-medium',
          level: 'medium',
          content: {
            zh: '我会调整时间，平衡好实习和科研。',
            en: "I'll adjust my schedule to balance the internship and research.",
          },
          score: 55,
        },
        {
          id: 'advisor-q1-high',
          level: 'high',
          content: {
            zh: '老师您说得对，我承认最近进度确实不理想。实习已经结束/即将结束，接下来我会全力投入科研。这是接下来三个月的科研计划，包括XX实验、XX论文撰写和XX投稿时间节点，请您过目指导。',
            en: "You're right, professor — my progress hasn't been ideal. The internship has ended / is about to end, and I'll be fully focused on research going forward. Here's my three-month research plan, including experiment X, paper Y, and submission deadline Z. I'd appreciate your review and guidance.",
          },
          score: 80,
        },
        {
          id: 'advisor-q1-god',
          level: 'god',
          content: {
            zh: '感谢老师关心。其实这次实习并非与课题无关，我在XX公司接触到了产业界的XX数据和XX问题，恰好与我们课题组的XX方向高度相关。我整理了一份实习洞察报告，包括三点可反哺科研的发现：第一，XX；第二，XX；第三，XX。我想把这些产业洞察融入后续研究，也想请教老师，您觉得哪一点最值得深入？',
            en: "Thank you for your concern, professor. Actually, this internship wasn't unrelated to my research — at Company X I was exposed to industry data Y and problem Z, which align closely with our group's direction W. I've put together an insight report with three findings that could feed back into our research: first, X; second, Y; third, Z. I'd like to weave these industry insights into my follow-up work, and I'd also appreciate your guidance on which finding is most worth pursuing.",
          },
          score: 95,
        },
        {
          id: 'advisor-q1-anti',
          level: 'anti',
          content: {
            zh: '老师，师兄之前也去实习了，好像也没见您说什么。是不是您对每个学生的标准不太一样？',
            en: "Professor, my senior labmate also did an internship — I don't recall you saying anything about that. Do you hold different students to different standards?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'advisor-talk-q2',
      triggerDialog: {
        zh: "你打算读博吗？我觉得你有潜力，但需要更专注。",
        en: "Are you planning to pursue a PhD? I think you have potential — but you'd need to be more focused.",
      },
      options: [
        {
          id: 'advisor-q2-low',
          level: 'low',
          content: {
            zh: '不读，想赶紧毕业赚钱。',
            en: "No — I want to graduate and start making money.",
          },
          score: 20,
        },
        {
          id: 'advisor-q2-medium',
          level: 'medium',
          content: {
            zh: '还没想好，再考虑考虑。',
            en: "I haven't decided yet — I'll think about it more.",
          },
          score: 55,
        },
        {
          id: 'advisor-q2-high',
          level: 'high',
          content: {
            zh: '感谢老师的认可。我目前倾向于先就业积累实践经验，但读博也是我认真考虑的选项之一。能否请老师给我一些关于是否适合学术道路的建议？我会综合您的意见和自己的兴趣做出决定。',
            en: "Thank you for the vote of confidence, professor. I'm currently leaning toward working first to gain practical experience, but a PhD is also a serious option I'm considering. Could I ask for your advice on whether I'm suited for an academic path? I'll weigh your input alongside my own interests when deciding.",
          },
          score: 80,
        },
        {
          id: 'advisor-q2-god',
          level: 'god',
          content: {
            zh: '感谢老师的认可，这对我意义重大。我想诚实分享我的思考：我对XX方向有强烈的好奇心，但也在认真评估自己的特质——我喜欢深度思考但有时缺乏执行节奏，喜欢学术自由但也担心经济压力。能否请教老师，您从您的观察出发，认为我适合学术道路吗？您当年是如何做出读博决定的？我会认真思考后给您明确回复。',
            en: "Thank you for the recognition, professor — it means a lot. Let me be honest about my thinking: I have strong curiosity about direction X, but I'm also honestly assessing my own traits — I love deep thinking but sometimes lack execution rhythm; I love academic freedom but worry about financial pressure. Could I ask — from your observation, do you think I'm suited for academia? How did you make your own PhD decision back in the day? I'll give you a clear answer after serious reflection.",
          },
          score: 95,
        },
        {
          id: 'advisor-q2-anti',
          level: 'anti',
          content: {
            zh: '老师，读博补贴能不能涨到够生活的水平？光靠热爱真的读不下去。',
            en: "Professor, can the PhD stipend be raised to a livable level? Love alone really won't sustain a PhD.",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'advisor-talk-q3',
      triggerDialog: {
        zh: "你这个方向不好发论文，要不换个方向？虽然要重头再来，但对你毕业更有利。",
        en: "This direction is hard to publish in — why not switch? You'd be starting over, but it'd be better for your graduation.",
      },
      options: [
        {
          id: 'advisor-q3-low',
          level: 'low',
          content: {
            zh: '不想换，已经做了这么久了。',
            en: "I don't want to switch — I've already put in so much time.",
          },
          score: 20,
        },
        {
          id: 'advisor-q3-medium',
          level: 'medium',
          content: {
            zh: '考虑一下，挺纠结的。',
            en: "I'll think about it — it's a tough call.",
          },
          score: 55,
        },
        {
          id: 'advisor-q3-high',
          level: 'high',
          content: {
            zh: '感谢老师从毕业角度的考量。换方向确实有利有弊，我想认真分析一下：当前方向已有XX积累，新方向XX方向发表前景更好但需要重新积累。能否请教老师，新方向的可行性如何？是否有现成的实验条件和数据支持？',
            en: "Thank you for thinking about my graduation, professor. Switching has its pros and cons — let me analyze: my current direction has accumulated X, while the new direction Y has better publication prospects but requires starting from scratch. Could I ask — how feasible is the new direction? Are there existing experimental conditions and data to support it?",
          },
          score: 80,
        },
        {
          id: 'advisor-q3-god',
          level: 'god',
          content: {
            zh: '感谢老师从毕业角度的考量，这确实是个重要决策。我想梳理一下：当前方向虽然发表难度大，但已积累的XX方法、XX数据和XX洞察具有可迁移价值，新方向可以承接这些积累。能否请教老师，新方向如何与已有工作衔接？是否可以设计一个过渡方案，比如先用三个月完成当前方向的XX工作作为阶段性产出，同时启动新方向的文献调研和预实验？这样既不浪费已有投入，也能稳步切换。',
            en: "Thank you for considering my graduation, professor — this is indeed a major decision. Let me lay out my thinking: although the current direction is hard to publish in, the method X, data Y, and insight Z I've accumulated have transferable value that the new direction could build on. Could I ask how the new direction could connect with my existing work? Could we design a transition plan — for example, spending three months completing work X in the current direction as a phased deliverable, while simultaneously starting literature review and pilot experiments for the new direction? This way we neither waste prior investment nor delay the switch.",
          },
          score: 95,
        },
        {
          id: 'advisor-q3-anti',
          level: 'anti',
          content: {
            zh: '老师，换方向后延期毕业的补贴谁出？之前投入的时间成本怎么算？',
            en: "Professor, who covers the stipend during the delay caused by switching? And how is the time I've already invested accounted for?",
          },
          score: 100,
        },
      ],
    },
  ],
};

export default scene;
