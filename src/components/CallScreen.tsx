import { useState, useEffect, useCallback, useRef } from 'react';
import type { Country, Scenario, CallMode, Mood, ScenarioLine } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useCallTimer } from '../hooks/useCallTimer';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SpeechBubble } from './SpeechBubble';
import { TypewriterText } from './TypewriterText';
import { ConnectionLine } from './ConnectionLine';
import { AvatarSilhouette } from './AvatarSilhouette';
import { FlagIcon } from './FlagIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { safeGetItem, safeSetItem } from '../lib/storage';

interface Props {
  country: Country;
  scenario: Scenario;
  callMode: CallMode;
  mood: Mood;
  onEnd: (duration: number) => void;
  jaSpeed: number;
  enSpeed: number;
  onJaSpeedChange: (speed: number) => void;
  onEnSpeedChange: (speed: number) => void;
}

// 通話メイン画面
export function CallScreen({ country, scenario, callMode, mood, onEnd, jaSpeed, enSpeed, onJaSpeedChange, onEnSpeedChange }: Props) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showLeaderLine, setShowLeaderLine] = useState(false);
  const [showFixerLine, setShowFixerLine] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const { lang, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'ja' | 'en'>(lang);

  // スピーカーモード: 'speaker' = スピーカー（大音量）, 'earpiece' = 受話器（小音量）
  const [speakerMode, setSpeakerMode] = useState<'speaker' | 'earpiece'>(() => {
    const saved = safeGetItem('fixer-phone-speaker-mode');
    return saved === 'earpiece' ? 'earpiece' : 'speaker';
  });

  const { speak, stop, isSpeaking, setVolume } = useSpeechSynthesis();
  const timer = useCallTimer();

  // PC判定（768px以上）
  const isPC = useMediaQuery('(min-width: 768px)');

  // PC用: 前回のセリフを保持（非アクティブパネルで薄く表示）
  const prevLeaderRef = useRef<ScenarioLine | null>(null);
  const prevFixerRef = useRef<ScenarioLine | null>(null);

  // スピーカーモード変更時に音量を切り替え
  useEffect(() => {
    setVolume(speakerMode === 'speaker' ? 1.0 : 0.3);
    safeSetItem('fixer-phone-speaker-mode', speakerMode);
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

    // 短い間（150ms）でセリフ表示（事前定義データなので長い待ちは不要）
    const thinkTimer = setTimeout(() => {
      setIsThinking(false);
      setShowLeaderLine(true);
    }, 150);

    return () => clearTimeout(thinkTimer);
  }, [currentLineIndex]);

  // PC用: 表示されたセリフを記録（非アクティブ時のゴースト表示用）
  useEffect(() => {
    if (showLeaderLine && pair.leader) {
      prevLeaderRef.current = pair.leader;
    }
  }, [showLeaderLine, pair.leader]);

  useEffect(() => {
    if (showFixerLine && pair.fixer) {
      prevFixerRef.current = pair.fixer;
    }
  }, [showFixerLine, pair.fixer]);

  // リーダーのセリフ表示後: 選択言語のみTTS読み上げ → フィクサーセリフ表示
  // 練習モード・自動進行モード共通
  useEffect(() => {
    if (!showLeaderLine || !pair.leader) return;

    autoActiveRef.current = true;
    const leader = pair.leader;
    const ttsLang = selectedLangRef.current;
    const text = ttsLang === 'ja' ? leader.ja : leader.en;

    const rate = ttsLang === 'ja' ? SPEED_LEVELS[jaSpeedRef.current] : SPEED_LEVELS[enSpeedRef.current];

    // 0.1秒待ってリーダー読み上げ（選択言語のみ）
    addAutoTimer(() => {
      if (!autoActiveRef.current) return;
      speak(text, ttsLang, () => {
        if (!autoActiveRef.current) return;
        // 読み上げ完了 → 0.2秒待ってフィクサーセリフを表示
        addAutoTimer(() => {
          if (!autoActiveRef.current) return;
          setShowFixerLine(true);
        }, 200);
      }, rate);
    }, 100);

    return () => clearAutoTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLeaderLine, pair.leader]);

  // フィクサーセリフ表示後にTTS読み上げ
  // AUTO: TTS → 自動進行（次のセリフへ）
  // PRACTICE: TTS → 停止（ユーザーが声に出して練習→「次へ」ボタンで進行）
  useEffect(() => {
    if (callMode === 'practice') {
      // 練習モード: TTS読み上げのみ（自動進行しない）
      if (!showFixerLine || !pair.fixer) return;

      autoActiveRef.current = true;
      const fixer = pair.fixer;
      const ttsLang = selectedLangRef.current;
      const text = ttsLang === 'ja' ? fixer.ja : fixer.en;
      const rate = ttsLang === 'ja' ? SPEED_LEVELS[jaSpeedRef.current] : SPEED_LEVELS[enSpeedRef.current];

      addAutoTimer(() => {
        if (!autoActiveRef.current) return;
        speak(text, ttsLang, undefined, rate);
      }, 200);

      return () => clearAutoTimers();
    }

    // AUTOモード: TTS → 自動進行
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
        // 読み上げ完了 → 0.5秒待って次へ
        addAutoTimer(() => {
          if (!autoActiveRef.current) return;
          if (lastPair) {
            handleEndCallRef.current();
          } else {
            setCurrentLineIndex(prev => prev + 1);
          }
        }, 500);
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

  // PC用: レスポンシブブレークポイント（768 / 1024 / 1440）
  const isLargePC = useMediaQuery('(min-width: 1024px)');
  const isXLargePC = useMediaQuery('(min-width: 1440px)');

  // PC用: パネルのアクティブ状態
  const vipActive = showLeaderLine && !showFixerLine;
  const fixerActive = showFixerLine;

  // PC用: パルス方向と色
  const pulseDirection = vipActive ? 'to-fixer' as const : fixerActive ? 'to-vip' as const : 'idle' as const;
  const pulseColor = mood === 'serious' ? '#3b82f6' : '#22c55e';

  return (
    <div className={`min-h-dvh bg-dark flex flex-col ${isPC ? 'h-screen overflow-hidden' : ''}`}>
      {/* ===== ヘッダー（共通） ===== */}
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
            {isPC ? (
              <FlagIcon countryId={country.id} className="w-7 h-auto rounded-sm" />
            ) : (
              <span className="text-xl">{country.flag}</span>
            )}
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
                aria-label="日本語に切替"
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
                aria-label="Switch to English"
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
                  aria-label="日本語速度を下げる"
                  className="text-gray-500 text-[10px] px-0.5 hover:text-gray-300 disabled:opacity-30"
                  disabled={jaSpeed <= 1}
                >
                  ◀
                </button>
                <span className="text-accent text-[10px] font-mono w-3 text-center">{jaSpeed}</span>
                <button
                  onClick={() => onJaSpeedChange(Math.min(7, jaSpeed + 1))}
                  aria-label="日本語速度を上げる"
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
                  aria-label="Decrease English speed"
                  className="text-gray-500 text-[10px] px-0.5 hover:text-gray-300 disabled:opacity-30"
                  disabled={enSpeed <= 1}
                >
                  ◀
                </button>
                <span className="text-accent text-[10px] font-mono w-3 text-center">{enSpeed}</span>
                <button
                  onClick={() => onEnSpeedChange(Math.min(7, enSpeed + 1))}
                  aria-label="Increase English speed"
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

      {isPC ? (() => {
        /* ===== PC: レスポンシブサイズ定義 (768 / 1024 / 1440) ===== */
        const avatarSize = isXLargePC ? 280 : isLargePC ? 220 : 200;
        const textMain = isXLargePC ? 'text-2xl' : isLargePC ? 'text-xl' : 'text-lg';
        const textSub = isXLargePC ? 'text-lg' : isLargePC ? 'text-base' : 'text-sm';
        const textName = isXLargePC ? 'text-xl' : isLargePC ? 'text-lg' : 'text-base';
        const textGhost = isXLargePC ? 'text-base' : isLargePC ? 'text-sm' : 'text-sm';
        const bubblePad = isXLargePC ? 'px-10 py-8' : isLargePC ? 'px-8 py-7' : 'p-7';
        const bubbleMax = isXLargePC ? 'max-w-2xl' : isLargePC ? 'max-w-xl' : 'max-w-lg';
        const lineH = isXLargePC ? 'leading-[1.8]' : isLargePC ? 'leading-[1.75]' : 'leading-[1.7]';
        const btnText = isXLargePC ? 'text-sm' : 'text-xs';
        const btnPad = isXLargePC ? 'px-5 py-2.5' : isLargePC ? 'px-4 py-2' : 'px-4 py-1.5';
        const practiceText = isXLargePC ? 'text-2xl' : isLargePC ? 'text-xl' : 'text-lg';
        const practiceSub = isXLargePC ? 'text-base' : isLargePC ? 'text-sm' : 'text-sm';
        const practiceLabelText = isXLargePC ? 'text-sm' : 'text-xs';
        const practiceBtnText = isXLargePC ? 'text-base' : isLargePC ? 'text-sm' : 'text-sm';

        return (
        <>
          <div className="flex flex-1 min-h-0">
            {/* ----- VIP パネル (45%) ----- */}
            <div className="w-[45%] relative flex flex-col overflow-hidden">
              {/* アクティブ時のグロー背景 */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at 70% 50%, ${country.accentColor}12, transparent 70%)`,
                  opacity: vipActive ? 1 : 0,
                }}
              />

              <div className={`relative flex-1 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
                vipActive ? 'opacity-100' : fixerActive ? 'opacity-40' : 'opacity-70'
              }`}>
                {/* VIP アバター */}
                <div className="text-center mb-6">
                  <AvatarSilhouette
                    variant="vip"
                    color={country.accentColor}
                    speaking={vipActive}
                    size={avatarSize}
                    flagIcon={<FlagIcon countryId={country.id} className="w-12 h-auto rounded-sm" />}
                  />
                  <div className={`flex items-center justify-center gap-2 ${textName} font-mono font-bold tracking-wider mt-3 transition-colors duration-500 ${
                    vipActive ? 'text-white' : 'text-gray-600'
                  }`}>
                    <FlagIcon countryId={country.id} className="w-8 h-auto rounded-sm" />
                    {countryDisplay}
                  </div>
                  {vipActive && (
                    <div
                      className="h-0.5 mx-auto mt-2 rounded-full animate-fade-in"
                      style={{ width: '40px', backgroundColor: country.accentColor }}
                    />
                  )}
                </div>

                {/* VIP 吹き出し */}
                <div className={`w-full ${bubbleMax}`}>
                  {showLeaderLine && pair.leader ? (
                    <div className={`relative bg-gray-800/50 rounded-2xl ${bubblePad} ml-auto mr-2 max-w-[95%] animate-fade-in`}>
                      {/* 右向き三角（尻尾） */}
                      <div className="absolute -right-2 top-8 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-gray-800/50" />
                      <TypewriterText
                        text={selectedLang === 'ja' ? pair.leader.ja : pair.leader.en}
                        className={`text-gray-300 ${textMain} ${lineH} italic block`}
                        duration={2000}
                      />
                      <div className={`text-gray-500 ${textSub} mt-3`}>
                        {selectedLang === 'ja' ? pair.leader.en : pair.leader.ja}
                      </div>
                    </div>
                  ) : !vipActive && prevLeaderRef.current ? (
                    /* 前回のセリフ（ゴースト表示） */
                    <div className={`relative bg-gray-800/20 rounded-2xl ${bubblePad} ml-auto mr-2 max-w-[95%] opacity-50`}>
                      <div className="absolute -right-2 top-8 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-gray-800/20" />
                      <div className={`text-gray-600 ${textGhost} ${lineH} italic`}>
                        {selectedLang === 'ja' ? prevLeaderRef.current.ja : prevLeaderRef.current.en}
                      </div>
                    </div>
                  ) : isThinking ? (
                    <div className="flex gap-1.5 justify-center py-4">
                      <span className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* ----- 回線ビジュアル (10%) ----- */}
            <div className="w-[10%] py-8">
              <ConnectionLine direction={pulseDirection} color={pulseColor} />
            </div>

            {/* ----- フィクサーパネル (45%) ----- */}
            <div className="w-[45%] relative flex flex-col overflow-hidden">
              {/* アクティブ時のグロー背景 */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: 'radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.07), transparent 70%)',
                  opacity: fixerActive ? 1 : 0,
                }}
              />

              <div className={`relative flex-1 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${
                fixerActive ? 'opacity-100' : vipActive ? 'opacity-40' : 'opacity-70'
              }`}>
                {/* フィクサーアバター */}
                <div className="text-center mb-6">
                  <AvatarSilhouette
                    variant="fixer"
                    color="#4a4a4a"
                    speaking={fixerActive}
                    size={avatarSize}
                  />

                  <div className={`${textName} font-mono font-bold tracking-wider mt-3 transition-colors duration-500 ${
                    fixerActive ? 'text-accent' : 'text-gray-600'
                  }`}>
                    FIXER
                  </div>
                  {fixerActive && (
                    <div className="h-0.5 w-10 mx-auto mt-2 rounded-full bg-accent animate-fade-in" />
                  )}
                </div>

                {/* フィクサー吹き出し */}
                <div className={`w-full ${bubbleMax}`}>
                  {showFixerLine && pair.fixer && callMode !== 'practice' ? (
                    <div className={`relative bg-accent/5 border border-accent/20 rounded-2xl ${bubblePad} mr-auto ml-2 max-w-[95%] animate-fade-in`}>
                      {/* 左向き三角（尻尾） */}
                      <div className="absolute -left-2 top-8 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-accent/20" />
                      <TypewriterText
                        text={selectedLang === 'ja' ? `「${pair.fixer.ja}」` : `"${pair.fixer.en}"`}
                        className={`text-white ${textMain} font-bold ${lineH} block`}
                        duration={2000}
                      />
                      <div className={`text-accent/60 ${textSub} mt-3 font-mono`}>
                        "{selectedLang === 'ja' ? pair.fixer.en : pair.fixer.ja}"
                      </div>
                    </div>
                  ) : showFixerLine && pair.fixer && callMode === 'practice' ? (
                    /* 練習モード */
                    <div className="mr-auto ml-2 max-w-[95%] animate-fade-in">
                      <div className={`${practiceLabelText} text-accent/60 mb-2 font-mono font-bold uppercase tracking-wider`}>
                        {t('yourLine')}
                      </div>
                      <div className={`text-white ${practiceText} ${lineH} mb-2`}>
                        {selectedLang === 'ja' ? pair.fixer.ja : pair.fixer.en}
                      </div>
                      <div className={`text-gray-500 ${practiceSub} ${lineH}`}>
                        {selectedLang === 'ja' ? pair.fixer.en : pair.fixer.ja}
                      </div>
                      <button
                        onClick={handlePracticeNext}
                        className={`mt-4 w-full py-3 rounded-xl bg-accent/20 text-accent border border-accent/50 font-mono ${practiceBtnText} hover:bg-accent/30 transition-all active:scale-[0.98]`}
                      >
                        {t('practiceNext')}
                      </button>
                    </div>
                  ) : !fixerActive && prevFixerRef.current ? (
                    /* 前回のセリフ（ゴースト表示） */
                    <div className={`relative bg-accent/5 rounded-2xl ${bubblePad} mr-auto ml-2 max-w-[95%] opacity-30`}>
                      <div className="absolute -left-2 top-8 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-accent/10" />
                      <div className={`text-gray-500 ${textGhost} ${lineH}`}>
                        {selectedLang === 'ja' ? `「${prevFixerRef.current.ja}」` : `"${prevFixerRef.current.en}"`}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* PC コントロールバー */}
          <div className="p-3 border-t border-gray-800">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 flex-wrap">
              {/* スピーカー切替 */}
              <button
                onClick={() => setSpeakerMode(prev => prev === 'speaker' ? 'earpiece' : 'speaker')}
                className={`pc-compact-btn ${btnPad} rounded-full ${btnText} font-mono transition-all flex items-center gap-1.5 ${
                  speakerMode === 'speaker'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                <span className="text-sm">{speakerMode === 'speaker' ? '\u{1F50A}' : '\u{1F4F1}'}</span>
                {speakerMode === 'speaker' ? t('speakerMode') : t('earpieceMode')}
              </button>

              {/* 自動/手動切替 */}
              {callMode === 'auto' && (
                <button
                  onClick={() => {
                    if (autoMode) clearAutoTimers();
                    setAutoMode(!autoMode);
                  }}
                  className={`pc-compact-btn ${btnPad} rounded-full ${btnText} font-mono transition-all ${
                    autoMode
                      ? 'bg-accent/20 text-accent border border-accent/50'
                      : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}
                >
                  {autoMode ? 'AUTO' : 'MANUAL'}
                </button>
              )}

              <div className="h-5 w-px bg-gray-700" />

              {/* ナビゲーション */}
              <button
                onClick={handlePrev}
                disabled={currentLineIndex === 0}
                className={`pc-compact-btn ${btnPad} rounded-lg font-mono ${btnText} transition-all ${
                  currentLineIndex === 0
                    ? 'bg-gray-900 text-gray-700 cursor-not-allowed'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-[0.97]'
                }`}
              >
                ◀ {t('prev')}
              </button>
              <span className={`text-gray-600 ${btnText} font-mono tabular-nums`}>
                {currentLineIndex + 1} / {totalPairs}
              </span>
              <button
                onClick={handleNext}
                className={`pc-compact-btn ${btnPad} rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 font-mono ${btnText} transition-all active:scale-[0.97]`}
              >
                {isLastPair ? t('endCallNext') : t('next')} ▶
              </button>

              {/* 読み上げボタン */}
              {callMode === 'auto' && showFixerLine && pair.fixer && (
                <>
                  <div className="h-5 w-px bg-gray-700" />
                  <button
                    onClick={speakJa}
                    disabled={isSpeaking}
                    className={`pc-compact-btn ${btnPad} rounded-lg border font-mono ${btnText} transition-all ${
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
                    className={`pc-compact-btn ${btnPad} rounded-lg border font-mono ${btnText} transition-all ${
                      isSpeaking
                        ? 'border-accent/50 text-accent/50 animate-pulse-border'
                        : 'border-gray-600 text-gray-300 hover:border-accent hover:text-accent active:scale-[0.97]'
                    }`}
                  >
                    {t('speakEn')}
                  </button>
                </>
              )}

              <div className="h-5 w-px bg-gray-700" />

              {/* 通話終了 */}
              <button
                onClick={handleEndCall}
                className={`pc-compact-btn px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono ${btnText} transition-all active:scale-[0.98]`}
              >
                {t('endCall')}
              </button>
            </div>
          </div>
        </>
        );
      })() : (
        /* ===== モバイル: 既存レイアウト（変更なし） ===== */
        <>
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
                  selectedLang={selectedLang}
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
                  selectedLang={selectedLang}
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
        </>
      )}
    </div>
  );
}
