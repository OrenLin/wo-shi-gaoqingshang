// ======================================================================
// i18n — 语言状态管理 + UI 文本翻译字典
// 支持 zh（中文）/ en（英文）切换
// ======================================================================
import { create } from 'zustand';

export type Language = 'zh' | 'en';

type Dict = Record<string, string>;

const zh: Dict = {
  // ----- Home -----
  'home.brand': '🧠 情商测验 · 2026',
  'home.title1': '我是',
  'home.title2': '高情商',
  'home.hot': '🔥 火爆全网',
  'home.subtitle': '测测你的社死等级 · 整顿职场 · 拒绝内耗',
  'home.codenameInput': '给自己起个代号（可不填）',
  'home.codenamePh': '例：整顿职场哥 / 高情商大师',
  'home.chars': '字符',
  'home.startWithName': '带着代号开始挑战 →',
  'home.startAnon': '开始挑战（匿名高手）',
  'home.hint': '⭐ 多个场景 · 每题多选项 · 解锁你的段位',
  'home.guide': '👇 看看你是 情商之神 还是 社交杀手',
  'home.author': '✏️ 作者 · 森 SEN',
  'home.version': 'v1.3.0 · 2026',
  'home.loading1': '正在加载社死现场…',
  'home.loading2': '正在收集七大姑八大姨的灵魂拷问…',
  'home.loading3': '正在预热你的嘴替…',
  'home.loading4': '正在召唤你的对手：老板 / 催婚大姑 / 劝酒领导…',

  // ----- Language Switch -----
  'lang.label': '🌐 中 / EN',
  'lang.zh': '简体中文',
  'lang.en': 'English',

  // ----- Scene Select -----
  'select.home': '← 首页',
  'select.progress': '🔥 已完成',
  'select.title1': '选择你的',
  'select.title2': '社死',
  'select.title3': '现场',
  'select.tip': '👉 按顺序挑战，解锁你的最终段位',
  'select.completed': '✓ 已通关',
  'select.qs': '题 · 立即挑战 →',
  'select.challengeDone': '✅ 已挑战完成',
  'select.allDone': '🎉 全部通关！你的社交段位已生成',
  'select.viewReport': '查看我的情商鉴定报告 →',

  // ----- Immersive Preview -----
  'preview.pressureWarning': '前方压力来袭 · 准备好了吗？',
  'preview.enterScene': '进入战场！',
  'select.scene': '📍 场景',

  // ----- Game -----
  'game.back': '← 返回',
  'game.questionBadge': '💬 灵魂拷问',
  'game.howReply': '你会怎么回应？',
  'game.toggleCustom': '✍️ 自由发挥',
  'game.toggleOptions': '✍️ 返回选项',
  'game.submit': '🎯 提交本题答案 →',
  'game.revealScene': '🎯 揭晓本场景结果！',
  'game.pickOne': '👆 先选一个回应',
  'game.feedbackSmart': '嘴替附体！',
  'game.feedbackCringe': '抠出三室一厅…',

  // ----- Result -----
  'result.scoreBadge': '情商得分',
  'result.sceneAvg': '场景均分',
  'result.comment': '💬 解说',
  'result.tips': '💡 贴士',
  'result.yourReply': '👉 你的回答',
  'result.progress': '本场景进度：第',
  'result.progressOf': '题',
  'result.nextScene': '🚀 下一场景：',
  'result.viewFinal': '🎉 查看我的最终情商鉴定报告！',
  'result.nextQ': '🎯 下一题',
  'result.backToSelect': '返回场景选择',
  'result.scene': '💫 场景',
  'result.beatGlobal': '🌍 已超越全球',
  'result.beatGlobalPlayers': '的玩家',

  // ----- Final Report -----
  'report.allDone': '🏆 全部场景通关！',
  'report.totalScore': '综合情商得分',
  'report.total': '总分',
  'report.scenePerf': '📊 各场景表现',
  'report.eqChart': '📡 情商雷达图',
  'report.core': '🧠 情商内核',
  'report.history': '📜 历史对标',
  'report.comment': '🎯 社交画像',
  'report.share': '📣 分享文案',
  'report.shareBtn': '📤 分享我的段位 →',
  'report.retry': '🔄 重新挑战',
  'report.footer': '🧠 我是高情商 · 2026 · 拒绝无效社交从我做起',
  'report.copied': '✨ 分享文案已复制！快去朋友圈装X～',
  'report.shareTemplate': '我在「我是高情商」挑战中获得 {score} 分，段位：{emoji} {level}！{copy}',
  'report.hellMode': '🔥 随机地狱模式',
  'report.hellModeDesc': '混合所有场景的高难度题目，二刷玩家挑战',
  'report.hiddenAchievement': '🏅 隐藏成就',
  'report.achievementEqCeiling': '情商天花板',
  'report.achievementSocialKiller': '社交杀手',
  'report.reco': '🎯 你的专属书单&影单',
  'report.copyOne': '复制这一条',
  'report.copyAll': '复制全部推荐',
  'report.copiedShort': '已复制！',
  'report.recoBonus': '🎞️ 全段位通用彩蛋',
  'report.disclaimer': '· 游戏纯属娱乐 · 情商不是唯一标尺 · 表达风格因人而异 · 真诚最重要 ·',

  // ----- Audio Button -----
  'audio.enable': '🔊 点我开声音',
  'audio.muted': '🔇 静音中',
  'audio.on': '🎵 声音已开',

  // ----- Common -----
  'common.points': '分',
  'common.of': '/',
};

