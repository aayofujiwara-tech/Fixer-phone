interface Props {
  /** パルスの流れる方向 */
  direction: 'to-fixer' | 'to-vip' | 'idle';
  /** パルスの色（CSS color） */
  color: string;
}

// PC版: 中央の回線ビジュアル（縦ライン + パルスアニメーション）
export function ConnectionLine({ direction, color }: Props) {
  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      {/* 縦のメインライン */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{ backgroundColor: color, opacity: 0.25 }}
      />

      {/* 環境光（ラインの周囲のグロー） */}
      <div
        className="absolute top-0 bottom-0 w-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}10, transparent)`,
        }}
      />

      {/* パルスドット（会話中のみ） */}
      {direction !== 'idle' && (
        <>
          <div
            className={`absolute w-2.5 h-2.5 rounded-full will-change-transform ${
              direction === 'to-fixer' ? 'animate-pulse-line-down' : 'animate-pulse-line-up'
            }`}
            style={{
              backgroundColor: color,
              boxShadow: `0 0 14px ${color}, 0 0 28px ${color}60`,
            }}
          />
          <div
            className={`absolute w-1.5 h-1.5 rounded-full will-change-transform ${
              direction === 'to-fixer' ? 'animate-pulse-line-down-delayed' : 'animate-pulse-line-up-delayed'
            }`}
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* 端点ノード（上下） */}
      <div
        className="absolute top-6 w-3 h-3 rounded-full border-2"
        style={{ borderColor: color, opacity: direction !== 'idle' ? 0.6 : 0.2 }}
      />
      <div
        className="absolute bottom-6 w-3 h-3 rounded-full border-2"
        style={{ borderColor: color, opacity: direction !== 'idle' ? 0.6 : 0.2 }}
      />
    </div>
  );
}
