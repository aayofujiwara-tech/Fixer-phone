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
}

// 通話メイン画面
export function CallScreen({ country, scenario, callMode, onEnd }: Props) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showLeaderLine, setShowLeaderLine] = useState(false);
  const [showFixerLine, setShowFixerLine] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [practiceLang, setPracticeLang] = useState<'ja' | 'en'>('ja');

  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  const timer = useCallTimer();
  const { lang, t } = useLanguage();

  // 自動進行タイマー管理
  const autoTimersRef = useRef<number[]>([]);
  const autoActiveRef = useRef(false);
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

  // リーダーのセリフ表示後: 日英TTS自動読み上げ → フィクサーセリフ表示
  // 練習モード・自動進行モード共通
  useEffect(() => {
    if (!showLeaderLine || !pair.leader) return;

    autoActiveRef.current = true;
    const leader = pair.leader;

    // 0.5秒待ってリーダー日本語読み上げ
    addAutoTimer(() => {
      if (!autoActiveRef.current) return;
      speak(leader.ja, 'ja', () => {
        if (!autoActiveRef.current) return;
        // 日本語完了 → 0.5秒待って英語読み上げ
        addAutoTimer(() => {
          if (!autoActiveRef.current) return;
          speak(leader.en, 'en', () => {
            if (!autoActiveRef.current) return;
            // 英語完了 → 0.5秒待ってフィクサーセリフを表示
            addAutoTimer(() => {
              if (!autoActiveRef.current) return;
              setShowFixerLine(true);
            }, 500);
          });
        }, 500);
      });
    }, 500);

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

    // 0.5秒待ってから日本語読み上げ
    addAutoTimer(() => {
      if (!autoActiveRef.current) return;
      speak(fixer.ja, 'ja', () => {
        if (!autoActiveRef.current) return;
        // 日本語完了 → 1秒待って英語読み上げ
        addAutoTimer(() => {
          if (!autoActiveRef.current) return;
          speak(fixer.en, 'en', () => {
            if (!autoActiveRef.current) return;
            // 英語完了 → 2秒待って次へ
            addAutoTimer(() => {
              if (!autoActiveRef.current) return;
              if (lastPair) {
                handleEndCallRef.current();
              } else {
                setCurrentLineIndex(prev => prev + 1);
              }
            }, 2000);
          });
        }, 1000);
      });
    }, 500);

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
      speak(pair.fixer.ja, 'ja');
    }
  };

  // 英語読み上げ（手動）
  const speakEn = () => {
    if (pair.fixer) {
      clearAutoTimers();
      speak(pair.fixer.en, 'en');
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

              {/* 言語切替トグル */}
              <div className="flex justify-center gap-2 mb-3">
                <button
                  onClick={() => setPracticeLang('ja')}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    practiceLang === 'ja'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-gray-800 text-gray-600 border border-gray-700'
                  }`}
                >
                  🇯🇵 日本語
                </button>
                <button
                  onClick={() => setPracticeLang('en')}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    practiceLang === 'en'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-gray-800 text-gray-600 border border-gray-700'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>

              {/* メインの言語（大きく表示） */}
              <div className="text-white text-base leading-relaxed mb-2">
                {practiceLang === 'ja' ? pair.fixer.ja : pair.fixer.en}
              </div>

              {/* サブの言語（小さく薄く表示 = カンニング用） */}
              <div className="text-gray-500 text-xs leading-relaxed">
                {practiceLang === 'ja' ? pair.fixer.en : pair.fixer.ja}
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
        {/* 自動/手動切替（AUTOモードの時のみ表示） */}
        {callMode === 'auto' && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-mono">
              {autoMode ? t('autoModeOn') : t('autoModeOff')}
            </span>
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
          </div>
        )}

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
