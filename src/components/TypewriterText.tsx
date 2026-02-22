import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  /** 全文表示までの最大時間（ms）。デフォルト2000 */
  duration?: number;
  className?: string;
}

// タイプライター風テキスト表示（PC専用演出）
export function TypewriterText({ text, duration = 2000, className = '' }: Props) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    setCount(0);
    if (!text) return;

    // 1文字あたりの表示間隔（最大40ms、全体は duration 以内）
    const charDelay = Math.min(duration / text.length, 40);
    let start = 0;

    const step = (ts: number) => {
      if (!start) start = ts;
      const n = Math.min(Math.floor((ts - start) / charDelay) + 1, text.length);
      setCount(n);
      if (n < text.length) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {count < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-current animate-blink align-text-bottom ml-px" />
      )}
    </span>
  );
}
