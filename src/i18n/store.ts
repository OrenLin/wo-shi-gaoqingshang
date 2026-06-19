// ======================================================================
// 国际化 i18n — 语言状态 + UI 文本翻译字典
// ======================================================================
import { create } from 'zustand';

export type Language = 'zh' | 'en';

// ---------- UI 文本翻译字典 ----------
export const dict: Record<Language, Record<string, string>> = {
  zh: {
    // ---- 首页 Home ----
    'home.brand': '🧠 情商测验 · 2026',
    'home.title1': '我是',
    'home.title2': '高情商',
    'home.hot': '🔥 火爆全网',
    'home.subtitle': '测测你的社死等级 · 整顿职场 · 拒绝内耗',
    'home.codename': '👤 给自己起个代号（可不填）',
    'home.codenamePh': '例：整顿职场哥 / 高情商大师',
    'home.chars': '字符',
    'home.startWithName': '带着代号开始挑战 →',
    'home.startAnon': '开始挑战（匿名高手）',
    'home.hint': '⭐ 多个场景 · 每场景多道题 · 测测你的段位',
    'home.guide': '👇 看看你是 情商之神 还是 社交杀手',
    'home.author': '✏️ 作者 · 森 SEN',
    'home.version': 'v1.2.0 · 2026',

    // ---- 语言切换 ----
    'lang.label': '🌐 中 / EN',
    'lang.zh': '简体中文',
    'lang.en': 'English',

    // ---- 场景选择 SceneSelect ----
    'select.home': '← Home',
    'select.progress': '🔥 已完成',
    'select.title1': 'Choose Your',
    'select.title2': 'Awkward',
    'select.title3': 'Situation',
    'select.titleZh1': '选择你的',
    'select.titleZh2': '社死',
    'select.titleZh3': '现场',
    'select.tip': '👉 按顺序挑战，解锁你的最终段位',
    'select.completed': '✓ 已通关',
    'select.qCount': '道题 · 立即挑战 →',
    'select.challengeDone': '✅ 已挑战完成',
    'select.allDone': '🎉 全部通关！你的社交段位已生成',

    // ---- 答题 Game ----
    'game.back': '← 返回',
    'game.questionBadge': '💬 灵魂拷问',
    'game.howReply': '你会怎么回应？',
    'game.toggleCustom': '✍️ 自由发挥',
    'game.toggleOptions': '✍️ 返回选项',
    'game.submit': '🎯 提交本题答案 →',
    'game.revealScene': '🎯 揭晓本场景结果！',
    'game.pickOne': '👆 先选一个回应',

    // ---- 结果 Result ----
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

    // ---- 最终报告 FinalReport ----
    'report.allDone': '🏆 全部场景通关！',
    'report.totalScore': '综合情商得分',
    'report.total': '总分',
    'report.scenePerf': '📊 各场景表现',
    'report.core': '🧠 情商内核',
    'report.history': '📜 历史对标',
    'report.comment': '🎯 社交画像',
    'report.share': '📣 分享文案',
    'report.shareBtn': '📤 分享我的段位 →',
    'report.retry': '🔄 重新挑战',
    'report.footer': '🧠 我是高情商 · 2026 · 拒绝无效社交从我做起',
    'report.copied': '✨ 分享文案已复制！快去朋友圈装X～',

    // ---- 音频按钮 App.tsx ----
    'audio.enable': '🔊 点我开声音',
    'audio.muted': '🔇 静音中',
    'audio.on': '🎵 声音已开',

    // ---- 通用 ----
    'common.points': '分',
    'common.of': '/',

    // ---- 无障碍 A11y ----
    'a11y.title': '♿ 无障碍设置',
    'a11y.hint': '点击下方开关，自定义你的体验',
    'a11y.activeCount': '已启用 {n} 项增强',
    'a11y.highContrast': '🎨 高对比度',
    'a11y.highContrastDesc': '黑白高对比，看得更清楚',
    'a11y.largeText': '🔠 大字体',
    'a11y.largeTextDesc': '所有文字放大 25%，更易读',
    'a11y.reduceMotion': '🚫 减少动画',
    'a11y.reduceMotionDesc': '关闭弹跳/漂浮/摇摆动画',
    'a11y.screenReader': '🔊 屏幕阅读器友好',
    'a11y.screenReaderDesc': '为辅助技术增强提示和语义',
    'a11y.keyboardHint': '键盘：按 Tab 键可在页面元素间切换',
    'a11y.tabHint': '按 Enter 或 Space 键可激活按钮',
  },
  en: {
    // ---- Home ----
    'home.brand': '🧠 EQ Quiz · 2026',
    'home.title1': "I'm a",
    'home.title2': 'Social',
    'home.title2b': 'Genius',
    'home.hot': '🔥 Viral Worldwide',
    'home.subtitle': 'Test your social awkwardness level · Fix workplace drama · Reject burnout',
    'home.codename': '👤 Pick a codename (optional)',
    'home.codenamePh': "e.g. Office Rebel / EQ Master",
    'home.chars': 'chars',
    'home.startWithName': 'Start Challenge with Name →',
    'home.startAnon': 'Start Challenge (Anonymous Pro)',
    'home.hint': '⭐ Multiple scenes · Several questions each · Discover your rank',
    'home.guide': '👇 Are you an EQ God or a Social Killer?',
    'home.author': '✏️ By · SEN',
    'home.version': 'v1.2.0 · 2026',

    // ---- Language Switch ----
    'lang.label': '🌐 中 / EN',
    'lang.zh': '简体中文',
    'lang.en': 'English',

    // ---- Scene Select ----
    'select.home': '← Home',
    'select.progress': '🔥 Completed',
    'select.title1': 'Choose Your',
    'select.title2': 'Awkward',
    'select.title3': 'Situation',
    'select.tip': '👉 Play in order to unlock your final rank',
    'select.completed': '✓ Cleared',
    'select.qCount': ' questions · Start Now →',
    'select.challengeDone': '✅ Already Completed',
    'select.allDone': '🎉 All Cleared! Your Social Rank is Ready',

    // ---- Game ----
    'game.back': '← Back',
    'game.questionBadge': '💬 Soul-Stirring Question',
    'game.howReply': 'How would you respond?',
    'game.toggleCustom': '✍️ Freestyle',
    'game.toggleOptions': '✍️ Back to Options',
    'game.submit': '🎯 Submit Answer →',
    'game.revealScene': '🎯 Reveal Scene Result!',
    'game.pickOne': '👆 Pick a response first',

    // ---- Result ----
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

    // ---- Final Report ----
    'report.allDone': '🏆 All Scenes Cleared!',
    'report.totalScore': 'Overall EQ Score',
    'report.total': 'Total',
    'report.scenePerf': '📊 Scene by Scene',
    'report.core': '🧠 EQ Core',
    'report.history': '📜 Historical Parallel',
    'report.comment': '🎯 Social Profile',
    'report.share': '📣 Share Copy',
    'report.shareBtn': '📤 Share My Rank →',
    'report.retry': '🔄 Play Again',
    'report.footer': '🧠 I am High-EQ · 2026 · Reject Toxic Socializing',
    'report.copied': '✨ Share text copied! Go flex on social media~',

    // ---- Audio Button ----
    'audio.enable': '🔊 Tap for Sound',
    'audio.muted': '🔇 Muted',
    'audio.on': '🎵 Sound On',

    // ---- Common ----
    'common.points': 'pts',
    'common.of': '/',

    // ---- Accessibility A11y ----
    'a11y.title': '♿ Accessibility Settings',
    'a11y.hint': 'Tap a switch below to customize your experience',
    'a11y.activeCount': '{n} enhancement(s) enabled',
    'a11y.highContrast': '🎨 High Contrast',
    'a11y.highContrastDesc': 'Black & white contrast for better readability',
    'a11y.largeText': '🔠 Large Text',
    'a11y.largeTextDesc': 'All text 25% larger, easier to read',
    'a11y.reduceMotion': '🚫 Reduce Motion',
    'a11y.reduceMotionDesc': 'Disable bounce/float/wobble animations',
    'a11y.screenReader': '🔊 Screen Reader Friendly',
    'a11y.screenReaderDesc': 'Enhanced hints for assistive technology',
    'a11y.keyboardHint': 'Keyboard: Tab to navigate between elements',
    'a11y.tabHint': 'Press Enter or Space to activate buttons',
  },
};

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  language: 'zh',
  setLanguage: (lang) => set({ language: lang }),
  t: (key, vars) => {
    const lang = get().language;
    let val: string | undefined = dict[lang]?.[key];
    if (!val) val = dict['zh']?.[key] ?? key;
    // 变量替换：{n} → vars.n
    if (vars && val) {
      for (const [k, v] of Object.entries(vars)) {
        val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return val;
  },
}));

// Non-hook version for places where we can't use hooks
export const getI18n = () => useI18n.getState();

/**
 * Helper: pick right language from a bilingual field.
 * Supports: `{ zh: string; en: string }`  OR  a plain string (treated as zh).
 */
export function pickLocale<F extends { zh?: string; en?: string } | string | undefined>(
  field: F,
  language: Language,
): string {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return (language === 'en' ? field.en : field.zh) ?? field.zh ?? '';
}

/** Hook version: pick a localized string based on current language. */
export function useLocale() {
  const language = useI18n((s) => s.language);
  return <F extends { zh?: string; en?: string } | string | undefined>(field: F): string =>
    pickLocale(field, language);
}
