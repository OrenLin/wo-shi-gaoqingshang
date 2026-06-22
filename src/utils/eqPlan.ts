// ======================================================================
// 情商提升计划 —— 基于心理学/社会学/情商学的 4 阶段打卡计划
// ----------------------------------------------------------------------
// 理论基础：
//   阶段1: Goleman 情商理论（自我认知）
//   阶段2: Rogers 人本主义 + Marshall Rosenberg NVC（共情与倾听）
//   阶段3: Cloud 边界理论 + Fisher 谈判学（边界与冲突）
//   阶段4: Cialdini 影响力 + Brown 领导力（影响与领导）
// ======================================================================

export interface BookRec {
  title: { zh: string; en: string };
  author: { zh: string; en: string };
  category: { zh: string; en: string };
  why: { zh: string; en: string };
}

export interface MediaRec {
  title: { zh: string; en: string };
  type: 'movie' | 'tv';
  why: { zh: string; en: string };
}

export interface PlanStage {
  id: string;
  emoji: string;
  title: { zh: string; en: string };
  duration: { zh: string; en: string };
  description: { zh: string; en: string };
  theory: { zh: string; en: string };
  books: BookRec[];
  media: MediaRec[];
  goals: { zh: string; en: string }[];
}

export interface PlanProgress {
  tasks: Record<string, boolean>; // taskId -> done
  startDate: string; // ISO date
  completedStages: string[]; // stageId[]
}

const STORAGE_KEY = 'eq_plan_progress';

