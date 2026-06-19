import type { Character } from '../../data/types';
import { useI18n, pickLocalized } from '../../i18n';

interface Props {
  character: Character;
  dialog: string;
  badge?: string;
}

export default function BubbleDialog({ character, dialog, badge }: Props) {
  const { language } = useI18n();
  return (
    <div className="relative bg-white rounded-[24px] border-[3px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e] p-5 overflow-visible">
      {badge && (
        <div className="absolute -top-3 -left-3 bg-yellow-300 text-[#1a1a2e] font-black text-xs rounded-2xl px-3 py-1.5 border-[3px] border-[#1a1a2e] shadow-[2px_2px_0_0_#1a1a2e] rotate-[-8deg] animate-wiggle">
          {badge}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3 mt-1">
        <div className="relative flex-shrink-0">
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400
                       flex items-center justify-center text-3xl
                       border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e] animate-wiggle"
          >
            {character.emoji}
          </div>
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-green-400 rounded-full border-[2px] border-white animate-ping opacity-75" />
          </div>
        </div>
        <div>
          <div className="text-[#1a1a2e] font-black text-base leading-tight">{pickLocalized(character.name, language)}</div>
          {character.description && (
            <div className="text-[#1a1a2e]/60 text-xs font-semibold">{pickLocalized(character.description, language)}</div>
          )}
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-[2px] border-[#1a1a2e] rounded-2xl p-4">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-yellow-50 border-t-[2px] border-l-[2px] border-[#1a1a2e] rotate-45" />
        <p className="text-[#1a1a2e] text-base font-bold leading-relaxed">
          「{dialog}」
        </p>
      </div>
    </div>
  );
}
