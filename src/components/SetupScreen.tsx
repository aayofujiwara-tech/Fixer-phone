import { useState, useEffect } from 'react';
import type { Country, Mood } from '../types';
import { CountrySelector } from './CountrySelector';
import { getApiKey, setApiKey } from '../lib/claude';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onStart: (country: Country, mood: Mood) => void;
}

// 設定画面
export function SetupScreen({ onStart }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [mood, setMood] = useState<Mood>('serious');
  const [apiKey, setApiKeyState] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyState(savedKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const handleStart = () => {
    if (!selectedCountry) return;

    // APIキーを保存
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
    }

    if (!apiKey.trim() && !getApiKey()) {
      setShowApiKeyInput(true);
      return;
    }

    onStart(selectedCountry, mood);
  };

  return (
    <div className="min-h-dvh bg-dark flex flex-col">
      {/* ヘッダー */}
      <div className="p-6 text-center relative">
        {/* 言語切替 */}
        <div className="absolute top-4 right-4 flex gap-1">
          <button
            onClick={() => setLang('ja')}
            className={`px-2 py-1 text-xs font-mono rounded transition-all ${
              lang === 'ja'
                ? 'bg-accent/20 text-accent border border-accent/50'
                : 'text-gray-500 border border-gray-700 hover:text-gray-300'
            }`}
          >
            JA
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 text-xs font-mono rounded transition-all ${
              lang === 'en'
                ? 'bg-accent/20 text-accent border border-accent/50'
                : 'text-gray-500 border border-gray-700 hover:text-gray-300'
            }`}
          >
            EN
          </button>
        </div>
        <h1 className="text-2xl font-bold text-accent font-mono tracking-wider">
          FIXER PHONE
        </h1>
        <p className="text-gray-500 text-xs mt-1 font-mono">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        {/* 国選択 */}
        <section>
          <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">
            {t('targetCountry')}
          </h2>
          <CountrySelector
            selected={selectedCountry}
            onSelect={setSelectedCountry}
          />
        </section>

        {/* 選択中の国の情報 */}
        {selectedCountry && (
          <div
            className="p-4 rounded-lg border border-gray-700 animate-fade-in"
            style={{ borderColor: selectedCountry.accentColor + '80' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedCountry.flag}</span>
              <div>
                <div className="text-white font-bold">
                  {lang === 'ja'
                    ? `${selectedCountry.name} ${selectedCountry.leader}`
                    : `${selectedCountry.nameEn} ${selectedCountry.leaderEn}`}
                </div>
                <div className="text-gray-400 text-sm font-mono">
                  {lang === 'ja'
                    ? `${selectedCountry.nameEn} ${selectedCountry.leaderEn}`
                    : `${selectedCountry.name} ${selectedCountry.leader}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* トーン切替 */}
        <section>
          <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">
            {t('operationMode')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setMood('serious')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-mono text-sm ${
                mood === 'serious'
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              {t('serious')}
              <div className="text-xs mt-1 opacity-70">{t('seriousDesc')}</div>
            </button>
            <button
              onClick={() => setMood('comedy')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-mono text-sm ${
                mood === 'comedy'
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              {t('comedy')}
              <div className="text-xs mt-1 opacity-70">{t('comedyDesc')}</div>
            </button>
          </div>
        </section>

        {/* APIキー入力 */}
        {showApiKeyInput && (
          <section className="animate-fade-in">
            <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">
              {t('apiKeyLabel')}
            </h2>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-accent focus:outline-none"
            />
            <p className="text-gray-600 text-xs mt-2 font-mono">
              {t('apiKeyHint')}
            </p>
          </section>
        )}

        {/* APIキー設定済みの場合の切替 */}
        {!showApiKeyInput && getApiKey() && (
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="text-gray-600 text-xs font-mono hover:text-gray-400 transition-colors"
          >
            {t('changeApiKey')}
          </button>
        )}
      </div>

      {/* 通話開始ボタン */}
      <div className="p-4">
        <button
          onClick={handleStart}
          disabled={!selectedCountry}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all font-mono ${
            selectedCountry
              ? 'bg-accent text-dark hover:bg-accent/90 active:scale-[0.98]'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {selectedCountry
            ? `${selectedCountry.flag} ${t('startCall')}`
            : t('selectCountry')}
        </button>
      </div>
    </div>
  );
}