// ======================================================================
// 4 阶段计划定义
// ======================================================================
export const PLAN_STAGES: PlanStage[] = [
  {
    id: 'stage-1',
    emoji: '🌱',
    title: { zh: '入门篇 · 认知觉醒', en: 'Stage 1 · Cognitive Awakening' },
    duration: { zh: '第 1 周', en: 'Week 1' },
    description: {
      zh: '从认识自己的情绪开始，建立情商的基础认知框架。',
      en: 'Start by recognizing your own emotions and building a foundational EQ framework.',
    },
    theory: {
      zh: 'Goleman 情商理论：自我意识是情商五要素的基石',
      en: "Goleman's EQ Theory: Self-awareness is the cornerstone of the 5 EQ components",
    },
    books: [
      {
        title: { zh: '情商：为什么情商比智商更重要', en: 'Emotional Intelligence' },
        author: { zh: '丹尼尔·戈尔曼', en: 'Daniel Goleman' },
        category: { zh: '心理学经典', en: 'Psychology Classic' },
        why: {
          zh: '情商理论奠基之作，系统介绍情商五要素：自我意识、自我管理、动机、共情、社交技能。',
          en: 'The foundational work on EQ, systematically introducing the 5 components: self-awareness, self-management, motivation, empathy, and social skills.',
        },
      },
      {
        title: { zh: '高效能人士的七个习惯', en: 'The 7 Habits of Highly Effective People' },
        author: { zh: '史蒂芬·柯维', en: 'Stephen R. Covey' },
        category: { zh: '自我管理', en: 'Self-Management' },
        why: {
          zh: '"积极主动"和"以终为始"两个习惯直接对应情商中的自我管理能力。',
          en: 'The habits "Be Proactive" and "Begin with the End in Mind" directly map to self-management in EQ.',
        },
      },
    ],
    media: [
      {
        title: { zh: '心灵奇旅 (Soul)', en: 'Soul (2020)' },
        type: 'movie',
        why: {
          zh: '皮克斯动画，探讨"人生的火花"——帮助你思考什么真正让你感到活着。',
          en: 'Pixar animation exploring "the spark of life" — helps you reflect on what truly makes you feel alive.',
        },
      },
    ],
    goals: [
      { zh: '每天记录 3 次情绪波动，标注情绪名称', en: 'Record 3 emotional fluctuations daily, label each emotion' },
      { zh: '识别自己的"情绪触发点"（什么人/事让你情绪波动）', en: 'Identify your emotional triggers (what people/events cause fluctuations)' },
      { zh: '完成《情商》前 3 章阅读', en: 'Read the first 3 chapters of "Emotional Intelligence"' },
    ],
  },
  {
    id: 'stage-2',
    emoji: '👂',
    title: { zh: '进阶篇 · 共情与倾听', en: 'Stage 2 · Empathy & Listening' },
    duration: { zh: '第 2 周', en: 'Week 2' },
    description: {
      zh: '学会真正听见对方，用非暴力沟通建立深度连接。',
      en: 'Learn to truly hear others and build deep connections through Nonviolent Communication.',
    },
    theory: {
      zh: 'Rogers 人本主义 + Rosenberg NVC：共情是关系的核心',
      en: "Rogers' Humanism + Rosenberg's NVC: Empathy is the core of relationships",
    },
    books: [
      {
        title: { zh: '非暴力沟通', en: 'Nonviolent Communication' },
        author: { zh: '马歇尔·卢森堡', en: 'Marshall B. Rosenberg' },
        category: { zh: '沟通学经典', en: 'Communication Classic' },
        why: {
          zh: 'NVC 四要素：观察、感受、需要、请求。学会不带评判地表达，是高情商沟通的核心。',
          en: 'NVC 4 components: Observation, Feeling, Need, Request. Learning to express without judgment is the core of high-EQ communication.',
        },
      },
      {
        title: { zh: '成为一个人：心理治疗者的观点', en: 'On Becoming a Person' },
        author: { zh: '卡尔·罗杰斯', en: 'Carl Rogers' },
        category: { zh: '人本主义心理学', en: 'Humanistic Psychology' },
        why: {
          zh: '罗杰斯的"无条件积极关注"和"反射性倾听"是共情训练的经典方法。',
          en: "Rogers' 'unconditional positive regard' and 'reflective listening' are classic empathy training methods.",
        },
      },
    ],
    media: [
      {
        title: { zh: '心灵捕手 (Good Will Hunting)', en: 'Good Will Hunting (1997)' },
        type: 'movie',
        why: {
          zh: '心理医生Sean对Will的共情式倾听，是教科书级别的示范。',
          en: "Therapist Sean's empathic listening toward Will is a textbook-level demonstration.",
        },
      },
    ],
    goals: [
      { zh: '用 NVC 四要素重写你最近一次冲突对话', en: 'Rewrite your last conflict conversation using NVC 4 components' },
      { zh: '练习"反射性倾听"：复述对方的话再回应', en: 'Practice reflective listening: paraphrase before responding' },
      { zh: '观察一次对话，只听不评判', en: 'Observe one conversation without any judgment' },
    ],
  },
  {
    id: 'stage-3',
    emoji: '🛡️',
    title: { zh: '深化篇 · 边界与冲突', en: 'Stage 3 · Boundaries & Conflict' },
    duration: { zh: '第 3 周', en: 'Week 3' },
    description: {
      zh: '学会健康地说"不"，在冲突中既保护自己又不破坏关系。',
      en: 'Learn to say "no" healthily, protecting yourself without damaging relationships during conflicts.',
    },
    theory: {
      zh: 'Cloud 边界理论 + Fisher 谈判学：边界是关系的护栏',
      en: "Cloud's Boundary Theory + Fisher's Negotiation: Boundaries are relationship guardrails",
    },
    books: [
      {
        title: { zh: '边界：何时说好，何时说不', en: 'Boundaries: When to Say Yes, How to Say No' },
        author: { zh: '亨利·克劳德', en: 'Henry Cloud' },
        category: { zh: '关系心理学', en: 'Relationship Psychology' },
        why: {
          zh: '清晰界定什么是你的责任、什么是别人的责任，是健康关系的基础。',
          en: 'Clearly defining what is your responsibility vs. others\' is the foundation of healthy relationships.',
        },
      },
      {
        title: { zh: '谈判力', en: 'Getting to Yes' },
        author: { zh: '罗杰·费希尔', en: 'Roger Fisher' },
        category: { zh: '冲突解决', en: 'Conflict Resolution' },
        why: {
          zh: '"原则性谈判"四方法：把人和问题分开、关注利益而非立场、创造双赢选项、坚持客观标准。',
          en: 'Principled negotiation: separate people from problem, focus on interests not positions, invent options for mutual gain, insist on objective criteria.',
        },
      },
    ],
    media: [
      {
        title: { zh: '傲骨贤妻 (The Good Wife) 精选集', en: 'The Good Wife (Selected Episodes)' },
        type: 'tv',
        why: {
          zh: '观察Alicia如何在职场冲突中既坚守边界又维护关系。',
          en: 'Observe how Alicia maintains boundaries while preserving relationships in workplace conflicts.',
        },
      },
    ],
    goals: [
      { zh: '列出 3 件你一直想做但没敢拒绝的事，本周练习拒绝', en: 'List 3 things you wanted to decline but didn\'t; practice saying no this week' },
      { zh: '用"我语句"表达一次不满（"当...时，我感到...因为我需要..."）', en: 'Use "I-statements" to express one dissatisfaction' },
      { zh: '识别一段关系中的"边界模糊"问题', en: 'Identify a "boundary blur" issue in one relationship' },
    ],
  },
  {
    id: 'stage-4',
    emoji: '👑',
    title: { zh: '大师篇 · 影响与领导', en: 'Stage 4 · Influence & Leadership' },
    duration: { zh: '第 4 周', en: 'Week 4' },
    description: {
      zh: '从自我管理到影响他人，成为真正的高情商领导者。',
      en: 'Move from self-management to influencing others, becoming a true high-EQ leader.',
    },
    theory: {
      zh: 'Cialdini 影响力六原则 + Brown 脆弱性领导力',
      en: "Cialdini's 6 Principles of Influence + Brown's Vulnerable Leadership",
    },
    books: [
      {
        title: { zh: '影响力', en: 'Influence: The Psychology of Persuasion' },
        author: { zh: '罗伯特·西奥迪尼', en: 'Robert B. Cialdini' },
        category: { zh: '社会心理学', en: 'Social Psychology' },
        why: {
          zh: '互惠、承诺一致、社会认同、喜好、权威、稀缺——六大影响力原则是高情商影响他人的科学基础。',
          en: 'Reciprocity, commitment, social proof, liking, authority, scarcity — the 6 principles are the scientific basis of high-EQ influence.',
        },
      },
      {
        title: { zh: '敢于领导', en: 'Dare to Lead' },
        author: { zh: '布琳·布朗', en: 'Brené Brown' },
        category: { zh: '领导力', en: 'Leadership' },
        why: {
          zh: '脆弱性不是软弱，而是勇气的体现。敢于示弱的领导者更能建立信任。',
          en: 'Vulnerability is not weakness but courage. Leaders who dare to be vulnerable build deeper trust.',
        },
      },
    ],
    media: [
      {
        title: { zh: '国王的演讲 (The King\'s Speech)', en: 'The King\'s Speech (2010)' },
        type: 'movie',
        why: {
          zh: '乔治六世克服口吃的历程，是脆弱性领导力的最佳示范。',
          en: 'King George VI overcoming stuttering is the best demonstration of vulnerable leadership.',
        },
      },
    ],
    goals: [
      { zh: '在一次会议/对话中运用"互惠原则"先给予价值', en: 'Apply the reciprocity principle in one meeting: give value first' },
      { zh: '练习一次"脆弱性表达"：分享一个你不确定/害怕的事', en: 'Practice vulnerable expression: share one uncertainty/fear' },
      { zh: '复盘 4 周学习，写下 3 个最重要的改变', en: 'Review the 4-week journey, write down 3 most important changes' },
    ],
  },
];

