import { useI18n } from '../../i18n';

const SURVEY_URL = 'https://v.wjx.cn/vm/ejvSW8A.aspx#';

interface Props {
  variant?: 'compact' | 'full';
}

export default function SurveyLink({ variant = 'full' }: Props) {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';

  const label = zh ? '📝 填写问卷反馈' : '📝 Survey Feedback';
  const ariaLabel = zh
    ? '填写问卷反馈，在新窗口打开'
    : 'Open survey feedback in new tab';

  if (variant === 'compact') {
    return (
      <a
        href={SURVEY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-[#1a1a2e] font-black text-xs rounded-full px-4 py-1.5 border-[2px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] transition-transform active:scale-95 hover:scale-105 hover:-translate-y-[1px] no-underline"
      >
        <span aria-hidden="true">📝</span>
        {zh ? '问卷反馈' : 'Survey'}
      </a>
    );
  }

  return (
    <a
      href={SURVEY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="block bg-gradient-to-r from-emerald-400 to-teal-500 text-[#1a1a2e] rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-4 text-center transition-transform active:scale-95 hover:scale-[1.02] no-underline animate-pop-in"
    >
      <div className="text-2xl mb-1" aria-hidden="true">📝</div>
      <div className="font-black text-sm">{label}</div>
      <div className="text-[11px] font-bold opacity-70 mt-0.5">
        {zh ? '你的反馈让我变得更好 ❤️' : 'Your feedback makes us better ❤️'}
      </div>
    </a>
  );
}