const en: Dict = {
  // ----- Home -----
  'home.brand': '🧠 EQ Quiz · 2026',
  'home.title1': "I'm a",
  'home.title2': 'Social',
  'home.title2b': 'Genius',
  'home.hot': '🔥 Viral Worldwide',
  'home.subtitle': 'Test your social-awkwards level · Fix workplace drama · Reject burnout',
  'home.codenameInput': 'Pick a codename (optional)',
  'home.codenamePh': 'e.g. Office Rebel / EQ Master',
  'home.chars': 'chars',
  'home.startWithName': 'Start Challenge with Name →',
  'home.startAnon': 'Start Challenge (Anonymous Pro)',
  'home.hint': '⭐ Multiple scenes · Several options each · Discover your rank',
  'home.guide': '👇 Are you an EQ God or a Social Killer?',
  'home.author': '✏️ By · SEN',
  'home.version': 'v1.3.0 · 2026',
  'home.loading1': 'Loading social-death scenarios…',
  'home.loading2': 'Collecting soul-searching questions from aunties…',
  'home.loading3': 'Warming up your social retort…',
  'home.loading4': 'Summoning your opponents: Boss / Marriage-Pressure Aunt / Drinking-Party Leader…',

  // ----- Language Switch -----
  'lang.label': '🌐 中 / EN',
  'lang.zh': '简体中文',
  'lang.en': 'English',

  // ----- Scene Select -----
  'select.home': '← Home',
  'select.progress': '🔥 Completed',
  'select.title1': 'Choose Your',
  'select.title2': 'Awkward',
  'select.title3': 'Situation',
  'select.tip': '👉 Play in order to unlock your final rank',
  'select.completed': '✓ Cleared',
  'select.qs': ' questions · Start Now →',
  'select.challengeDone': '✅ Already Completed',
  'select.allDone': '🎉 All Cleared! Your Social Rank is Ready',
  'select.viewReport': 'View My EQ Report →',

  // ----- Immersive Preview -----
  'preview.pressureWarning': 'Pressure Ahead · Ready?',
  'preview.enterScene': 'Enter the Battle!',
  'select.scene': '📍 Scene',

  // ----- Game -----
  'game.back': '← Back',
  'game.questionBadge': '💬 Soul-Searching Question',
  'game.howReply': 'How would you respond?',
  'game.toggleCustom': '✍️ Freestyle',
  'game.toggleOptions': '✍️ Back to Options',
  'game.submit': '🎯 Submit Answer →',
  'game.revealScene': '🎯 Reveal Scene Result!',
  'game.pickOne': '👆 Pick a response first',
  'game.feedbackSmart': 'Perfect Retort!',
  'game.feedbackCringe': 'Excavating a 3-BR apartment…',

  // ----- Result -----
  'result.scoreBadge': 'EQ Score',
  'result.sceneAvg': 'Scene Avg',
  'result.comment': '💬 Commentary',
  'result.tips': '💡 Tip',
  'result.yourReply': '👉 Your Reply',
  'result.progress': 'Progress: Q',
  'result.progressOf': '',
  'result.nextScene': '🚀 Next Scene:',
  'result.viewFinal': '🎉 View My Final EQ Report!',
  'result.nextQ': '🎯 Next Question',
  'result.backToSelect': 'Back to Scene Select',
  'result.scene': '💫 Scene',
  'result.beatGlobal': '🌍 Beat',
  'result.beatGlobalPlayers': 'of players worldwide',

  // ----- Final Report -----
  'report.allDone': '🏆 All Scenes Cleared!',
  'report.totalScore': 'Overall EQ Score',
  'report.total': 'Total',
  'report.scenePerf': '📊 Scene by Scene',
  'report.eqChart': '📡 EQ Radar',
  'report.core': '🧠 EQ Core',
  'report.history': '📜 Historical Parallel',
  'report.comment': '🎯 Social Profile',
  'report.share': '📣 Share Copy',
  'report.shareBtn': '📤 Share My Rank →',
  'report.retry': '🔄 Play Again',
  'report.hellMode': '🔥 Random Hell Mode',
  'report.hellModeDesc': 'Hardest questions mixed from all scenes — for second-run players',
  'report.hiddenAchievement': '🏅 Hidden Achievements',
  'report.achievementEqCeiling': 'EQ Ceiling',
  'report.achievementSocialKiller': 'Social Killer',
  'report.footer': '🧠 I am High-EQ · 2026 · Reject Toxic Socializing',
  'report.copied': '✨ Share text copied! Go flex on social media~',
  'report.shareTemplate': 'I scored {score} on the EQ Challenge · Rank: {emoji} {level}! {copy}',
  'report.reco': '🎯 Your Tailored Book & Movie Picks',
  'report.copyOne': 'Copy this one',
  'report.copyAll': 'Copy all recos',
  'report.copiedShort': 'Copied!',
  'report.recoBonus': '🎞️ Bonus · For all ranks',
  'report.disclaimer': '· For entertainment only · EQ isn\'t the only measure · Everyone communicates differently · Authenticity matters most ·',

  // ----- Audio Button -----
  'audio.enable': '🔊 Tap for Sound',
  'audio.muted': '🔇 Muted',
  'audio.on': '🎵 Sound On',

  // ----- Common -----
  'common.points': 'pts',
  'common.of': '/',
};

const dictionaries: Record<Language, Dict> = { zh, en };

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  language: 'zh',
  setLanguage: (lang: Language) => set({ language: lang }),
  t: (key: string, fallback?: string): string => {
    const lang = get().language;
    const val = dictionaries[lang]?.[key];
    if (val) return val;
    if (fallback) return fallback;
    // fallback to zh dictionary
    return dictionaries['zh']?.[key] ?? key;
  },
}));

// Non-hook version — for places where we can't use hooks
export const getI18n = () => useI18n.getState();

// Helper for localized (zh/en) content — returns the right language string
export function pickLocalized(
  field: string | { zh: string; en: string } | undefined,
  language: Language,
): string {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return (language === 'en' ? field.en : field.zh) ?? field.zh ?? '';
}

// Hook: returns a t() for UI strings AND a tLocal() for data-level localized fields
export function useLocale() {
  const language = useI18n((s) => s.language);
  return (field: string | { zh: string; en: string } | undefined): string =>
    pickLocalized(field, language);
}
