import { useState, useEffect, useCallback, useRef } from 'react';
import type { Country, Scenario, CallMode } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useCallTimer } from '../hooks/useCallTimer';
import { SpeechBubble } from './SpeechBubble';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  country: Country;
  scenario: Scenario;
  callMode: CallMode;
  onEnd: (duration: number) => void;
  jaSpeed: number;
  enSpeed: number;
  onJaSpeedChange: (speed: number) => void;
  onEnSpeedChange: (speed: number) => void;
}

// 通話メイン画面
export function CallScreen({ country, scenario, callMode, onEnd, jaSpeed, enSpeed, onJaSpeedChange, onEnSpeedChange }: Props) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showLeaderLine, setShowLeaderLine] = useState(false);
  const [showFixerLine, setShowFixerLine] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [selectedLang, setSelectedLang] = useState<'ja' | 'en'>('ja');

  // スピーカーモード: 'speaker' = スピーカー（大音量）, 'earpiece' = 受話器（小音量）
  const [speakerMode, setSpeakerMode] = useState<'speaker' | 'earpiece'>(() => {
    const saved = localStorage.getItem('fixer-phone-speaker-mode');
    return saved === 'earpiece' ? 'earpiece' : 'speaker';
  });

  const { speak, stop, isSpeaking, setVolume } = useSpeechSynthesis();
  const timer = useCallTimer();
  const { lang, t } = useLanguage();

  // スピーカーモード変更時に音量を切り替え
  useEffect(() => {
    setVolume(speakerMode === 'speaker' ? 1.0 : 0.3);
    localStorage.setItem('fixer-phone-speaker-mode', speakerMode);
  }, [speakerMode, setVolume]);

  const SPEED_LEVELS: Record<number, number> = {
    1: 0.7,
    2: 0.85,
    3: 1.0,
    4: 1.2,
    5: 1.5,
    6: 1.6,
    7: 1.7,
  };

  // 自動進行タイマー管理
  const autoTimersRef = useRef<number[]>([]);
  const autoActiveRef = useRef(false);
  // 選択言語・速度の最新値（TTS effect内でstale closureにならないよう）
  const selectedLangRef = useRef(selectedLang);
  selectedLangRef.current = selectedLang;
  const jaSpeedRef = useRef(jaSpeed);
  jaSpeedRef.current = jaSpeed;
  const enSpeedRef = useRef(enSpeed);
  enSpeedRef.current = enSpeed;
  // stale closure回避: 常に最新のhandleEndCall相当を参照
  const handleEndCallRef = useRef<() => void>(() => {});

  // タイマーを開始
  useEffect(() => {
    timer.start();
    return () => timer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 現在のセリフペア（leaderとfixer）を取得
  const getCurrentPair = useCallback(() => {
    const pairIndex = currentLineIndex;
    const leaderIdx = pairIndex * 2;
    const fixerIdx = pairIndex * 2 + 1;
    return {
      leader: scenario.lines[leaderIdx] || null,
      fixer: scenario.lines[fixerIdx] || null,
    };
  }, [currentLineIndex, scenario.lines]);

  const pair = getCurrentPair();
  const totalPairs = Math.floor(scenario.lines.length / 2);
  const isLastPair = currentLineIndex >= totalPairs - 1;

  // 自動タイマー追加（IDをrefに保存）
  const addAutoTimer = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    autoTimersRef.current.push(id);
  };

  // 全自動タイマークリア + TTS停止
  const clearAutoTimers = () => {
    autoActiveRef.current = false;
    autoTimersRef.current.forEach(id => clearTimeout(id));
    autoTimersRef.current = [];
    stop();
  };

  // handleEndCallRefを常に最新に保つ
  handleEndCallRef.current = () => {
    clearAutoTimers();
    timer.stop();
    onEnd(timer.seconds);
  };

  // 新しいセリフペア表示時の演出
  useEffect(() => {
    setShowLeaderLine(false);
    setShowFixerLine(false);
    setIsThinking(true);

    // 相手の「考え中」演出 → セリフ表示
    const thinkTimer = setTimeout(() => {
      setIsThinking(false);
      setShowLeaderLine(true);
    }, 1500 + Math.random() * 1500);

    return () => clearTimeout(thinkTimer);
  }, [currentLineIndex]);

  // リーダーのセリフ表示後: 選択言語のみTTS読み上げ → フィクサーセリフ表示
  // 練習モード・自動進行モード共通
  useEffect(() => {
    if (!showLeaderLine || !pair.leader) return;

    autoActiveRef.current = true;
    const leader = pair.leader;
    const ttsLang = selectedLangRef.current;
    const text = ttsLang === 'ja' ? leader.ja : leader.en;

    const rate = ttsLang === 'ja' ? SPEED_LEVELS[jaSpeedRef.current] : SPEED_LEVELS[enSpeedRef.current];

    // 0.3秒待ってリーダー読み上げ（選択言語のみ）
    addAutoTimer(() => {
      if (!autoActiveRef.current) return;
      speak(text, ttsLang, () => {
        if (!autoActiveRef.current) return;
        // 読み上げ完了 → 0.3秒待ってフィクサーセリフを表示
        addAutoTimer(() => {
          if (!autoActiveRef.current) return;
          setShowFixerLine(true);
        }, 300);
      }, rate);
    }, 300);

    return () => clearAutoTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLeaderLine, pair.leader]);

  // 自動進行（AUTOモード時のみ）: フィクサーセリフ表示後にTTS→次へ
  useEffect(() => {
    if (callMode === 'practice') return; // 練習モードではフィクサーTTSなし
    if (!autoMode || !showFixerLine || !pair.fixer) return;

    autoActiveRef.current = true;
    const fixer = pair.fixer;
    const lastPair = isLastPair;
    const ttsLang = selectedLangRef.current;
    const text = ttsLang === 'ja' ? fixer.ja : fixer.en;

    const rate = ttsLang === 'ja' ? SPEED_LEVELS[jaSpeedRef.current] : SPEED_LEVELS[enSpeedRef.current];

    // 0.2秒待ってから選択言語のみ読み上げ
    addAutoTimer(() => {
      if (!autoActiveRef.current) return;
      speak(text, ttsLang, () => {
        if (!autoActiveRef.current) return;
        // 読み上げ完了 → 0.8秒待って次へ
        addAutoTimer(() => {
          if (!autoActiveRef.current) return;
          if (lastPair) {
            handleEndCallRef.current();
          } else {
            setCurrentLineIndex(prev => prev + 1);
          }
        }, 800);
      }, rate);
    }, 200);

    return () => clearAutoTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMode, callMode, showFixerLine, pair.fixer]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      autoTimersRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // 次のセリフペアへ
  const handleNext = () => {
    clearAutoTimers();
    if (isLastPair) {
      handleEndCallRef.current();
    } else {
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  // 前のセリフペアへ
  const handlePrev = () => {
    clearAutoTimers();
    if (currentLineIndex > 0) {
      setCurrentLineIndex((prev) => prev - 1);
    }
  };

  // 通話終了
  const handleEndCall = () => {
    handleEndCallRef.current();
  };

  // 練習モード: 読み終わって次へ
  const handlePracticeNext = () => {
    clearAutoTimers();
    if (isLastPair) {
      handleEndCallRef.current();
    } else {
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  // 日本語読み上げ（手動）
  const speakJa = () => {
    if (pair.fixer) {
      clearAutoTimers();
      speak(pair.fixer.ja, 'ja', undefined, SPEED_LEVELS[jaSpeed]);
    }
  };

  // 英語読み上げ（手動）
  const speakEn = () => {
    if (pair.fixer) {
      clearAutoTimers();
      speak(pair.fixer.en, 'en', undefined, SPEED_LEVELS[enSpeed]);
    }
  };

  const scenarioTitle = lang === 'ja' ? scenario.scenario_title_ja : scenario.scenario_title_en;
  const countryDisplay = lang === 'ja'
    ? `${country.name}${country.leader}`
    : `${country.nameEn} ${country.leaderEn}`;

  // 自動モード中はボタンの透明度を下げる
  const manualButtonOpacity = callMode === 'auto' && autoMode ? 'opacity-40' : '';

  return (
    <div className="min-h-dvh bg-dark flex flex-col">
      {/* ヘッダー */}
      <div
        className="p-4 border-b border-gray-800"
        style={{
          background: `linear-gradient(135deg, ${country.accentColor}20 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-blink" />
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">
              {t('encryptedCall')}
            </span>
            {callMode === 'practice' && (
              <span className="text-xs font-mono text-accent/70 ml-1">
                {t('practiceModeIndicator')}
              </span>
            )}
          </div>
          <span className="text-accent font-mono text-sm tabular-nums">
            {timer.formatted.split('').map((char, i) =>
              char === ':' ? (
                <span key={i} className="animate-blink-colon">:</span>
              ) : (
                <span key={i}>{char}</span>
              )
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{country.flag}</span>
            <div>
              <div className="text-white text-sm font-bold">
                {countryDisplay}
              </div>
              <div className="text-gray-400 text-xs font-mono">
                「{scenarioTitle}」
              </div>
            </div>
          </div>
          {/* TTS言語切替 + 速度調整 */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedLang('ja')}
                className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                  selectedLang === 'ja'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'bg-gray-800 text-gray-600 border border-gray-700'
                }`}
              >
                🇯🇵
              </button>
              <button
                onClick={() => setSelectedLang('en')}
                className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                  selectedLang === 'en'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                    : 'bg-gray-800 text-gray-600 border border-gray-700'
                }`}
              >
                🇺🇸
              </button>
            </div>
            {/* TTS速度調整 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">🇯🇵</span>
                <button
                  onClick={() => onJaSpeedChange(Math.max(1, jaSpeed - 1))}
                  className="text-gray-500 text-[10px] px-0.5 hover:text-gray-300 disabled:opacity-30"
                  disabled={jaSpeed <= 1}
                >
                  ◀
                </button>
                <span className="text-accent text-[10px] font-mono w-3 text-center">{jaSpeed}</span>
                <button
                  onClick={() => onJaSpeedChange(Math.min(7, jaSpeed + 1))}
                  className="text-gray-500 text-[10px] px-0.5 hover:text-gray-300 disabled:opacity-30"
                  disabled={jaSpeed >= 7}
                >
                  ▶
                </button>
              </div>
              <span className="text-gray-700 text-[10px]">|</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">🇺🇸</span>
                <button
                  onClick={() => onEnSpeedChange(Math.max(1, enSpeed - 1))}
                  className="text-gray-500 text-[10px] px-0.5 hover:text-gray-300 disabled:opacity-30"
                  disabled={enSpeed <= 1}
                >
                  ◀
                </button>
                <span className="text-accent text-[10px] font-mono w-3 text-center">{enSpeed}</span>
                <button
                  onClick={() => onEnSpeedChange(Math.min(7, enSpeed + 1))}
                  className="text-gray-500 text-[10px] px-0.5 hover:text-gray-300 disabled:opacity-30"
                  disabled={enSpeed >= 7}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* セリフエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 相手のセリフ */}
        <div className="min-h-[80px]">
          {isThinking && (
            <div className="animate-fade-in">
              <div className="text-xs text-gray-500 mb-2 font-mono">
                {country.flag} {t('leaderSpeaking')}
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          {showLeaderLine && pair.leader && (
            <SpeechBubble
              speaker="leader"
              ja={pair.leader.ja}
              en={pair.leader.en}
              countryFlag={country.flag}
            />
          )}
        </div>

        {/* 区切り線 */}
        {showFixerLine && (
          <div className="border-t border-gray-800 animate-fade-in" />
        )}

        {/* 自分のセリフ */}
        <div className="min-h-[120px]">
          {showFixerLine && pair.fixer && callMode !== 'practice' && (
            <SpeechBubble
              speaker="fixer"
              ja={pair.fixer.ja}
              en={pair.fixer.en}
            />
          )}

          {/* 練習モード: フィクサーセリフ（言語切替付き） */}
          {showFixerLine && pair.fixer && callMode === 'practice' && (
            <div className="animate-fade-in">
              <div className="text-xs text-accent/60 mb-2 font-mono font-bold uppercase tracking-wider">
                {t('yourLine')}
              </div>

              {/* メインの言語（大きく表示） */}
              <div className="text-white text-base leading-relaxed mb-2">
                {selectedLang === 'ja' ? pair.fixer.ja : pair.fixer.en}
              </div>

              {/* サブの言語（小さく薄く表示 = カンニング用） */}
              <div className="text-gray-500 text-xs leading-relaxed">
                {selectedLang === 'ja' ? pair.fixer.en : pair.fixer.ja}
              </div>

              {/* 「読めた！次へ」ボタン */}
              <button
                onClick={handlePracticeNext}
                className="mt-4 w-full py-3 rounded-xl bg-accent/20 text-accent border border-accent/50 font-mono text-sm hover:bg-accent/30 transition-all active:scale-[0.98]"
              >
                {t('practiceNext')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* コントロールエリア */}
      <div className="p-4 space-y-3 border-t border-gray-800">
        {/* スピーカー切替 + 自動/手動切替 */}
        <div className="flex items-center justify-between">
          {/* スピーカー / 受話器 切替 */}
          <button
            onClick={() => setSpeakerMode(prev => prev === 'speaker' ? 'earpiece' : 'speaker')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              speakerMode === 'speaker'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <span className="text-sm">{speakerMode === 'speaker' ? '\u{1F50A}' : '\u{1F4F1}'}</span>
            {speakerMode === 'speaker' ? t('speakerMode') : t('earpieceMode')}
          </button>

          {/* 自動/手動切替（AUTOモードの時のみ） */}
          {callMode === 'auto' && (
            <button
              onClick={() => {
                if (autoMode) clearAutoTimers();
                setAutoMode(!autoMode);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                autoMode
                  ? 'bg-accent/20 text-accent border border-accent/50'
                  : 'bg-gray-800 text-gray-500 border border-gray-700'
              }`}
            >
              {autoMode ? 'AUTO' : 'MANUAL'}
            </button>
          )}
        </div>

        {/* 読み上げボタン（AUTOモードの時のみ表示） */}
        {callMode === 'auto' && showFixerLine && pair.fixer && (
          <div className={`flex gap-3 animate-fade-in ${manualButtonOpacity}`}>
            <button
              onClick={speakJa}
              disabled={isSpeaking}
              className={`flex-1 py-3 rounded-lg border font-mono text-sm transition-all ${
                isSpeaking
                  ? 'border-accent/50 text-accent/50 animate-pulse-border'
                  : 'border-gray-600 text-gray-300 hover:border-accent hover:text-accent active:scale-[0.97]'
              }`}
            >
              {t('speakJa')}
            </button>
            <button
              onClick={speakEn}
              disabled={isSpeaking}
              className={`flex-1 py-3 rounded-lg border font-mono text-sm transition-all ${
                isSpeaking
                  ? 'border-accent/50 text-accent/50 animate-pulse-border'
                  : 'border-gray-600 text-gray-300 hover:border-accent hover:text-accent active:scale-[0.97]'
              }`}
            >
              {t('speakEn')}
            </button>
          </div>
        )}

        {/* ナビゲーション */}
        <div className={`flex gap-3 ${manualButtonOpacity}`}>
          <button
            onClick={handlePrev}
            disabled={currentLineIndex === 0}
            className={`flex-1 py-3 rounded-lg font-mono text-sm transition-all ${
              currentLineIndex === 0
                ? 'bg-gray-900 text-gray-700 cursor-not-allowed'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-[0.97]'
            }`}
          >
            {t('prev')}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 font-mono text-sm transition-all active:scale-[0.97]"
          >
            {isLastPair ? t('endCallNext') : t('next')}
          </button>
        </div>

        {/* 通話終了ボタン */}
        <button
          onClick={handleEndCall}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono transition-all active:scale-[0.98]"
        >
          {t('endCall')}
        </button>

        {/* セリフ進行表示 */}
        <div className="text-center text-gray-600 text-xs font-mono">
          {currentLineIndex + 1} / {totalPairs}
        </div>
      </div>
    </div>
  );
}
