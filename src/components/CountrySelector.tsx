import type { Country } from '../types';
import { countries } from '../lib/countries';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  selected: Country | null;
  onSelect: (country: Country) => void;
}

// 国選択グリッドコンポーネント
export function CountrySelector({ selected, onSelect }: Props) {
  const { lang } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-2">
      {countries.map((country) => {
        const isSelected = selected?.id === country.id;
        return (
          <button
            key={country.id}
            onClick={() => onSelect(country)}
            aria-label={`${country.name} ${country.leader}`}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 transition-all duration-200 ${
              isSelected
                ? 'border-accent bg-accent/10'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
            }`}
          >
            <span className="text-2xl">{country.flag}</span>
            <div className="text-center min-w-0 w-full">
              <div className="text-xs font-bold text-white truncate">
                {lang === 'ja' ? country.name : country.nameEn}
              </div>
              <div className="text-[10px] text-gray-400 truncate">
                {lang === 'ja' ? country.leader : country.leaderEn}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
