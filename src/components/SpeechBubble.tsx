import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  speaker: 'leader' | 'fixer';
  ja: string;
  en: string;
  countryFlag?: string;
}

// セリフ表示コンポーネント
export function SpeechBubble({ speaker, ja, en, countryFlag }: Props) {
  const { lang, t } = useLanguage();

  // Primary language first, secondary language second
  const primary = lang === 'ja' ? ja : en;
  const secondary = lang === 'ja' ? en : ja;

  if (speaker === 'leader') {
    return (
      <div className="animate-fade-in">
        <div className="text-xs text-gray-500 mb-1 font-mono">
          {countryFlag} {t('leaderLine')}
        </div>
        <div className="text-gray-400 text-sm leading-relaxed italic">
          "{secondary}"
        </div>
        <div className="text-gray-500 text-xs mt-1">
          {primary}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="text-xs text-accent mb-2 font-mono">
        {t('yourLine')}
      </div>
      <div className="text-white text-lg font-bold leading-relaxed mb-3">
        {lang === 'ja' ? `「${primary}」` : `"${primary}"`}
      </div>
      <div className="text-accent text-sm font-mono leading-relaxed">
        "{secondary}"
      </div>
    </div>
  );
}
