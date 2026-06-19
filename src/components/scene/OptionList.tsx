import { useState } from 'react';
import type { Option, OptionLevel } from '../../data/types';
import { levelGradient, levelEmoji, levelLabel } from '../../data/levels';
import { audioManager } from '../../utils/audioManager';
import { useI18n, pickLocalized } from '../../i18n';

interface Props {
  options: Option[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
  renderContent?: (opt: Option) => React.ReactNode;
  renderLevelLabel?: (level: OptionLevel) => React.ReactNode;
}

export default function OptionList({
  options,
  selectedId,
  onSelect,
  disabled,
  renderContent,
  renderLevelLabel,
}: Props) {
  const language = useI18n((s) => s.language);
  return (
    <div className="space-y-3">
      {options.map((opt, idx) => {
        const isSelected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            disabled={disabled}
            onClick={() => {
              audioManager.userTapped();
              audioManager.play('select');
              onSelect(opt.id);
            }}
            className={`relative w-full text-left p-4 rounded-[22px] transition-all duration-200
                        border-[3px] border-[#1a1a2e] overflow-hidden
                        ${isSelected
                          ? 'bg-white shadow-[5px_5px_0_0_#1a1a2e] scale-[1.01] ring-4 ring-yellow-300'
                          : 'bg-white/95 shadow-[3px_3px_0_0_#1a1a2e] hover:shadow-[5px_5px_0_0_#1a1a2e] hover:-translate-y-[1px]'}
                        ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {isSelected && (
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${levelGradient[opt.level]}`}
              />
            )}
            <div className="flex items-start gap-3 relative">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center
                            font-black text-base border-[3px] border-[#1a1a2e]
                            ${isSelected
                              ? 'bg-gradient-to-br from-pink-400 to-orange-400 text-white scale-105'
                              : 'bg-gradient-to-br from-yellow-200 to-yellow-300 text-[#1a1a2e]'}`}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#1a1a2e] text-base font-bold leading-relaxed">
                  {renderContent ? renderContent(opt) : pickLocalized(opt.content, language)}
                </div>
                {isSelected && (
                  <RevealRow level={opt.level} renderLevelLabel={renderLevelLabel} />
                )}
              </div>
              <div className="flex-shrink-0 mt-1.5">
                {isSelected ? (
                  <span className="text-green-500 text-2xl font-black">✓</span>
                ) : (
                  <span className="inline-block w-5 h-5 rounded-full border-[2px] border-[#1a1a2e]/40 bg-white" />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function RevealRow({
  level,
  renderLevelLabel,
}: {
  level: OptionLevel;
  renderLevelLabel?: (level: OptionLevel) => React.ReactNode;
}) {
  const language = useI18n((s) => s.language);
  return (
    <div className="mt-3 inline-flex flex-wrap items-center gap-2 animate-pop-in">
      <span
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl
                    border-[3px] border-[#1a1a2e] shadow-[3px_3px_0_0_#1a1a2e]
                    bg-gradient-to-r ${levelGradient[level]} text-white font-black text-sm`}
      >
        <span className="text-lg animate-bounce" style={{ animationDuration: '1.2s' }}>
          {levelEmoji[level]}
        </span>
        {renderLevelLabel ? renderLevelLabel(level) : pickLocalized(levelLabel[level], language)}
      </span>
    </div>
  );
}
