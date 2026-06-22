import { useState } from 'react';
import { audioManager } from '../../utils/audioManager';
import { useI18n, pickLocalized } from '../../i18n';

interface Philosopher {
  id: string;
  emoji: string;
  name: { zh: string; en: string };
  era: { zh: string; en: string };
  school: { zh: string; en: string };
  gradient: string;
  coreThought: { zh: string; en: string };
  modernApplication: { zh: string; en: string };
  stressRelief: { zh: string; en: string };
  quote: { zh: string; en: string };
}

const PHILOSOPHERS: Philosopher[] = [
  {
    id: 'socrates',
    emoji: '🏛️',
    name: { zh: '苏格拉底', en: 'Socrates' },
    era: { zh: '公元前 470-399 年', en: '470-399 BC' },
    school: { zh: '古希腊哲学', en: 'Ancient Greek' },
    gradient: 'from-amber-300 to-orange-400',
    coreThought: {
      zh: '"认识你自己。"真正的智慧在于承认自己的无知。通过不断提问（苏格拉底诘问法），揭示假设的漏洞，逼近真理。',
      en: '"Know thyself." True wisdom is recognizing your own ignorance. Through relentless questioning (Socratic method), expose flawed assumptions and approach truth.',
    },
    modernApplication: {
      zh: '面对压力时，问自己："我焦虑的这件事，我的判断有依据吗？""最坏情况真的会发生吗？""我能控制的是什么？"用提问代替反刍。',
      en: 'When stressed, ask: "Is my judgment based on evidence?" "Will the worst case really happen?" "What can I control?" Question instead of ruminate.',
    },
    stressRelief: {
      zh: '练习"苏格拉底三问"：1) 这个想法有证据吗？2) 有没有其他解释？3. 即使最坏发生，我能应对吗？三个问题问完，焦虑通常减半。',
      en: 'Practice "Socratic 3 Questions": 1) Evidence for this thought? 2) Alternative explanations? 3) If worst happens, can I cope? Anxiety usually halves.',
    },
    quote: { zh: '未经审视的人生不值得过。', en: 'The unexamined life is not worth living.' },
  },
  {
    id: 'aristotle',
    emoji: '⚖️',
    name: { zh: '亚里士多德', en: 'Aristotle' },
    era: { zh: '公元前 384-322 年', en: '384-322 BC' },
    school: { zh: '古希腊哲学', en: 'Ancient Greek' },
    gradient: 'from-sky-300 to-blue-400',
    coreThought: {
      zh: '"中庸之道"（Golden Mean）。美德是两个极端之间的平衡：勇气在怯懦与鲁莽之间，慷慨在吝啬与挥霍之间。幸福来自德性的实践。',
      en: '"Golden Mean." Virtue is balance between extremes: courage between cowardice and recklessness, generosity between miserliness and prodigality. Happiness comes from practicing virtue.',
    },
    modernApplication: {
      zh: '工作与生活不是非此即彼。寻找你的"中庸"：既不全情投入导致耗竭，也不躺平导致空虚。适度，是可持续的关键。',
      en: 'Work and life aren\'t either-or. Find your "mean": neither all-in burnout nor flat-laying emptiness. Moderation is the key to sustainability.',
    },
    stressRelief: {
      zh: '当感到失衡时，问："我现在过度了还是不足？"然后向中间靠拢一步。不追求完美平衡，追求动态调节。',
      en: 'When feeling off-balance, ask: "Am I overdoing or underdoing?" Then step toward the middle. Pursue dynamic adjustment, not perfect balance.',
    },
    quote: { zh: '幸福是灵魂合于德性的活动。', en: 'Happiness is activity of the soul in accordance with virtue.' },
  },
  {
    id: 'nietzsche',
    emoji: '⚡',
    name: { zh: '尼采', en: 'Nietzsche' },
    era: { zh: '1844-1900 年', en: '1844-1900' },
    school: { zh: '存在主义', en: 'Existentialism' },
    gradient: 'from-rose-400 to-red-500',
    coreThought: {
      zh: '" amor fati"（热爱命运）。不要逃避痛苦，而要拥抱它。"杀不死我的，使我更强大。"超人不是没有痛苦，而是能赋予痛苦意义。',
      en: '"Amor fati" (love of fate). Don\'t escape suffering, embrace it. "What doesn\'t kill me makes me stronger." The Übermensch doesn\'t lack pain but gives it meaning.',
    },
    modernApplication: {
      zh: '职场压力不是敌人，是锻造你的熔炉。把"为什么是我"换成"这要教会我什么"。每一次抗压，都在塑造更强的你。',
      en: 'Workplace stress isn\'t the enemy; it\'s your forge. Replace "why me" with "what does this teach me?" Every resistance shapes a stronger you.',
    },
    stressRelief: {
      zh: '写下当前最大的压力源，然后写："如果我能穿越这个困难，我会获得什么能力/智慧？"把压力重新定义为成长的机会。',
      en: 'Write your biggest stressor, then: "If I overcome this, what ability/wisdom will I gain?" Reframe stress as growth opportunity.',
    },
    quote: { zh: '凡杀不死我的，必使我更强大。', en: 'What does not kill me makes me stronger.' },
  },
  {
    id: 'zhuangzi',
    emoji: '🐟',
    name: { zh: '庄子', en: 'Zhuangzi' },
    era: { zh: '约公元前 369-286 年', en: '~369-286 BC' },
    school: { zh: '道家', en: 'Daoism' },
    gradient: 'from-emerald-300 to-teal-400',
    coreThought: {
      zh: '"逍遥游"。万物齐一，是非、得失、生死都是相对的。"井蛙不可以语于海者，拘于虚也。"放下执念，顺应自然，获得精神自由。',
      en: '"Free and Easy Wandering." All things are equal; right/wrong, gain/loss, life/death are relative. "A well-frog cannot discuss the sea." Let go of attachments, follow nature, gain spiritual freedom.',
    },
    modernApplication: {
      zh: '同事的评价、KPI 的起伏、社交的尴尬——放在宇宙尺度，都是井底之蛙的烦恼。跳出"井"，用更大的视角看，焦虑自然消散。',
      en: 'Colleague opinions, KPI fluctuations, social awkwardness — at cosmic scale, they\'re well-frog worries. Jump out of the "well", view from larger perspective, anxiety dissolves.',
    },
    stressRelief: {
      zh: '焦虑时想象自己变成一只蝴蝶（庄周梦蝶）：这个让你焦虑的"你"，是不是也是一场梦？10 年后你还会记得这件事吗？',
      en: 'When anxious, imagine becoming a butterfly (Zhuangzi\'s dream): is this anxious "you" also a dream? Will you remember this in 10 years?',
    },
    quote: { zh: '井蛙不可以语于海者，拘于虚也。', en: 'You cannot discuss the ocean with a well-frog — it is limited by its space.' },
  },
  {
    id: 'wang-yangming',
    emoji: '🌸',
    name: { zh: '王阳明', en: 'Wang Yangming' },
    era: { zh: '1472-1529 年', en: '1472-1529' },
    school: { zh: '心学', en: 'School of Mind' },
    gradient: 'from-pink-300 to-rose-400',
    coreThought: {
      zh: '"知行合一"。"心即理"——真理不在外物，而在本心。"致良知"——每个人内心都有判断善恶的直觉能力。知而不行，只是未知。',
      en: '"Unity of Knowledge and Action." "Mind is Principle" — truth isn\'t in external objects but in the heart. "Extend Innate Knowledge" — everyone has intuitive moral judgment. Knowing without acting is not truly knowing.',
    },
    modernApplication: {
      zh: '你知道该运动、该早睡、该拒绝不合理要求——但做不到。王阳明说：做不到=不知道。真正的"知"必然带来"行"。从一件小事开始"行"。',
      en: 'You know you should exercise, sleep early, refuse unreasonable demands — but don\'t. Wang says: not doing = not knowing. True "knowing" necessarily produces "action". Start with one small action.',
    },
    stressRelief: {
      zh: '焦虑常来自"知行脱节"——知道该放下却放不下。解法不是想更多，而是做一件具体的事。行动本身就能消解焦虑。',
      en: 'Anxiety often comes from "knowledge-action gap" — knowing to let go but can\'t. The solution isn\'t more thinking but one concrete action. Action itself dissolves anxiety.',
    },
    quote: { zh: '知是行的主意，行是知的功夫。', en: 'Knowledge is the direction of action; action is the effort of knowledge.' },
  },
];

