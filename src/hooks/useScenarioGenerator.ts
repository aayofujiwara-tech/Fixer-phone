import { useState, useCallback } from 'react';
import type { Country, Mood, Scenario } from '../types';
import { generateScenario } from '../lib/claude';
import { translations, type Lang } from '../i18n/translations';

function getLang(): Lang {
  const saved = localStorage.getItem('fixer-phone-lang');
  return saved === 'en' ? 'en' : 'ja';
}

// シナリオ生成フック
export function useScenarioGenerator() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (country: Country, mood: Mood) => {
    setIsLoading(true);
    setError(null);
    setScenario(null);

    try {
      const result = await generateScenario(country, mood);
      setScenario(result);
      return result;
    } catch (err) {
      const lang = getLang();
      const message = err instanceof Error ? err.message : translations.connectionError[lang];
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setScenario(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { scenario, isLoading, error, generate, reset };
}
