// ======================================================================
// 辩论技巧 —— 基于专业辩论学的 8 个最佳实践
// ----------------------------------------------------------------------
// 理论基础：
//   1. 图尔敏论证模型（Toulmin Model）
//   2. 黑格尔辩证法（Hegelian Dialectic）
//   3. 苏格拉底诘问法（Socratic Questioning）
//   4. 类比推理（Analogical Reasoning）
//   5. 实证主义（Positivism）
//   6. 归谬法（Reductio ad Absurdum）
//   7. 情绪-理性桥接（Emotion-Reason Bridging）
//   8. 框架效应（Framing Effect）
// ======================================================================

export interface DebateTechnique {
  id: string;
  emoji: string;
  title: { zh: string; en: string };
  category: { zh: string; en: string };
  principle: { zh: string; en: string };
  example: { zh: string; en: string };
  tip: { zh: string; en: string };
}

export const DEBATE_TECHNIQUES: DebateTechnique[] = [
  {
    id: 'stance-clarify',
    emoji: '🎯',
    title: { zh: '立场澄清', en: 'Stance Clarification' },
    category: { zh: '图尔敏论证模型', en: 'Toulmin Model' },
    principle: {
      zh: '反驳前先界定概念。问清楚对方"你说的X具体指什么？"避免攻击稻草人。明确双方分歧点在哪里：是事实判断、价值判断还是政策判断。',
      en: 'Before refuting, clarify concepts. Ask "what exactly do you mean by X?" Avoid straw man attacks. Identify whether the disagreement is about facts, values, or policies.',
    },
    example: {
      zh: '对方："现在的年轻人都不努力。"\n你："你说的\'不努力\'是指工作时长短，还是指产出效率低？据统计局数据，2024年青年周均工作时长48.7小时，高于5年前。"',
      en: 'Opponent: "Young people today don\'t work hard."\nYou: "By \'don\'t work hard\' do you mean short hours or low output? Per statistics, 2024 youth work 48.7 hrs/week, up from 5 years ago."',
    },
    tip: {
      zh: '用"你的意思是...对吗？"复述对方观点，确认无误后再反驳。',
      en: 'Use "So you mean... right?" to paraphrase before refuting.',
    },
  },
  {
    id: 'strategic-concession',
    emoji: '🔄',
    title: { zh: '以退为进', en: 'Strategic Concession' },
    category: { zh: '黑格尔辩证法', en: 'Hegelian Dialectic' },
    principle: {
      zh: '先承认对方部分合理，再转折提出自己的观点。"你说得对，X 确实存在。但..."这种结构让对方放下防御，更愿意听你的论点。正题-反题-合题。',
      en: 'Acknowledge partial validity first, then pivot. "You\'re right that X exists. But..." This structure lowers defenses. Thesis-Antithesis-Synthesis.',
    },
    example: {
      zh: '对方："远程办公效率一定低。"\n你："确实，远程办公缺少面对面交流，沟通成本会上升。但数据显示，远程员工专注时间比办公室高 30%，关键看管理方式。"',
      en: 'Opponent: "Remote work is always less efficient."\nYou: "True, remote lacks face-to-face, raising communication costs. But data shows remote workers have 30% more focus time — it depends on management."',
    },
    tip: {
      zh: '承认的部分要具体真诚，转折要干脆有力。',
      en: 'Be specific and sincere in concession, crisp in the pivot.',
    },
  },
  {
    id: 'socratic-questioning',
    emoji: '❓',
    title: { zh: '苏格拉底提问', en: 'Socratic Questioning' },
    category: { zh: '苏格拉底诘问法', en: 'Socratic Method' },
    principle: {
      zh: '不直接反驳，而是用一系列问题引导对方自己发现矛盾。问"为什么？""有没有反例？""如果...会怎样？"让对方在回答中暴露逻辑漏洞。',
      en: 'Don\'t refute directly; use questions to guide opponents to find their own contradictions. Ask "Why?" "Any counterexamples?" "What if...?"',
    },
    example: {
      zh: '对方："学历越高能力越强。"\n你："那比尔·盖茨、乔布斯大学没毕业，能力不强吗？"\n对方："他们是特例。"\n你："那多少个特例才能推翻你的规律？1%？5%？"',
      en: 'Opponent: "Higher education means higher ability."\nYou: "So Gates and Jobs, college dropouts, had low ability?"\nThem: "They\'re exceptions."\nYou: "How many exceptions to disprove your rule? 1%? 5%?"',
    },
    tip: {
      zh: '提问要温和好奇，不要质问。让对方"自己打自己"。',
      en: 'Ask with gentle curiosity, not interrogation. Let them defeat themselves.',
    },
  },
  {
    id: 'analogy',
    emoji: '⚖️',
    title: { zh: '类比论证', en: 'Analogical Argument' },
    category: { zh: '类比推理', en: 'Analogical Reasoning' },
    principle: {
      zh: '用对方熟悉的场景类比陌生概念，降低理解门槛。好的类比要抓住本质相似性，而非表面相似。类比是桥梁，不是证据。',
      en: 'Use familiar scenarios to explain unfamiliar concepts. Good analogies capture essential similarity, not surface similarity. Analogy is a bridge, not proof.',
    },
    example: {
      zh: '解释"为什么不能只看 KPI"：\n"KPI 就像汽车仪表盘的时速表。只盯着时速表开车会出事故，你还得看路况、油量、后视镜。"',
      en: 'Explaining "why not just KPIs":\n"KPIs are like a speedometer. Driving while staring only at the speedometer causes accidents — you need road conditions, fuel, mirrors too."',
    },
    tip: {
      zh: '类比要贴近对方生活经验。对方是程序员就用代码类比，是父母就用育儿类比。',
      en: 'Match analogies to the opponent\'s experience. Programmers get code analogies, parents get parenting ones.',
    },
  },
  {
    id: 'data-support',
    emoji: '📊',
    title: { zh: '数据支撑', en: 'Data Support' },
    category: { zh: '实证主义', en: 'Positivism' },
    principle: {
      zh: '用事实和数据说话，而非主观感受。引用数据要注明来源、样本量、时间范围。一个可靠的数据胜过一百句"我觉得"。',
      en: 'Speak with facts and data, not subjective feelings. Cite sources, sample sizes, time ranges. One reliable datum beats 100 "I feel"s.',
    },
    example: {
      zh: '对方："996 是福报，大家都在加班。"\n你："据 2024 年中国劳动统计年鉴，互联网行业周均工作 52 小时，但员工满意度仅 38%，离职率是其他行业 2.3 倍。\'福报\'的标准是什么？"',
      en: 'Opponent: "996 is a blessing, everyone works overtime."\nYou: "Per 2024 China Labor Statistics, internet sector averages 52 hrs/week, but satisfaction is 38%, turnover 2.3x other industries. What defines \'blessing\'?"',
    },
    tip: {
      zh: '数据要新（1 年内）、来源要权威（统计局/顶刊）、要可验证。',
      en: 'Data should be recent (within 1 year), authoritative (stats bureaus/top journals), verifiable.',
    },
  },
  {
    id: 'mirror-refutation',
    emoji: '🪞',
    title: { zh: '镜像反驳', en: 'Mirror Refutation' },
    category: { zh: '归谬法', en: 'Reductio ad Absurdum' },
    principle: {
      zh: '用对方的逻辑反证对方。假设对方观点成立，推导出荒谬结论，从而证明原观点错误。"按你的逻辑，那...也对？"',
      en: 'Use the opponent\'s logic against them. Assume their view holds, derive an absurd conclusion, thus disproving it. "By your logic, then... is also true?"',
    },
    example: {
      zh: '对方："年纪大就该让着年纪小的。"\n你："按这个逻辑，60 岁的应该让着 30 岁的，30 岁让着 10 岁的，那 10 岁的是不是要让着 1 岁的？1 岁的让着刚出生的？最后是不是所有人都得让着婴儿？"',
      en: 'Opponent: "Older should yield to younger."\nYou: "By that logic, 60 yields to 30, 30 to 10, 10 to 1, 1 to newborns? Eventually everyone yields to babies?"',
    },
    tip: {
      zh: '推导要严格遵循对方逻辑，不能偷换概念。结论越荒谬越好。',
      en: 'Follow their logic strictly, no concept-switching. The more absurd the conclusion, the better.',
    },
  },
  {
    id: 'bridge-transition',
    emoji: '🌉',
    title: { zh: '桥梁过渡', en: 'Bridge Transition' },
    category: { zh: '情绪-理性桥接', en: 'Emotion-Reason Bridge' },
    principle: {
      zh: '先认同对方情绪，再引导到理性讨论。"我理解你为什么生气，这件事确实让人不爽。我们来看看怎么解决..."情绪不被接纳时，理性进不来。',
      en: 'Acknowledge emotions first, then guide to reason. "I understand why you\'re upset, this is frustrating. Let\'s look at solutions..." When emotions aren\'t accepted, reason can\'t enter.',
    },
    example: {
      zh: '同事发火："这个方案根本行不通！"\n你："听出来你对这个方案有顾虑，确实有几个风险点需要讨论。你最担心的是哪部分？我们一起拆解看看。"',
      en: 'Colleague: "This plan won\'t work!"\nYou: "I hear your concerns, there are risks to discuss. Which part worries you most? Let\'s break it down together."',
    },
    tip: {
      zh: '认同情绪≠认同观点。说"理解你的感受"不等于"你说得对"。',
      en: 'Validating emotion ≠ validating viewpoint. "I understand your feeling" ≠ "you\'re right".',
    },
  },
  {
    id: 'frame-closing',
    emoji: '🏁',
    title: { zh: '总结收束', en: 'Frame Closing' },
    category: { zh: '框架效应', en: 'Framing Effect' },
    principle: {
      zh: '主动定义讨论框架和结论。不要让对方主导"我们到底在争什么"。用"所以我们的分歧其实是..."重新聚焦，用"综合来看..."收束结论。',
      en: 'Proactively define the discussion frame and conclusion. Don\'t let opponents control "what we\'re arguing about". Use "so our real disagreement is..." to refocus, "overall..." to conclude.',
    },
    example: {
      zh: '"所以我们的分歧不是\'要不要努力\'，而是\'努力的边界在哪\'。综合来看，努力是必要的，但要有健康底线和性价比考量。你觉得这个总结准确吗？"',
      en: '"So our disagreement isn\'t \'whether to work hard\' but \'where the boundary is\'. Overall, effort is necessary but needs health limits and ROI. Is this summary fair?"',
    },
    tip: {
      zh: '总结要包含对方合理观点，让对方有台阶下。结尾用问句邀请确认。',
      en: 'Summaries should include their valid points, giving them a graceful exit. End with a question inviting confirmation.',
    },
  },
];

// ======================================================================
// 持久化逻辑
// ======================================================================
const STORAGE_KEY = 'eq_debate_progress';

export function loadDebateProgress(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function saveDebateProgress(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function toggleDebateLearned(id: string): string[] {
  const learned = loadDebateProgress();
  const idx = learned.indexOf(id);
  if (idx >= 0) {
    learned.splice(idx, 1);
  } else {
    learned.push(id);
  }
  saveDebateProgress(learned);
  return learned;
}
