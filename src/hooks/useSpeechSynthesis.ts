import { useState, useCallback, useRef, useEffect } from 'react';

// TTS制御フック
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ブラウザがTTSに対応しているか
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // 読み上げ停止
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // テキスト読み上げ
  const speak = useCallback(
    (text: string, lang: 'ja' | 'en', onEnd?: () => void) => {
      if (!isSupported) return;

      // 既存の読み上げを停止
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      if (lang === 'ja') {
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;  // 少しゆっくり、重厚感
        utterance.pitch = 0.8; // 低め、落ち着いた声
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 0.9;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
