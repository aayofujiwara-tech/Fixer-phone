import { useState, useEffect, useCallback } from 'react';
import type { Country, Scenario } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useCallTimer } from '../hooks/useCallTimer';
import { SpeechBubble } from './SpeechBubble';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  country: Country;
  scenario: Scenario;
  onEnd: (duration: number) => void;
}

// 通話メイン画面
export function CallScreen({ country, scenario, onEnd }: Props) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showLeaderLine, setShowLeaderLine] = useState(false);
  const [showFixerLine, setShowFixerLine] = useState(false);
  const [isThinking, setIsThinking] = useState(true);

  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  const timer = useCallTimer();
  const { lang, t } = useLanguage();

  // タイマーを開始
  useEffect(() => {
    timer.start();
    return () => timer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 現在のセリフペア（leaderとfixer）を取得
  const getCurrentPair = useCallback(() => {
    // pairIndex: 0 = lines[0]+lines[1], 1 = lines[2]+lines[3], etc.
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

  // 新しいセリフペア表示時の演出
  useEffect(() => {
    setShowLeaderLine(false);
    setShowFixerLine(false);
    setIsThinking(true);

    // 相手の「考え中」演出 → セリフ表示
    const thinkTimer = setTimeout(() => {
      setIsThinking(false);
      setShowLeaderLine(true);

      // 相手セリフ表示後、自分のセリフをスライドイン
      const fixerTimer = setTimeout(() => {
        setShowFixerLine(true);
      }, 2000);

      return () => clearTimeout(fixerTimer);
    }, 1500 + Math.random() * 1500);

    return () => clearTimeout(thinkTimer);
  }, [currentLineIndex]);

  // 次のセリフペアへ
  const handleNext = () => {
    stop();
    if (isLastPair) {
      handleEndCall();
    } else {
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  // 前のセリフペアへ
  const handlePrev = () => {
    stop();
    if (currentLineIndex > 0) {
      setCurrentLineIndex((prev) => prev - 1);
    }
  };

  // 通話終了
  const handleEndCall = () => {
    stop();
    timer.stop();
    onEnd(timer.seconds);
  };

  // 日本語読み上げ
  const speakJa = () => {
    if (pair.fixer) {
      speak(pair.fixer.ja, 'ja');
    }
  };

  // 英語読み上げ
  const speakEn = () => {
    if (pair.fixer) {
      speak(pair.fixer.en, 'en');
    }
  };

  const scenarioTitle = lang === 'ja' ? scenario.scenario_title_ja : scenario.scenario_title_en;
  const countryDisplay = lang === 'ja'
    ? `${country.name}${country.leader}`
    : `${country.nameEn} ${country.leaderEn}`;

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
          {showFixerLine && pair.fixer && (
            <SpeechBubble
              speaker="fixer"
              ja={pair.fixer.ja}
              en={pair.fixer.en}
            />
          )}
        </div>
      </div>

      {/* コントロールエリア */}
      <div className="p-4 space-y-3 border-t border-gray-800">
        {/* 読み上げボタン */}
        {showFixerLine && pair.fixer && (
          <div className="flex gap-3 animate-fade-in">
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
        <div className="flex gap-3">
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
