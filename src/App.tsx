import { useState, useCallback } from 'react';
import type { AppScreen, Country, Mood } from './types';
import { useScenarioGenerator } from './hooks/useScenarioGenerator';
import { useLanguage } from './i18n/LanguageContext';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { CallScreen } from './components/CallScreen';
import { CallEndScreen } from './components/CallEndScreen';

function App() {
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const { scenario, isLoading, error, generate, reset } = useScenarioGenerator();
  const { t } = useLanguage();

  // 通話開始
  const handleStart = useCallback(
    async (country: Country, mood: Mood) => {
      setSelectedCountry(country);
      setScreen('loading');

      try {
        await generate(country, mood);
      } catch {
        // エラー時はSetupScreenに戻る
        setScreen('setup');
      }
    },
    [generate]
  );

  // ローディング完了 → 通話画面へ
  const handleLoadingComplete = useCallback(() => {
    setScreen('call');
  }, []);

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
        <SetupScreen onStart={handleStart} />
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
                <button
                  onClick={handleRestart}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-mono text-sm hover:bg-red-500"
                >
                  {t('reconnect')}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {screen === 'call' && selectedCountry && scenario && (
        <CallScreen
          country={selectedCountry}
          scenario={scenario}
          onEnd={handleCallEnd}
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
