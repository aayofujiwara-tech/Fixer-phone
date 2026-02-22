import { useState, useCallback, useRef, useEffect } from 'react';

// 男性音声を名前パターンで判定
const MALE_VOICE_PATTERNS = /male|otoya|takeru|ken|david|daniel|alex|james|mark|google.*male/i;
const FEMALE_VOICE_PATTERNS = /female|kyoko|o-ren|haruka|samantha|karen|fiona|google.*female/i;

function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  if (MALE_VOICE_PATTERNS.test(voice.name)) return true;
  if (FEMALE_VOICE_PATTERNS.test(voice.name)) return false;
  // 判定不能な場合はfalse（後でpitchで補正）
  return false;
}

// 指定言語の男性音声を取得
function findMaleVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith(lang));

  // 名前から男性と判定できる音声を優先
  const male = langVoices.find(v => isMaleVoice(v));
  if (male) return male;

  // 見つからない場合は言語一致の最初の音声（pitchで男性感を出す）
  return langVoices[0] ?? null;
}

// TTS制御フック
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const volumeRef = useRef(1.0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // ブラウザがTTSに対応しているか
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // 音声リストは非同期で読み込まれるため、イベントを監視
  useEffect(() => {
    if (!isSupported) return;
    const handleVoicesChanged = () => setVoicesLoaded(true);
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    // 既に読み込み済みの場合
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    }
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [isSupported]);

  // 音量設定（0.0〜1.0）
  const setVolume = useCallback((vol: number) => {
    volumeRef.current = Math.max(0, Math.min(1, vol));
  }, []);

  // 読み上げ停止
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // テキスト読み上げ
  const speak = useCallback(
    (text: string, lang: 'ja' | 'en', onEnd?: () => void, rate?: number) => {
      if (!isSupported) return;

      // 既存の読み上げを停止
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      const langCode = lang === 'ja' ? 'ja' : 'en';
      const maleVoice = findMaleVoice(langCode);

      if (maleVoice) {
        utterance.voice = maleVoice;
      }

      if (lang === 'ja') {
        utterance.lang = 'ja-JP';
        utterance.rate = rate ?? 1.15;
        utterance.pitch = 0.75;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = rate ?? 1.0;
        utterance.pitch = 0.8;
      }

      utterance.volume = volumeRef.current;

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
    [isSupported, voicesLoaded]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, setVolume };
}
