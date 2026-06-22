// ======================================================================
// Consent Modal — 隐私同意弹窗（支持中英文）
//
// 合规要点：
// 1. 本应用仅用于娱乐，不收集任何可识别身份的信息
// 2. 匿名访问日志由 Vercel / GitHub Pages 等基础设施处理
// 3. 匿名日志可能在境外被处理（GDPR / PIPL 提示）
// 4. 用户需同意后才能进入游戏
// ======================================================================
import { useEffect } from 'react';
import { useI18n } from '../../i18n';
import { audioManager } from '../../utils/audioManager';

interface Props {
  open: boolean;
  accepted: boolean;
  showPrivacy: boolean;
  onToggleAccept: (value: boolean) => void;
  onTogglePrivacy: (value: boolean) => void;
  onConfirm: () => void;
}

export default function ConsentModal({
  open,
  accepted,
  showPrivacy,
  onToggleAccept,
  onTogglePrivacy,
  onConfirm,
}: Props) {
  const language = useI18n((s) => s.language);
  const t = useI18n((s) => s.t);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // ESC 仅在展开完整隐私条款时收起条款
        onTogglePrivacy(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onTogglePrivacy]);

  if (!open) return null;

  const zh = language === 'zh';

  return (
    <div className="fixed inset-0 z-[180] flex items-end md:items-center justify-center px-3 md:px-5">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-[#1a1a2e]/70 backdrop-blur-sm"
        onClick={() => onTogglePrivacy(false)}
      />

      {/* 弹窗主体 */}
      <div className="relative w-full max-w-lg bg-white rounded-[28px] border-[4px] border-[#1a1a2e] shadow-[8px_8px_0_0_#1a1a2e] overflow-hidden animate-pop-in">
        {/* 顶部：彩色横幅 */}
        <div className="bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 px-5 pt-5 pb-4 border-b-[3px] border-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔒</div>
            <div className="flex-1">
              <div className="text-white font-black text-lg md:text-xl"
                   style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
                {zh ? '隐私与使用说明' : 'Privacy & Usage Notice'}
              </div>
              <div className="text-white/90 text-xs font-bold mt-0.5">
                {zh ? '· 仅 30 秒阅读' : '· Takes 30 seconds to read'}
              </div>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-5 space-y-4 max-h-[60vh] md:max-h-[55vh] overflow-y-auto">
          {/* 娱乐声明 */}
          <div className="bg-yellow-50 border-[3px] border-[#1a1a2e] rounded-2xl p-4">
            <div className="font-black text-[#1a1a2e] text-sm mb-1">
              🎮 {zh ? '本应用仅供娱乐' : 'For Entertainment Only'}
            </div>
            <p className="text-xs font-semibold text-[#1a1a2e]/80 leading-relaxed">
              {zh
                ? '本应用是一个趣味情商测试，测试结果不构成任何专业建议，请勿当真。'
                : 'This app is a lighthearted EQ quiz. Results do not constitute professional advice. Please take them with a grain of salt.'}
            </p>
          </div>

          {/* 数据收集说明 */}
          <div className="bg-sky-50 border-[3px] border-[#1a1a2e] rounded-2xl p-4">
            <div className="font-black text-[#1a1a2e] text-sm mb-1.5">
              📊 {zh ? '我们收集什么' : 'What We Collect'}
            </div>
            <ul className="space-y-1.5 text-xs font-semibold text-[#1a1a2e]/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#1a1a2e]">✓</span>
                <span>
                  {zh
                    ? '匿名访问日志（IP、浏览器类型、访问时间）'
                    : 'Anonymous access logs (IP, browser type, timestamp)'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a1a2e]">✓</span>
                <span>
                  {zh
                    ? '你选择的代号（仅保存在你本地浏览器）'
                    : 'Codename you choose — stored only in your browser'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a1a2e]">✓</span>
                <span>
                  {zh
                    ? '游戏过程中的答题和分数（保存在你本地浏览器）'
                    : 'Your answers and score — stored only in your browser'}
                </span>
              </li>
            </ul>
          </div>

          {/* 我们不收集 */}
          <div className="bg-rose-50 border-[3px] border-[#1a1a2e] rounded-2xl p-4">
            <div className="font-black text-[#1a1a2e] text-sm mb-1.5">
              🚫 {zh ? '我们不收集什么' : 'What We Do NOT Collect'}
            </div>
            <ul className="space-y-1.5 text-xs font-semibold text-[#1a1a2e]/80 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#1a1a2e]">✕</span>
                <span>
                  {zh ? '真实姓名、手机号、邮箱等身份信息' : 'Name, phone, email or any personally identifiable info'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a1a2e]">✕</span>
                <span>
                  {zh ? '位置、通讯录、相册等敏感权限' : 'Location, contacts, photos or other sensitive permissions'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a1a2e]">✕</span>
                <span>
                  {zh ? '也不会把任何数据提供给第三方，或用于广告' : 'No third-party data sharing. No advertising use.'}
                </span>
              </li>
            </ul>
          </div>

          {/* 跨境传输提示 */}
          <div className="bg-amber-50 border-[3px] border-[#1a1a2e] rounded-2xl p-4">
            <div className="font-black text-[#1a1a2e] text-sm mb-1.5">
              🌍 {zh ? '基础设施提示' : 'Hosting Notice'}
            </div>
            <p className="text-xs font-semibold text-[#1a1a2e]/80 leading-relaxed">
              {zh
                ? '本应用由 Vercel / GitHub Pages 等海外基础设施提供服务。匿名访问日志可能在境外服务器上被处理，以保障网站正常运行。'
                : 'This app is served by overseas infrastructure (Vercel / GitHub Pages). Anonymous access logs may be processed on servers outside your region to keep the site running.'}
            </p>
          </div>

          {/* 完整隐私条款 — 可折叠展开 */}
          {showPrivacy && (
            <div className="bg-[#1a1a2e] text-white border-[3px] border-[#1a1a2e] rounded-2xl p-4 animate-pop-in">
              <div className="font-black text-sm mb-2">
                📄 {zh ? '完整数据处理说明' : 'Full Data Handling Notice'}
              </div>
              <div className="space-y-2 text-xs font-semibold text-white/85 leading-relaxed">
                <p>
                  {zh
                    ? '为保障服务可用性，托管方（Vercel Inc. 及/或 GitHub Inc.）可能在你访问时记录：来源 IP 地址、浏览器 UA、请求时间。'
                    : 'To ensure service availability, hosts (Vercel Inc. and/or GitHub Inc.) may record upon your visit: origin IP address, browser user agent, request time.'}
                </p>
                <p>
                  {zh
                    ? '这些日志通常保留不超过 30 天，用于反滥用、错误追踪、性能优化。'
                    : 'These logs are typically retained for up to 30 days for anti-abuse, error tracing and performance optimization.'}
                </p>
                <p>
                  {zh
                    ? '游戏答题数据完全保存在你当前浏览器的内存中；刷新或切换设备后将丢失，开发者无法读取。'
                    : 'Game answers are kept only in your browser memory. They are lost after a reload or device switch. Developers have no access to them.'}
                </p>
                <p>
                  {zh
                    ? '本应用无需注册、无需登录、无 Cookie 追踪（除必要基础设施 Cookie 外）。'
                    : 'No sign-up or login required. No tracking cookies — only essential infrastructure cookies.'}
                </p>
                <p>
                  {zh
                    ? '如你有任何顾虑，可随时清理浏览器缓存并关闭网页，所有本地数据将被清除。'
                    : 'If you have any concerns, you can clear your browser cache at any time. All local data will be wiped.'}
                </p>
              </div>
            </div>
          )}

          {/* 展开/收起按钮 */}
          <div className="text-center">
            <button
              onClick={() => onTogglePrivacy(!showPrivacy)}
              className="text-xs font-black text-[#1a1a2e]/70 hover:text-[#1a1a2e] underline underline-offset-4 transition-colors"
            >
              {showPrivacy
                ? (zh ? '▲ 收起完整说明' : '▲ Collapse full notice')
                : (zh ? '▼ 查看完整说明' : '▼ Read full notice')}
            </button>
          </div>

          {/* 同意勾选 */}
          <label
            className="flex items-start gap-3 cursor-pointer select-none bg-gradient-to-r from-amber-50 to-yellow-50 border-[3px] border-[#1a1a2e] rounded-2xl p-3.5 hover:from-amber-100 hover:to-yellow-100 transition-colors"
            onClick={() => onToggleAccept(!accepted)}
          >
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-md border-[3px] border-[#1a1a2e] flex items-center justify-center transition-colors ${
                accepted ? 'bg-emerald-400 text-white' : 'bg-white'
              }`}
            >
              {accepted && <span className="text-base font-black leading-none">✓</span>}
            </span>
            <span className="text-sm font-black text-[#1a1a2e] leading-snug">
              {zh
                ? '我已阅读并同意上述隐私说明，允许本应用在匿名访问日志的范围内使用本网站'
                : 'I have read and agree to the privacy notice. I allow anonymous access logging for this website.'}
            </span>
          </label>
        </div>

        {/* 底部操作区 */}
        <div className="px-5 py-4 bg-gradient-to-b from-white to-yellow-50 border-t-[3px] border-[#1a1a2e] flex flex-col gap-3">
          <button
            disabled={!accepted}
            onClick={() => {
              audioManager.userTapped();
              audioManager.play('click');
              onConfirm();
            }}
            className={`w-full !py-4 !text-lg font-black rounded-2xl border-[3px] border-[#1a1a2e]
                        flex items-center justify-center gap-2
                        transition-all
                        ${accepted
                          ? 'bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 text-white shadow-[4px_4px_0_0_#1a1a2e] hover:-translate-y-[1px] hover:shadow-[5px_5px_0_0_#1a1a2e]'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'}`}
          >
            <span className="text-2xl">🎯</span>
            {accepted
              ? (zh ? '同意并开始挑战 →' : 'Agree & Start Challenge →')
              : (zh ? '请先勾选同意 ↑' : 'Please accept first ↑')}
          </button>

          <div className="text-center text-[10px] font-bold text-[#1a1a2e]/50">
            {zh
              ? 'v1.9.4 · 匿名访问 · 数据不出你浏览器'
              : 'v1.9.4 · Anonymous access · Data stays in your browser'}
          </div>
        </div>
      </div>
    </div>
  );
}
