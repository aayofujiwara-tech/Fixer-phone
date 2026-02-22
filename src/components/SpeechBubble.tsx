import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  speaker: 'leader' | 'fixer';
  ja: string;
  en: string;
  countryFlag?: string;
  selectedLang: 'ja' | 'en';
}

// セリフ表示コンポーネント
// selectedLang に応じてメイン（大きい文字）とサブ（小さい文字）を切り替える
export function SpeechBubble({ speaker, ja, en, countryFlag, selectedLang }: Props) {
  const { t } = useLanguage();

  const main = selectedLang === 'ja' ? ja : en;
  const sub = selectedLang === 'ja' ? en : ja;

  if (speaker === 'leader') {
    return (
      <div className="animate-fade-in">
        <div className="text-xs text-gray-500 mb-1 font-mono">
          {countryFlag} {t('leaderLine')}
        </div>
        <div className="text-gray-400 text-sm leading-relaxed italic">
          {main}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          {sub}
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
        {selectedLang === 'ja' ? `「${main}」` : `"${main}"`}
      </div>
      <div className="text-accent text-sm font-mono leading-relaxed">
        "{sub}"
      </div>
    </div>
  );
}