export default function PhilosophyInsight() {
  const language = useI18n((s) => s.language);
  const zh = language === 'zh';
  const [expandedId, setExpandedId] = useState<string | null>(PHILOSOPHERS[0].id);

  const handleExpand = (id: string) => {
    audioManager.userTapped();
    audioManager.play('click');
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* 顶部介绍卡片 */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl border-[3px] border-[#1a1a2e] shadow-[4px_4px_0_0_#1a1a2e] p-5 text-white animate-pop-in">
        <div className="text-center mb-2">
          <div className="text-4xl mb-2 animate-float-gentle" aria-hidden="true">🧠</div>
          <div className="text-base font-black mb-1">
            {zh ? '哲学思辨 · 现代人的解药' : 'Philosophy · Modern Antidote'}
          </div>
          <div className="text-[11px] font-bold opacity-90 leading-relaxed">
            {zh
              ? '5 位东西方哲学家，5 种应对压力的智慧框架\n不是逃避，而是用更高的视角理解生活'
              : '5 Eastern & Western philosophers, 5 wisdom frameworks\nNot escape, but understanding life from a higher perspective'}
          </div>
        </div>
      </div>

      {/* 哲学家列表 */}
      <div className="space-y-3">
        {PHILOSOPHERS.map((p, idx) => {
          const isExpanded = expandedId === p.id;
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] overflow-hidden animate-pop-in"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {/* 卡片头部 */}
              <button
                onClick={() => handleExpand(p.id)}
                className={`w-full text-left p-4 bg-gradient-to-r ${p.gradient} text-[#1a1a2e]`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/80 border-[3px] border-[#1a1a2e] flex items-center justify-center text-2xl">
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-black">{pickLocalized(p.name, language)}</div>
                    <div className="text-[10px] font-bold opacity-80">
                      {pickLocalized(p.era, language)} · {pickLocalized(p.school, language)}
                    </div>
                  </div>
                  <span className={`text-[#1a1a2e]/60 text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </div>
              </button>

              {/* 展开内容 */}
              {isExpanded && (
                <div className="p-4 space-y-3 animate-pop-in">
                  {/* 名言 */}
                  <div className="bg-amber-50 rounded-xl p-3 border-l-[4px] border-amber-400">
                    <div className="text-[12px] font-black text-[#1a1a2e] italic leading-relaxed">
                      "{pickLocalized(p.quote, language)}"
                    </div>
                    <div className="text-[10px] font-bold text-[#1a1a2e]/50 mt-1">
                      — {pickLocalized(p.name, language)}
                    </div>
                  </div>

                  {/* 核心思想 */}
                  <div>
                    <div className="text-[11px] font-black text-violet-700 mb-1.5">
                      📚 {zh ? '核心思想' : 'Core Thought'}
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed">
                      {pickLocalized(p.coreThought, language)}
                    </div>
                  </div>

                  {/* 现代应用 */}
                  <div>
                    <div className="text-[11px] font-black text-sky-700 mb-1.5">
                      🔧 {zh ? '现代应用' : 'Modern Application'}
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed">
                      {pickLocalized(p.modernApplication, language)}
                    </div>
                  </div>

                  {/* 缓解压力方法 */}
                  <div className="bg-emerald-50 rounded-xl p-3 border-[2px] border-emerald-200">
                    <div className="text-[11px] font-black text-emerald-700 mb-1.5">
                      💆 {zh ? '缓解压力练习' : 'Stress Relief Practice'}
                    </div>
                    <div className="text-[11px] font-bold text-[#1a1a2e]/80 leading-relaxed">
                      {pickLocalized(p.stressRelief, language)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部总结 */}
      <div className="bg-white/60 rounded-2xl border-[2px] border-dashed border-[#1a1a2e]/20 p-4 text-center animate-pop-in">
        <div className="text-[11px] font-bold text-[#1a1a2e]/60 leading-relaxed">
          {zh
            ? '✨ 哲学不是象牙塔的学问，而是生活的工具。\n选择一位哲学家的智慧，本周试着实践一次。'
            : '✨ Philosophy isn\'t ivory tower learning, but a life tool.\nPick one philosopher\'s wisdom, practice it this week.'}
        </div>
      </div>
    </div>
  );
}
