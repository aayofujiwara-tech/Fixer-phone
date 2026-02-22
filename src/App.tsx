import { useState, useCallback } from 'react';
import type { AppScreen, Country, Mood, CallMode } from './types';
import { useScenarioGenerator } from './hooks/useScenarioGenerator';
import { useLanguage } from './i18n/LanguageContext';
import { fallbackScenario } from './lib/scenarios';
import { getScenario } from './lib/scenarioPool';
import { getApiKey } from './lib/claude';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { CallScreen } from './components/CallScreen';
import { CallEndScreen } from './components/CallEndScreen';

function App() {
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callMode, setCallMode] = useState<CallMode>('auto');
  const [jaSpeed, setJaSpeed] = useState(5);
  const [enSpeed, setEnSpeed] = useState(3);

  const { scenario, isLoading, error, generate, reset, setFallback } = useScenarioGenerator();
  const { t } = useLanguage();

  // 通話開始
  const handleStart = useCallback(
    async (country: Country, mood: Mood, mode: CallMode = 'auto', scenarioIndex: number | null = null) => {
      setSelectedCountry(country);
      setCallMode(mode);
      setScreen('loading');

      const apiKey = getApiKey();

      if (apiKey && scenarioIndex === null) {
        try {
          await generate(country, mood);
        } catch {
          // エラー時はloading画面に留まり、エラーを表示する
        }
      } else {
        const poolScenario = getScenario(country.id, mood, scenarioIndex);
        if (poolScenario) {
          setFallback(poolScenario);
        } else {
          setFallback(fallbackScenario);
        }
      }
    },
    [generate, setFallback]
  );

  // ローディング完了 → 通話画面へ
  const handleLoadingComplete = useCallback(() => {
    setScreen('call');
  }, []);

  // フォールバックシナリオで通話開始（選択国のプールを優先）
  const handleUseFallback = useCallback(() => {
    if (selectedCountry) {
      const poolScenario = getScenario(selectedCountry.id, 'serious');
      if (poolScenario) {
        setFallback(poolScenario);
        return;
      }
    }
    setFallback(fallbackScenario);
  }, [setFallback, selectedCountry]);

  // 通話終了
  const handleCallEnd = useCallback((duration: number) => {
    setCallDuration(duration);
    setScreen('callEnd');
  }, []);

  // 新しい通話を開始（リセット）
  const handleRestart = useCallback(() => {
    reset();
    setSelectedCountry(null);
    setCallDuration(0);
    setScreen('setup');
  }, [reset]);

  return (
    <div className="max-w-[480px] mx-auto">
      {screen === 'setup' && (
        <SetupScreen
          onStart={handleStart}
          jaSpeed={jaSpeed}
          enSpeed={enSpeed}
          onJaSpeedChange={setJaSpeed}
          onEnSpeedChange={setEnSpeed}
        />
      )}

      {screen === 'loading' && (
        <>
          <LoadingScreen
            isReady={!isLoading && scenario !== null}
            onComplete={handleLoadingComplete}
          />
          {/* エラー表示 */}
          {error && (
            <div className="fixed bottom-4 left-4 right-4 max-w-[480px] mx-auto">
              <div className="bg-red-900/90 border border-red-500 rounded-lg p-4 text-center">
                <div className="text-red-300 text-sm font-mono mb-2">
                  {t('connectionUnstable')}
                </div>
                <div className="text-red-400/70 text-xs font-mono mb-3">
                  {error}
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-mono text-sm hover:bg-gray-600"
                  >
                    {t('reconnect')}
                  </button>
                  <button
                    onClick={handleUseFallback}
                    className="px-4 py-2 bg-accent text-dark rounded-lg font-mono text-sm font-bold hover:bg-accent/90"
                  >
                    {t('useFallback')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {screen === 'call' && selectedCountry && scenario && (
        <CallScreen
          country={selectedCountry}
          scenario={scenario}
          callMode={callMode}
          onEnd={handleCallEnd}
          jaSpeed={jaSpeed}
          enSpeed={enSpeed}
          onJaSpeedChange={setJaSpeed}
          onEnSpeedChange={setEnSpeed}
        />
      )}

      {screen === 'callEnd' && scenario && (
        <CallEndScreen
          scenario={scenario}
          duration={callDuration}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
