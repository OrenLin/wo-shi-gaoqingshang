// ======================================================================
// 核心类型定义
// ======================================================================

// 双语字段：同一份数据同时承载中文/英文
export interface Localized {
  zh: string;
  en: string;
}

export interface Character {
  name: string | Localized;  // 人物名（支持双语）
  emoji: string;
  description?: string | Localized;  // 人物描述（支持双语）
}

export type OptionLevel =
  | 'anti'
  | 'low'
  | 'medium'
  | 'high'
  | 'god';

export interface Option {
  id: string;
  level: OptionLevel;
  content: string | Localized;
  score: number;
}

// ---------- 题目 ----------
export interface Question {
  id: string;
  triggerDialog: string | Localized;           // NPC 灵魂拷问
  characters?: Character[];                       // 可选：该题专属人物
  options: Option[];                            // 预设选项
  allowCustomInput?: boolean;                   // 是否允许自由发挥
}

// ---------- 场景 ----------
export interface Scene {
  id: string;
  title: string | Localized;
  emoji: string;
  description: string | Localized;
  bgImage: string;
  bgColor: string;
  accentColor: string;
  characters: Character[];
  questions: Question[];
}

// ---------- 段位 ----------
export interface Recommendation {
  icon: string;              // 📖 或 🎬
  title: { zh: string; en: string };   // 书名/片名（含原文或作者）
  desc: { zh: string; en: string };    // 1-2 句推荐理由
}

export interface Level {
  name: string | Localized;
  tag: string | Localized;
  emoji: string;
  minScore: number;
  maxScore: number;
  slogan: string | Localized;
  descModule: {
    core: string | Localized;
    history: string | Localized;
    comment: string | Localized;
  };
  socialCopy: string | Localized;
  recos: Recommendation[];   // 段位精准推荐：书+影
}
