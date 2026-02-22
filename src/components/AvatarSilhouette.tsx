interface Props {
  /** 'vip' = スーツ姿リーダー, 'fixer' = サングラス付きフィクサー */
  variant: 'vip' | 'fixer';
  /** シルエットの塗り色（VIP: 国テーマカラー, Fixer: ダークグレー） */
  color: string;
  /** 国旗絵文字（VIP のみ使用） */
  flag?: string;
  /** 発言中 = true → 呼吸アニメ + 高 opacity */
  speaking?: boolean;
  /** コンポーネント高さ (px) */
  size?: number;
}

/**
 * PC版スプリットスクリーン用アバターシルエット
 * CSS clip-path + SVG で外部画像なしに人型を描画
 */
export function AvatarSilhouette({ variant, color, flag, speaking = false, size = 140 }: Props) {
  const isFixer = variant === 'fixer';

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{ height: size }}
    >
      {/* シルエット本体 */}
      <div
        className={`transition-all duration-1000 ${
          speaking ? 'avatar-breathing' : ''
        }`}
        style={{
          opacity: speaking ? 0.7 : 0.2,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        <svg
          width={size * 0.75}
          height={size}
          viewBox="0 0 120 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 頭部 */}
          <ellipse cx="60" cy="38" rx="22" ry="26" fill={color} />

          {/* 首 */}
          <rect x="51" y="62" width="18" height="12" rx="4" fill={color} />

          {/* 肩〜胴体（スーツ） */}
          <path
            d="M60 74 C60 74, 30 78, 12 98 C6 106, 4 120, 4 160 L116 160 C116 120, 114 106, 108 98 C90 78, 60 74, 60 74Z"
            fill={color}
          />

          {/* スーツのラペル（V字の襟） */}
          <path
            d="M60 74 L48 100 L60 92 L72 100 Z"
            fill="rgba(0,0,0,0.3)"
          />

          {/* ネクタイ */}
          <path
            d="M57 92 L60 130 L63 92 Z"
            fill="rgba(0,0,0,0.25)"
          />

          {/* フィクサー: サングラス */}
          {isFixer && (
            <>
              {/* フレーム横棒 */}
              <rect x="36" y="33" width="48" height="3" rx="1.5" fill="rgba(0,0,0,0.6)" />
              {/* 左レンズ */}
              <rect x="36" y="30" width="18" height="12" rx="3" fill="rgba(0,0,0,0.7)" />
              {/* 右レンズ */}
              <rect x="66" y="30" width="18" height="12" rx="3" fill="rgba(0,0,0,0.7)" />
              {/* ブリッジ */}
              <rect x="54" y="33" width="12" height="3" rx="1.5" fill="rgba(0,0,0,0.6)" />
            </>
          )}
        </svg>
      </div>

      {/* VIP: 国旗バッジ */}
      {!isFixer && flag && (
        <div
          className="absolute -top-1 -right-1 text-3xl drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        >
          {flag}
        </div>
      )}

      {/* フィクサー: サングラス絵文字バッジ */}
      {isFixer && (
        <div
          className="absolute -top-1 -right-1 text-2xl"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        >
          🕶️
        </div>
      )}
    </div>
  );
}
