import { useState, useEffect } from 'react';
import type { Country, Mood, CallMode } from '../types';
import { CountrySelector } from './CountrySelector';
import { getApiKey, setApiKey } from '../lib/claude';
import { getScenarioList, hasScenarioPool } from '../lib/scenarioPool';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onStart: (country: Country, mood: Mood, callMode: CallMode, scenarioIndex: number | null) => void;
  jaSpeed: number;
  enSpeed: number;
  onJaSpeedChange: (speed: number) => void;
  onEnSpeedChange: (speed: number) => void;
}

// 設定画面
export function SetupScreen({ onStart, jaSpeed, enSpeed, onJaSpeedChange, onEnSpeedChange }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [mood, setMood] = useState<Mood>('serious');
  const [callMode, setCallMode] = useState<CallMode>('auto');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(null);
  const [apiKey, setApiKeyState] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKeyState(savedKey);
    }
  }, []);

  // mood変更時にシナリオ選択をリセット
  useEffect(() => {
    setSelectedScenarioIndex(null);
  }, [mood]);

  // 国変更時にシナリオ選択をリセット
  useEffect(() => {
    setSelectedScenarioIndex(null);
  }, [selectedCountry]);

  const handleStart = () => {
    if (!selectedCountry) return;

    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
    }

    onStart(selectedCountry, mood, callMode, selectedScenarioIndex);
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

        {/* シナリオ選択（シナリオプールがある国の場合のみ表示） */}
        {selectedCountry && hasScenarioPool(selectedCountry.id) && (
          <section className="animate-fade-in">
            <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">
              {t('scenarioSelectLabel')}
            </h2>
            <div className="flex flex-col gap-2">
              {/* ランダムボタン */}
              <button
                onClick={() => setSelectedScenarioIndex(null)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all text-left ${
                  selectedScenarioIndex === null
                    ? 'bg-accent/20 text-accent border border-accent/50'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}
              >
                🎲 {t('scenarioRandom')}
              </button>

              {/* 各シナリオボタン */}
              {getScenarioList(selectedCountry.id, mood).map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScenarioIndex(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono transition-all text-left ${
                    selectedScenarioIndex === index
                      ? 'bg-accent/20 text-accent border border-accent/50'
                      : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}
                >
                  {`${index + 1}. ${lang === 'ja' ? scenario.title_ja : scenario.title_en}`}
                  <span className="block text-xs opacity-60">
                    {lang === 'ja' ? scenario.title_en : scenario.title_ja}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 通話モード選択 */}
        <section>
          <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">
            {t('callModeLabel')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setCallMode('auto')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-mono text-sm ${
                callMode === 'auto'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              ▶ AUTO
              <div className="text-xs mt-1 opacity-70">
                {lang === 'ja' ? '全自動進行' : 'Full Auto'}
              </div>
            </button>
            <button
              onClick={() => setCallMode('practice')}
              className={`flex-1 p-3 rounded-lg border-2 transition-all font-mono text-sm ${
                callMode === 'practice'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              🎙 PRACTICE
              <div className="text-xs mt-1 opacity-70">
                {lang === 'ja' ? '声に出して練習' : 'Speak Aloud'}
              </div>
            </button>
          </div>
        </section>

        {/* TTS速度調整 */}
        <section>
          <h2 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">
            {t('ttsSpeedLabel')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm">🇯🇵</span>
              <button
                onClick={() => onJaSpeedChange(Math.max(1, jaSpeed - 1))}
                className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30"
                disabled={jaSpeed <= 1}
              >
                ◀
              </button>
              <span className="text-accent text-sm font-mono w-4 text-center">{jaSpeed}</span>
              <button
                onClick={() => onJaSpeedChange(Math.min(7, jaSpeed + 1))}
                className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30"
                disabled={jaSpeed >= 7}
              >
                ▶
              </button>
            </div>

            <span className="text-gray-700 text-xs">|</span>

            <div className="flex items-center gap-1">
              <span className="text-sm">🇺🇸</span>
              <button
                onClick={() => onEnSpeedChange(Math.max(1, enSpeed - 1))}
                className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30"
                disabled={enSpeed <= 1}
              >
                ◀
              </button>
              <span className="text-accent text-sm font-mono w-4 text-center">{enSpeed}</span>
              <button
                onClick={() => onEnSpeedChange(Math.min(7, enSpeed + 1))}
                className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30"
                disabled={enSpeed >= 7}
              >
                ▶
              </button>
            </div>
          </div>
        </section>

        {/* APIキーなしの場合のデモモード表示 */}
        {!apiKey.trim() && !getApiKey() && (
          <div className="text-center animate-fade-in">
            <p className="text-gray-500 text-xs font-mono">
              {lang === 'ja' ? 'デモモードで開始します（事前生成シナリオ）' : 'Starting in demo mode (pre-generated scenarios)'}
            </p>
          </div>
        )}

        {/* APIキー入力（折りたたみ可能） */}
        <section>
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-gray-600 text-xs font-mono hover:text-gray-400 transition-colors flex items-center gap-1"
          >
            <span className="text-[10px]">{showApiKeyInput ? '▼' : '▶'}</span>
            {getApiKey()
              ? t('changeApiKey')
              : lang === 'ja' ? 'API キー設定（上級者向け）' : 'API Key Settings (Advanced)'}
          </button>
          {showApiKeyInput && (
            <div className="mt-3 animate-fade-in">
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
            </div>
          )}
        </section>
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
