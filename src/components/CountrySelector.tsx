import type { Country } from '../types';
import { countries } from '../lib/countries';

interface Props {
  selected: Country | null;
  onSelect: (country: Country) => void;
}

// 国選択グリッドコンポーネント
export function CountrySelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {countries.map((country) => {
        const isSelected = selected?.id === country.id;
        return (
          <button
            key={country.id}
            onClick={() => onSelect(country)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              isSelected
                ? 'border-accent bg-accent/10'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
            }`}
          >
            <span className="text-2xl">{country.flag}</span>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">
                {country.name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {country.leader}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
