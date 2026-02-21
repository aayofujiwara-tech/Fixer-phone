import { useState, useCallback } from 'react';
import type { Country, Mood, Scenario } from '../types';
import { generateScenario } from '../lib/claude';

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
      const message = err instanceof Error ? err.message : '回線が不安定です。再接続してください。';
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
