import { useState, useEffect } from 'react';
import type { Scenario } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  scenario: Scenario;
  duration: number;
  onRestart: () => void;
}

// 通話終了画面
export function CallEndScreen({ scenario, duration, onRestart }: Props) {
  const [phase, setPhase] = useState<'terminated' | 'erasing' | 'done'>('terminated');
  const [eraseProgress, setEraseProgress] = useState(0);
  const { lang, t } = useLanguage();

  // 時間フォーマット
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 演出フェーズ管理
  useEffect(() => {
    // 2秒後にデータ消去演出開始
    const eraseTimer = setTimeout(() => {
      setPhase('erasing');
    }, 2000);

    return () => clearTimeout(eraseTimer);
  }, []);

  // データ消去プログレス
  useEffect(() => {
    if (phase !== 'erasing') return;

    const interval = setInterval(() => {
      setEraseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('done');
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [phase]);

  const scenarioTitle = lang === 'ja' ? scenario.scenario_title_ja : scenario.scenario_title_en;

  return (
    <div className="min-h-dvh bg-dark flex flex-col items-center justify-center p-8">
      {/* CALL TERMINATED */}
      <div className="text-center mb-12">
        <div className="text-red-500 text-3xl font-mono font-bold mb-2 animate-fade-in">
          {t('callTerminated')}
        </div>
        <div className="text-gray-500 text-sm font-mono">
          {t('callEnded')}
        </div>
      </div>

      {/* 通話情報 */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-gray-500">{t('callDuration')}</span>
          <span className="text-white">{formatDuration(duration)}</span>
        </div>
        <div className="flex justify-between text-sm font-mono">
          <span className="text-gray-500">{t('scenarioLabel')}</span>
          <span className="text-accent text-right max-w-[200px] truncate">
            {scenarioTitle}
          </span>
        </div>
        <div className="border-t border-gray-800" />
      </div>

      {/* データ消去演出 */}
      <div className="w-full max-w-sm mb-12">
        {phase === 'terminated' && (
          <div className="text-center">
            <div className="text-gray-600 text-xs font-mono animate-blink">
              {t('standby')}
            </div>
          </div>
        )}

        {phase === 'erasing' && (
          <div className="animate-fade-in">
            <div className="text-red-400 text-xs font-mono mb-3 text-center">
              {t('erasing')}
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-100 rounded-full"
                style={{ width: `${eraseProgress}%` }}
              />
            </div>
            <div className="text-gray-600 text-xs font-mono mt-2 text-right">
              {eraseProgress}%
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center animate-fade-in">
            <div className="text-accent text-xs font-mono">
              {t('eraseComplete')}
            </div>
            <div className="text-accent/40 text-xs font-mono mt-1">
              {t('eraseCompleteSub')}
            </div>
          </div>
        )}
      </div>

      {/* 再開ボタン */}
      {phase === 'done' && (
        <button
          onClick={onRestart}
          className="w-full max-w-sm py-4 rounded-xl bg-accent text-dark font-bold font-mono text-lg transition-all hover:bg-accent/90 active:scale-[0.98] animate-fade-in"
        >
          {t('newCall')}
        </button>
      )}
    </div>
  );
}
