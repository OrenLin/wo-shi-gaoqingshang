// ======================================================================
// 核心类型定义
// 所有与场景/选项/段位的数据模型集中在这一个文件
// 新增场景/题目时，只需要加符合 Scene 类型即可
// ======================================================================

// ---------- 基本元素 ----------

export interface Character {
  name: string;
  emoji: string;
  description?: string;
}

export type OptionLevel =
  | 'anti'    // 抗压之王（反杀型）
  | 'low'     // 低情商
  | 'medium'  // 中情商
  | 'high'    // 高情商
  | 'god';    // 情商之神

export interface Option {
  id: string;
  level: OptionLevel;
  content: string;
  score: number;
}

// ---------- 题目 ----------
// 一个场景（Scene）可以包含多道题（Question）
// 每道题有自己的触发话术和选项
export interface Question {
  id: string;                      // 题目唯一ID（建议: `${sceneId}-q${n`）
  triggerDialog: string;           // NPC 的灵魂拷问
  characters?: Character[];          // 可选：该题专属人物；不传则使用场景默认人物
  options: Option[];              // 预设选项
  allowCustomInput?: boolean;      // 是否允许自由发挥（默认 true）
}

// ---------- 场景 ----------
export interface Scene {
  id: string;
  title: string;
  emoji: string;
  description: string;
  bgImage: string;                 // 本地SVG或图片URL
  bgColor: string;                 // Tailwind渐变: 'from-red-500/80 via-orange-400/60 to-amber-500/70'
  accentColor: string;               // 语义色: 'red' | 'orange' | 'amber'...
  characters: Character[];          // 场景默认人物
  questions: Question[];            // ⭐ 该场景下的所有题目
}

// ---------- 段位 ----------
export interface Level {
  name: string;                     // 显示名：情商之神 / 抗压之王...
  tag: string;                      // 简短人设标签
  emoji: string;                     // Emoji：👑🔥😎😅💀
  minScore: number;
  maxScore: number;
  slogan: string;                   // 一句话核心人设（UI大标题副标题）
  /** 四段式结构化文案 */
  descModule: {
    core: string;                    // 情商内核
    history: string;                 // 历史对标 + 匹配逻辑
    comment: string;                 // 社交画像
  };
  socialCopy: string;               // 朋友圈/分享海报短句
}