// ======================================================================
// 持久化逻辑
// ======================================================================
export function loadPlanProgress(): PlanProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tasks: parsed.tasks ?? {},
        startDate: parsed.startDate ?? new Date().toISOString(),
        completedStages: parsed.completedStages ?? [],
      };
    }
  } catch { /* ignore */ }
  return {
    tasks: {},
    startDate: new Date().toISOString(),
    completedStages: [],
  };
}

export function savePlanProgress(p: PlanProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch { /* ignore */ }
}

export function toggleTask(stageId: string, taskId: string): PlanProgress {
  const progress = loadPlanProgress();
  const fullId = `${stageId}:${taskId}`;
  progress.tasks[fullId] = !progress.tasks[fullId];
  // 检查阶段是否全部完成
  const stage = PLAN_STAGES.find((s) => s.id === stageId);
  if (stage) {
    const allTasks = getAllTaskIds(stage);
    const allDone = allTasks.every((id) => progress.tasks[`${stageId}:${id}`]);
    if (allDone && !progress.completedStages.includes(stageId)) {
      progress.completedStages.push(stageId);
    } else if (!allDone && progress.completedStages.includes(stageId)) {
      progress.completedStages = progress.completedStages.filter((id) => id !== stageId);
    }
  }
  savePlanProgress(progress);
  return progress;
}

export function resetPlan(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// 获取阶段的所有任务 ID（书籍 + 影视 + 目标）
export function getAllTaskIds(stage: PlanStage): string[] {
  const ids: string[] = [];
  stage.books.forEach((_, i) => ids.push(`book-${i}`));
  stage.media.forEach((_, i) => ids.push(`media-${i}`));
  stage.goals.forEach((_, i) => ids.push(`goal-${i}`));
  return ids;
}

export function getStageProgress(stageId: string): { done: number; total: number; pct: number } {
  const progress = loadPlanProgress();
  const stage = PLAN_STAGES.find((s) => s.id === stageId);
  if (!stage) return { done: 0, total: 0, pct: 0 };
  const allIds = getAllTaskIds(stage);
  const done = allIds.filter((id) => progress.tasks[`${stageId}:${id}`]).length;
  return { done, total: allIds.length, pct: allIds.length > 0 ? Math.round((done / allIds.length) * 100) : 0 };
}

export function getOverallProgress(): { doneStages: number; totalStages: number; pct: number; doneTasks: number; totalTasks: number } {
  const progress = loadPlanProgress();
  const totalTasks = PLAN_STAGES.reduce((sum, s) => sum + getAllTaskIds(s).length, 0);
  const doneTasks = Object.values(progress.tasks).filter(Boolean).length;
  const doneStages = progress.completedStages.length;
  return {
    doneStages,
    totalStages: PLAN_STAGES.length,
    pct: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    doneTasks,
    totalTasks,
  };
}
