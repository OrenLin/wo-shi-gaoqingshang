import type { Scene } from '../../types';

const scene: Scene = {
  id: 'thesis-defense',
  title: {
    zh: '论文答辩·灵魂拷问',
    en: 'Thesis Defense · Soul Interrogation',
  },
  emoji: '🎓',
  description: {
    zh: '答辩委员连环追问，你的论文命运悬在一句回答',
    en: 'The committee fires relentless questions — your thesis hangs on every word',
  },
  bgImage: '',
  bgColor: 'from-indigo-500/80 via-blue-400/60 to-cyan-500/70',
  accentColor: 'indigo',
  characters: [
    {
      name: { zh: '答辩主席', en: 'Committee Chair' },
      emoji: '👨‍🏫',
      description: {
        zh: '严谨刻板，最恨含糊其辞',
        en: 'Rigid and precise — has zero tolerance for vagueness',
      },
    },
    {
      name: { zh: '答辩委员A', en: 'Committee Member A' },
      emoji: '👩‍🏫',
      description: {
        zh: '专挑漏洞，问题刀刀见血',
        en: 'A professional loophole hunter — every question cuts deep',
      },
    },
    {
      name: { zh: '答辩委员B', en: 'Committee Member B' },
      emoji: '🧑‍🏫',
      description: {
        zh: '和事佬，关键时刻打圆场',
        en: 'The peacemaker — smooths things over when tensions rise',
      },
    },
  ],
  questions: [
    {
      id: 'thesis-defense-q1',
      triggerDialog: {
        zh: "你的研究方法和已有文献的方法有什么本质区别？说不出区别这论文意义在哪？",
        en: "What is the ESSENTIAL difference between your method and existing methods in the literature? If you can't articulate it, what's the point of this thesis?",
      },
      options: [
        {
          id: 'thesis-q1-low',
          level: 'low',
          content: {
            zh: '已有文献的方法其实也不怎么样，问题一大堆。',
            en: "The existing methods aren't that great either — they have tons of problems.",
          },
          score: 20,
        },
        {
          id: 'thesis-q1-medium',
          level: 'medium',
          content: {
            zh: '差不多吧，但我在一些细节上做了改进。',
            en: "They're pretty similar, but I made some improvements in the details.",
          },
          score: 55,
        },
        {
          id: 'thesis-q1-high',
          level: 'high',
          content: {
            zh: '感谢老师提问。我的方法在数据预处理、特征提取和模型结构三方面做了改进：第一，引入了XX机制；第二，优化了XX流程；第三，新增了XX约束。还请各位老师多指导。',
            en: "Thank you for the question. My method improves on three fronts: data preprocessing, feature extraction, and model architecture. First, I introduced mechanism X; second, I optimized process Y; third, I added constraint Z. I'd welcome further guidance from the committee.",
          },
          score: 80,
        },
        {
          id: 'thesis-q1-god',
          level: 'god',
          content: {
            zh: '感谢老师这个问题。已有文献的方法在XX场景下确实奠定了重要基础，其核心思想值得借鉴。我的方法从方法论层面做了三点创新：第一，将XX范式扩展到XX场景；第二，引入XX理论解决原有方法在XX条件下的失效问题；第三，从XX视角重新定义了优化目标。这些创新在第三章有详细论证，也想借这个机会请教各位老师对这一思路的建议。',
            en: "Thank you for this important question. Existing methods have laid a crucial foundation in the XX setting, and their core ideas are worth building on. My method makes three methodological innovations: first, extending paradigm X to scenario Y; second, introducing theory Z to address where prior methods fail under condition W; third, redefining the optimization objective from the V perspective. These are detailed in Chapter 3, and I'd genuinely welcome the committee's feedback on this approach.",
          },
          score: 95,
        },
        {
          id: 'thesis-q1-anti',
          level: 'anti',
          content: {
            zh: '老师，这个问题我在论文第三章方法论部分已经做了详细对比，包括方法差异、适用场景和性能对比。如果第三章没看清楚，我可以现场再给您讲一遍。',
            en: "Professor, I address this in detail in Chapter 3 of my thesis — including methodological differences, applicable scenarios, and performance comparisons. If you missed that section, I'd be happy to walk you through it again right now.",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'thesis-defense-q2',
      triggerDialog: {
        zh: "你这个数据样本量太小了吧？结论能站得住脚吗？",
        en: "Your sample size is way too small — can your conclusions really hold up?",
      },
      options: [
        {
          id: 'thesis-q2-low',
          level: 'low',
          content: {
            zh: '数据很难收集，我已经尽力了。',
            en: "The data was really hard to collect — I did the best I could.",
          },
          score: 20,
        },
        {
          id: 'thesis-q2-medium',
          level: 'medium',
          content: {
            zh: '虽然样本小，但趋势还是比较明显的。',
            en: "Although the sample is small, the trend is still fairly clear.",
          },
          score: 55,
        },
        {
          id: 'thesis-q2-high',
          level: 'high',
          content: {
            zh: '感谢老师指出，样本量确实是本研究的局限之一。我通过定性分析对量化结果做了交叉验证，一定程度上弥补了这一不足。未来工作计划中，我会与XX机构合作扩大样本规模，并引入XX方法提升结论的稳健性。',
            en: "Thank you for pointing this out — sample size is indeed a limitation of this study. I cross-validated the quantitative results with qualitative analysis to partially address this. In future work, I plan to partner with institution X to expand the sample and introduce method Y to strengthen the robustness of the conclusions.",
          },
          score: 80,
        },
        {
          id: 'thesis-q2-god',
          level: 'god',
          content: {
            zh: '感谢老师这个问题，这确实是一个关键考量。我想补充三点：第一，本研究在正式实验前进行了预实验，结果显示趋势一致性较高；第二，类似样本量在XX领域已有多篇高水平文献发表，如Smith(2022)、Wang(2023)，可作为先例参考；第三，本研究采用了XX统计方法对样本量进行了功效分析，结果在可接受范围内。当然，扩大样本仍是后续工作的重点，欢迎老师推荐合作资源。',
            en: "Thank you for this question — it's a crucial consideration. I'd like to add three points: first, I conducted a pilot study before the formal experiment, and the results showed high trend consistency; second, similar sample sizes have been published in top venues in the XX field, such as Smith (2022) and Wang (2023), which serve as precedents; third, I performed a power analysis on the sample size using method X, and the results fall within the acceptable range. Of course, expanding the sample remains a priority for future work, and I'd welcome any collaboration resources the professor might recommend.",
          },
          score: 95,
        },
        {
          id: 'thesis-q2-anti',
          level: 'anti',
          content: {
            zh: '老师，您2021年发在XX期刊上的那篇论文，样本量好像也就这个量级吧？不也照样发表了吗？',
            en: "Professor, your 2021 paper in Journal X — wasn't the sample size about the same magnitude? It still got published, didn't it?",
          },
          score: 100,
        },
      ],
    },
    {
      id: 'thesis-defense-q3',
      triggerDialog: {
        zh: "如果让你重新做这个研究，你会怎么做？",
        en: "If you had to do this research over again, how would you approach it?",
      },
      options: [
        {
          id: 'thesis-q3-low',
          level: 'low',
          content: {
            zh: '不会改，现在这个就挺好的。',
            en: "I wouldn't change anything — what I have now is fine.",
          },
          score: 20,
        },
        {
          id: 'thesis-q3-medium',
          level: 'medium',
          content: {
            zh: '会收集更多数据吧。',
            en: "I'd probably collect more data.",
          },
          score: 55,
        },
        {
          id: 'thesis-q3-high',
          level: 'high',
          content: {
            zh: '感谢老师这个问题。我会反思研究的不足：在理论框架上，可以引入XX视角；在方法上，应该尝试XX；在数据分析上，可以补充XX分析。今天各位老师的建议给了我很多启发，会在后续研究中持续改进。',
            en: "Thank you for this question. I'd reflect on the study's shortcomings: theoretically, I could incorporate perspective X; methodologically, I should try Y; for data analysis, I could add Z. The committee's feedback today has been genuinely inspiring, and I'll keep refining these aspects in future research.",
          },
          score: 80,
        },
        {
          id: 'thesis-q3-god',
          level: 'god',
          content: {
            zh: '感谢老师这个反思的机会。如果重新做，我会从三个层面系统优化：理论框架层面，从XX理论出发重新构建假设，使其更具解释力；方法层面，采用XX方法替代现有方法，提升内部效度；数据分析层面，引入XX技术挖掘更深层模式。这些反思不仅指导本研究的修订，也为我后续的博士研究奠定了方向。也想请教老师，您认为哪个层面的优化优先级最高？',
            en: "Thank you for the opportunity to reflect. If I were to start over, I'd systematically optimize on three levels: at the theoretical framework level, I'd rebuild hypotheses starting from theory X to make them more explanatory; at the methodological level, I'd adopt method Y to improve internal validity; at the data analysis level, I'd introduce technique Z to uncover deeper patterns. These reflections not only guide revisions to this study but also set the direction for my subsequent doctoral research. I'd also like to ask — which level of optimization do you think should be prioritized?",
          },
          score: 95,
        },
        {
          id: 'thesis-q3-anti',
          level: 'anti',
          content: {
            zh: '如果重新做，我就不选这个题目了。老师，如果是您，您会怎么选题？',
            en: "If I had to start over, I wouldn't pick this topic at all. Professor, if it were you — how would you choose a topic?",
          },
          score: 100,
        },
      ],
    },
  ],
};

export default scene;
