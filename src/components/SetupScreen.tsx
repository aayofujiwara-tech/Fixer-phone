import { useState, useEffect } from 'react';
import type { Country, Mood, CallMode } from '../types';
import { CountrySelector } from './CountrySelector';
import { getApiKey, setApiKey } from '../lib/claude';
import { getScenarioList, hasScenarioPool } from '../lib/scenarioPool';
import { useLanguage } from '../i18n/LanguageContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { countries } from '../lib/countries';
import { FlagIcon } from './FlagIcon';
import { FEATURES } from '../lib/features';
import { safeGetItem, safeSetItem } from '../lib/storage';
import { LeftDecoration } from './LeftDecoration';
import { RightDecoration } from './RightDecoration';

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

  // スピーカーモード: 'speaker' = スピーカー（大音量 1.0）, 'earpiece' = 小音量（0.3）
  const [speakerMode, setSpeakerMode] = useState<'speaker' | 'earpiece'>(() => {
    const saved = safeGetItem('fixer-phone-speaker-mode');
    return saved === 'earpiece' ? 'earpiece' : 'speaker';
  });

  const toggleSpeakerMode = () => {
    setSpeakerMode(prev => {
      const next = prev === 'speaker' ? 'earpiece' : 'speaker';
      safeSetItem('fixer-phone-speaker-mode', next);
      return next;
    });
  };

  const { lang, setLang, t } = useLanguage();
  const isPC = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!FEATURES.API_MODE) return;
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

    if (FEATURES.API_MODE && apiKey.trim()) {
      setApiKey(apiKey.trim());
    }

    onStart(selectedCountry, mood, callMode, selectedScenarioIndex);
  };

  // ===== PC版: 3カラムレイアウト（左装飾・中央メイン・右装飾） =====
  if (isPC) {
    return (
      <div className="h-dvh bg-dark flex overflow-hidden">
        {/* ----- 左装飾エリア ----- */}
        <div className="flex-1 min-w-0 border-r border-gray-800/50">
          <LeftDecoration />
        </div>

        {/* ----- 中央メインコンテンツ ----- */}
        <div className="w-full max-w-[700px] shrink-0 flex flex-col h-full overflow-hidden">
          {/* ヘッダー */}
          <div className="px-5 py-2 flex items-center justify-between border-b border-gray-800 shrink-0">
            <div>
              <h1 className="text-lg font-bold text-accent font-mono tracking-wider">
                FIXER PHONE
              </h1>
              <p className="text-gray-500 text-[10px] font-mono leading-none">{t('subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* スピーカー / 小音量 切替 */}
              <button
                onClick={toggleSpeakerMode}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-all pc-compact-btn flex items-center gap-1 ${
                  speakerMode === 'speaker'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-300'
                }`}
              >
                <span className="text-sm">{speakerMode === 'speaker' ? '\u{1F50A}' : '\u{1F508}'}</span>
                {speakerMode === 'speaker' ? t('speakerMode') : t('earpieceMode')}
              </button>
              <div className="h-4 w-px bg-gray-700" />
              <div className="flex gap-1">
                <button
                  onClick={() => setLang('ja')}
                  className={`px-2 py-0.5 text-xs font-mono rounded transition-all pc-compact-btn ${
                    lang === 'ja'
                      ? 'bg-accent/20 text-accent border border-accent/50'
                      : 'text-gray-500 border border-gray-700 hover:text-gray-300'
                  }`}
                >
                  JA
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 text-xs font-mono rounded transition-all pc-compact-btn ${
                    lang === 'en'
                      ? 'bg-accent/20 text-accent border border-accent/50'
                      : 'text-gray-500 border border-gray-700 hover:text-gray-300'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* メインコンテンツ（スクロールなし1画面） */}
          <div className="flex-1 min-h-0 flex flex-col justify-center px-4 py-3 gap-2.5 overflow-hidden">
            {/* TARGET COUNTRY: 4列×3段グリッド */}
            <section className="shrink-0">
              <h2 className="text-[10px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">
                {t('targetCountry')}
              </h2>
              <div className="grid grid-cols-4 gap-1.5">
                {countries.map((country) => {
                  const isSelected = selectedCountry?.id === country.id;
                  return (
                    <button
                      key={country.id}
                      onClick={() => setSelectedCountry(country)}
                      aria-label={`${country.name} ${country.leader}`}
                      className={`flex flex-col items-center justify-center gap-0.5 p-1.5 rounded border-2 transition-all duration-200 pc-compact-btn ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-[0_0_10px_rgba(0,255,136,0.12)]'
                          : 'border-gray-700/60 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-800/50'
                      }`}
                    >
                      <FlagIcon countryId={country.id} className="w-7 h-auto rounded-sm" />
                      <span className="text-[0.75rem] font-bold font-mono text-white leading-tight">
                        {country.id.toUpperCase()}
                      </span>
                      <div className="text-center w-full">
                        <div className="text-[0.6rem] text-gray-300 leading-tight truncate">
                          {lang === 'ja' ? country.name : country.nameEn}
                        </div>
                        <div className="text-[0.5rem] text-gray-500 leading-tight truncate">
                          {lang === 'ja' ? country.leader : country.leaderEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Operation Mode */}
            <section className="shrink-0">
              <h2 className="text-[10px] font-mono text-gray-400 mb-1 uppercase tracking-wider">
                {t('operationMode')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMood('serious')}
                  className={`flex-1 p-1.5 rounded-lg border-2 transition-all font-mono text-sm pc-compact-btn ${
                    mood === 'serious'
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  {t('serious')}
                  <div className="text-[10px] mt-0.5 opacity-70">{t('seriousDesc')}</div>
                </button>
                <button
                  onClick={() => setMood('comedy')}
                  className={`flex-1 p-1.5 rounded-lg border-2 transition-all font-mono text-sm pc-compact-btn ${
                    mood === 'comedy'
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  {t('comedy')}
                  <div className="text-[10px] mt-0.5 opacity-70">{t('comedyDesc')}</div>
                </button>
              </div>
            </section>

            {/* Scenario（シナリオプールがある国のみ） */}
            {selectedCountry && hasScenarioPool(selectedCountry.id) && (
              <section className="shrink-0 min-h-0 animate-fade-in">
                <h2 className="text-[10px] font-mono text-gray-400 mb-1 uppercase tracking-wider">
                  {t('scenarioSelectLabel')}
                </h2>
                <div className="flex flex-col gap-[3px]">
                  <button
                    onClick={() => setSelectedScenarioIndex(null)}
                    className={`px-2.5 py-0.5 rounded text-[0.8rem] font-mono transition-all text-left pc-compact-btn ${
                      selectedScenarioIndex === null
                        ? 'bg-accent/20 text-accent border border-accent/50'
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}
                  >
                    🎲 {t('scenarioRandom')}
                  </button>
                  {getScenarioList(selectedCountry.id, mood).map((scenario, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScenarioIndex(index)}
                      className={`px-2.5 py-0.5 rounded text-[0.8rem] font-mono transition-all text-left pc-compact-btn ${
                        selectedScenarioIndex === index
                          ? 'bg-accent/20 text-accent border border-accent/50'
                          : 'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}
                    >
                      {`${index + 1}. ${lang === 'ja' ? scenario.title_ja : scenario.title_en}`}
                      <span className="block text-[0.65rem] opacity-60 leading-tight">
                        {lang === 'ja' ? scenario.title_en : scenario.title_ja}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Call Mode + TTS Speed */}
            <section className="shrink-0">
              <h2 className="text-[10px] font-mono text-gray-400 mb-1 uppercase tracking-wider">
                {t('callModeLabel')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCallMode('auto')}
                  className={`flex-1 p-1.5 rounded-lg border-2 transition-all font-mono text-sm pc-compact-btn ${
                    callMode === 'auto'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  ▶ AUTO
                  <div className="text-[10px] mt-0.5 opacity-70">
                    {lang === 'ja' ? '全自動進行' : 'Full Auto'}
                  </div>
                </button>
                <button
                  onClick={() => setCallMode('practice')}
                  className={`flex-1 p-1.5 rounded-lg border-2 transition-all font-mono text-sm pc-compact-btn ${
                    callMode === 'practice'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >
                  🎙 PRACTICE
                  <div className="text-[10px] mt-0.5 opacity-70">
                    {lang === 'ja' ? '声に出して練習' : 'Speak Aloud'}
                  </div>
                </button>
              </div>
              {/* TTS速度（インライン） */}
              <div className="flex items-center justify-center gap-4 mt-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-xs">🇯🇵</span>
                  <button
                    onClick={() => onJaSpeedChange(Math.max(1, jaSpeed - 1))}
                    className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30 pc-compact-btn"
                    disabled={jaSpeed <= 1}
                  >
                    ◀
                  </button>
                  <span className="text-accent text-xs font-mono w-3 text-center">{jaSpeed}</span>
                  <button
                    onClick={() => onJaSpeedChange(Math.min(7, jaSpeed + 1))}
                    className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30 pc-compact-btn"
                    disabled={jaSpeed >= 7}
                  >
                    ▶
                  </button>
                </div>
                <span className="text-gray-700 text-[10px]">|</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🇺🇸</span>
                  <button
                    onClick={() => onEnSpeedChange(Math.max(1, enSpeed - 1))}
                    className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30 pc-compact-btn"
                    disabled={enSpeed <= 1}
                  >
                    ◀
                  </button>
                  <span className="text-accent text-xs font-mono w-3 text-center">{enSpeed}</span>
                  <button
                    onClick={() => onEnSpeedChange(Math.min(7, enSpeed + 1))}
                    className="text-gray-500 text-xs px-1 hover:text-gray-300 disabled:opacity-30 pc-compact-btn"
                    disabled={enSpeed >= 7}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </section>

            {/* API Key（API_MODE 有効時のみ） */}
            {FEATURES.API_MODE && (
              <section className="shrink-0 animate-fade-in">
                {!apiKey.trim() && !getApiKey() && (
                  <p className="text-gray-500 text-[10px] font-mono mb-1">
                    {lang === 'ja' ? 'デモモードで開始します（事前生成シナリオ）' : 'Starting in demo mode (pre-generated scenarios)'}
                  </p>
                )}
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-gray-600 text-[10px] font-mono hover:text-gray-400 transition-colors flex items-center gap-1 pc-compact-btn"
                >
                  <span className="text-[10px]">{showApiKeyInput ? '▼' : '▶'}</span>
                  {getApiKey()
                    ? t('changeApiKey')
                    : lang === 'ja' ? 'API キー設定（上級者向け）' : 'API Key Settings (Advanced)'}
                </button>
                {showApiKeyInput && (
                  <div className="mt-1 animate-fade-in">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKeyState(e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-xs focus:border-accent focus:outline-none"
                    />
                    <p className="text-gray-600 text-[10px] mt-1 font-mono">
                      {t('apiKeyHint')}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* 通話開始ボタン */}
            <div className="shrink-0 pt-1">
              <button
                onClick={handleStart}
                disabled={!selectedCountry}
                className={`w-full py-2.5 rounded-xl font-bold text-base transition-all font-mono flex items-center justify-center gap-2 pc-compact-btn ${
                  selectedCountry
                    ? 'bg-accent text-dark hover:bg-accent/90 active:scale-[0.98]'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                {selectedCountry && (
                  <FlagIcon countryId={selectedCountry.id} className="w-6 h-auto rounded-sm" />
                )}
                {selectedCountry ? t('startCall') : t('selectCountry')}
              </button>
            </div>
          </div>
        </div>

        {/* ----- 右装飾エリア ----- */}
        <div className="flex-1 min-w-0 border-l border-gray-800/50">
          <RightDecoration />
        </div>
      </div>
    );
  }

  // ===== スマホ版レイアウト（既存・変更なし） =====
  return (
    <div className="min-h-dvh bg-dark flex flex-col">
      {/* ヘッダー */}
      <div className="p-6 text-center relative">
        {/* スピーカー切替 */}
        <div className="absolute top-4 left-4">
          <button
            onClick={toggleSpeakerMode}
            className={`px-2 py-1 text-xs font-mono rounded transition-all flex items-center gap-1 ${
              speakerMode === 'speaker'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <span className="text-sm">{speakerMode === 'speaker' ? '\u{1F50A}' : '\u{1F508}'}</span>
            {speakerMode === 'speaker' ? t('speakerMode') : t('earpieceMode')}
          </button>
        </div>
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

        {/* APIキーなしの場合のデモモード表示（API_MODE 有効時のみ） */}
        {FEATURES.API_MODE && !apiKey.trim() && !getApiKey() && (
          <div className="text-center animate-fade-in">
            <p className="text-gray-500 text-xs font-mono">
              {lang === 'ja' ? 'デモモードで開始します（事前生成シナリオ）' : 'Starting in demo mode (pre-generated scenarios)'}
            </p>
          </div>
        )}

        {/* APIキー入力（API_MODE 有効時のみ表示） */}
        {FEATURES.API_MODE && (
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
