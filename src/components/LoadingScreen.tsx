import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { translations, type TranslationKey } from '../i18n/translations';

interface Props {
  isReady: boolean;
  onComplete: () => void;
}

const messageKeys: TranslationKey[] = ['loading1', 'loading2', 'loading3', 'loading4'];

// 演出ローディング画面
export function LoadingScreen({ isReady, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { lang } = useLanguage();

  console.log('=== LOADING: render ===', { isReady, currentIndex, isTyping });

  const otherLang = lang === 'ja' ? 'en' : 'ja';

  const getPrimaryText = (idx: number) => translations[messageKeys[idx]][lang];
  const getSecondaryText = (idx: number) => translations[messageKeys[idx]][otherLang];

  // タイプライター効果
  useEffect(() => {
    if (currentIndex >= messageKeys.length) return;

    const fullText = getPrimaryText(currentIndex);
    let charIndex = 0;
    setDisplayText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      charIndex++;
      setDisplayText(fullText.slice(0, charIndex));

      if (charIndex >= fullText.length) {
        clearInterval(typeInterval);
        setIsTyping(false);

        // 最後のメッセージかつAPIレスポンス取得済みなら画面遷移
        if (currentIndex === messageKeys.length - 1 && isReady) {
          setTimeout(onComplete, 800);
          return;
        }

        // 次のメッセージへ
        if (currentIndex < messageKeys.length - 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 1200);
        }
      }
    }, 50);

    return () => clearInterval(typeInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isReady, onComplete, lang]);

  // 全メッセージ表示後、APIがまだなら最後のメッセージで待機
  // APIが完了したら遷移
  useEffect(() => {
    if (currentIndex >= messageKeys.length - 1 && !isTyping && isReady) {
      setTimeout(onComplete, 800);
    }
  }, [isReady, currentIndex, isTyping, onComplete]);

  // プログレス計算
  const progress = ((currentIndex + 1) / messageKeys.length) * 100;

  return (
    <div className="min-h-dvh bg-dark flex flex-col items-center justify-center p-8">
      {/* パルスアニメーション */}
      <div className="relative mb-12">
        <div className="w-16 h-16 rounded-full border-2 border-accent/30 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulse" />
        </div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-accent/10 animate-ping" />
      </div>

      {/* 過去のメッセージ */}
      <div className="w-full max-w-sm space-y-3 mb-6">
        {messageKeys.slice(0, currentIndex).map((_key, i) => (
          <div key={i} className="text-accent/40 text-sm font-mono">
            <span className="text-accent/20 mr-2">[OK]</span>
            {getPrimaryText(i)}
          </div>
        ))}
      </div>

      {/* 現在のメッセージ（タイプライター） */}
      <div className="w-full max-w-sm">
        <div className="text-accent text-sm font-mono">
          <span className="text-accent/60 mr-2">{'>'}</span>
          {displayText}
          {isTyping && <span className="animate-blink">_</span>}
        </div>
        <div className="text-accent/30 text-xs font-mono mt-1 ml-5">
          {currentIndex < messageKeys.length
            ? getSecondaryText(currentIndex)
            : ''}
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full max-w-sm mt-12">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-gray-600 text-xs font-mono mt-2 text-right">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
