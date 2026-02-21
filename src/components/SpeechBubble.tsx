interface Props {
  speaker: 'leader' | 'fixer';
  ja: string;
  en: string;
  countryFlag?: string;
}

// セリフ表示コンポーネント
export function SpeechBubble({ speaker, ja, en, countryFlag }: Props) {
  if (speaker === 'leader') {
    return (
      <div className="animate-fade-in">
        <div className="text-xs text-gray-500 mb-1 font-mono">
          {countryFlag} 相手のセリフ:
        </div>
        <div className="text-gray-400 text-sm leading-relaxed italic">
          "{en}"
        </div>
        <div className="text-gray-500 text-xs mt-1">
          {ja}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="text-xs text-accent mb-2 font-mono">
        YOUR LINE:
      </div>
      <div className="text-white text-lg font-bold leading-relaxed mb-3">
        「{ja}」
      </div>
      <div className="text-accent text-sm font-mono leading-relaxed">
        "{en}"
      </div>
    </div>
  );
}
