import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from './translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'fixer-phone-lang';

function getInitialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ja' || saved === 'en') return saved;
  // ブラウザ言語から推定
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ja') ? 'ja' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[key][lang],
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
