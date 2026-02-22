import { useState, useEffect } from 'react';
import { _ttsDebugLog, _isTtsUnlocked } from '../hooks/useSpeechSynthesis';

// TTS デバッグオーバーレイ
// FEATURES.TTS_DEBUG_OVERLAY が true の時のみ表示される。
// speechSynthesis の内部状態とイベントログをリアルタイム表示する。
export function TtsDebugOverlay() {
  const [, forceUpdate] = useState(0);
  const [minimized, setMinimized] = useState(false);

  // 500ms ごとに状態をポーリング
  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 500);
    return () => clearInterval(id);
  }, []);

  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null;

  const voices = synth ? synth.getVoices() : [];
  const unlocked = _isTtsUnlocked();
  const recentLogs = _ttsDebugLog.slice(-8);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-2 left-2 z-[9999] bg-black/80 text-[10px] text-accent font-mono px-2 py-1 rounded border border-accent/30"
      >
        TTS DBG
      </button>
    );
  }

  return (
    <div className="fixed bottom-2 left-2 z-[9999] bg-black/90 border border-accent/40 rounded-lg p-3 font-mono text-[10px] leading-tight max-w-[320px] max-h-[50vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-accent font-bold">TTS DEBUG</span>
        <button onClick={() => setMinimized(true)} className="text-gray-500 hover:text-gray-300">_</button>
      </div>

      {/* 状態 */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className={`px-1 py-0.5 rounded text-center ${synth?.speaking ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-500'}`}>
          speaking
        </div>
        <div className={`px-1 py-0.5 rounded text-center ${synth?.pending ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-800 text-gray-500'}`}>
          pending
        </div>
        <div className={`px-1 py-0.5 rounded text-center ${synth?.paused ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-500'}`}>
          paused
        </div>
      </div>

      {/* アンロック状態 */}
      <div className={`mb-1 ${unlocked ? 'text-green-400' : 'text-red-400'}`}>
        iOS unlock: {unlocked ? 'OK' : 'PENDING'}
      </div>

      {/* 音声情報 */}
      <div className="text-gray-400 mb-2">
        voices: {voices.length} loaded
      </div>

      {/* イベントログ */}
      <div className="border-t border-gray-700 pt-1 mt-1 space-y-0.5">
        {recentLogs.length === 0 && (
          <div className="text-gray-600">No events yet</div>
        )}
        {recentLogs.map((entry, i) => {
          const t = new Date(entry.time);
          const ts = `${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}.${t.getMilliseconds().toString().padStart(3, '0')}`;
          return (
            <div key={i} className="text-gray-400 truncate">
              <span className="text-gray-600">{ts}</span>{' '}
              {entry.msg}
            </div>
          );
        })}
      </div>
    </div>
  );
}
