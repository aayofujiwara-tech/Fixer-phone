import { useState, useEffect } from 'react';

interface Props {
  isReady: boolean;
  onComplete: () => void;
}

// ローディング演出のメッセージ
const messages = [
  { ja: '暗号化回線を確立中...', en: 'Establishing encrypted channel...' },
  { ja: '相手方のセキュリティを検証中...', en: 'Verifying counterpart security...' },
  { ja: '通訳プロトコルを起動中...', en: 'Initializing interpreter protocol...' },
  { ja: '回線接続完了', en: 'Connection established' },
];

// 演出ローディング画面
export function LoadingScreen({ isReady, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // タイプライター効果
  useEffect(() => {
    if (currentIndex >= messages.length) return;

    const fullText = messages[currentIndex].ja;
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
        if (currentIndex === messages.length - 1 && isReady) {
          setTimeout(onComplete, 800);
          return;
        }

        // 次のメッセージへ
        if (currentIndex < messages.length - 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 1200);
        }
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentIndex, isReady, onComplete]);

  // 全メッセージ表示後、APIがまだなら最後のメッセージで待機
  // APIが完了したら遷移
  useEffect(() => {
    if (currentIndex >= messages.length - 1 && !isTyping && isReady) {
      setTimeout(onComplete, 800);
    }
  }, [isReady, currentIndex, isTyping, onComplete]);

  // プログレス計算
  const progress = ((currentIndex + 1) / messages.length) * 100;

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
        {messages.slice(0, currentIndex).map((msg, i) => (
          <div key={i} className="text-accent/40 text-sm font-mono">
            <span className="text-accent/20 mr-2">[OK]</span>
            {msg.ja}
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
          {currentIndex < messages.length
            ? messages[currentIndex].en
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
