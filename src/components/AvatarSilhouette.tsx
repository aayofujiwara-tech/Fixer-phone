interface Props {
  /** 'vip' = スーツ姿リーダー, 'fixer' = サングラス付きフィクサー */
  variant: 'vip' | 'fixer';
  /** シルエットの塗り色（VIP: 国テーマカラー, Fixer: ダークグレー） */
  color: string;
  /** 国旗絵文字（VIP のみ使用・フォールバック用） */
  flag?: string;
  /** 発言中 = true → 呼吸アニメ + 高 opacity + バックライトパルス */
  speaking?: boolean;
  /** コンポーネント高さ (px) */
  size?: number;
  /** 国旗SVGコンポーネント（FlagIconから渡す） */
  flagIcon?: React.ReactNode;
}

/**
 * PC版スプリットスクリーン用アバターシルエット
 * スパイ映画風のディテール付きSVGシルエット
 */
export function AvatarSilhouette({ variant, color, speaking = false, size = 140, flagIcon }: Props) {
  const isFixer = variant === 'fixer';
  const svgW = Math.round(size * 0.8);
  const svgH = size;

  // VIP用グラデーションID（インスタンスごとにユニーク）
  const gradId = `sil-grad-${variant}`;
  const backlightId = `backlight-${variant}`;
  const glassGlowId = 'glass-glow';

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{ height: size }}
    >
      {/* バックライト効果（背後の光輪） */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-700 ${
          speaking ? 'silhouette-backlight-pulse' : ''
        }`}
        style={{
          background: isFixer
            ? 'radial-gradient(ellipse at 50% 45%, rgba(0,255,136,0.12), transparent 70%)'
            : `radial-gradient(ellipse at 50% 45%, ${color}25, transparent 70%)`,
          opacity: speaking ? 1 : 0,
        }}
      />

      {/* シルエット本体 */}
      <div
        className={`relative transition-all duration-1000 ${
          speaking ? 'avatar-breathing' : ''
        }`}
        style={{
          opacity: speaking ? 0.85 : 0.25,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        <svg
          width={svgW}
          height={svgH}
          viewBox="0 0 200 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* バックライト */}
            <radialGradient id={backlightId} cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor={isFixer ? '#00ff88' : color} stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* シルエットグラデーション（上が明るく下が暗い） */}
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isFixer ? '#5a5a5a' : color} stopOpacity="1" />
              <stop offset="100%" stopColor={isFixer ? '#2a2a2a' : color} stopOpacity="0.6" />
            </linearGradient>

            {/* サングラス反射グラデーション */}
            {isFixer && (
              <linearGradient id={glassGlowId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00ffc8" stopOpacity="0.0" />
                <stop offset="40%" stopColor="#00ffc8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.05" />
              </linearGradient>
            )}
          </defs>

          {/* 背後の光輪 */}
          <ellipse cx="100" cy="110" rx="90" ry="105" fill={`url(#${backlightId})`} />

          {isFixer ? (
            /* ===== フィクサーシルエット ===== */
            <>
              {/* 頭部 — 角張った顎、シャープなライン */}
              <path
                d="M100 18
                   C78 18, 64 32, 62 50
                   C60 62, 62 72, 66 80
                   L70 88 L74 92
                   C80 98, 90 100, 100 100
                   C110 100, 120 98, 126 92
                   L130 88 L134 80
                   C138 72, 140 62, 138 50
                   C136 32, 122 18, 100 18Z"
                fill={`url(#${gradId})`}
              />

              {/* 耳 */}
              <ellipse cx="62" cy="58" rx="5" ry="10" fill={`url(#${gradId})`} />
              <ellipse cx="138" cy="58" rx="5" ry="10" fill={`url(#${gradId})`} />

              {/* イヤピース（右耳） */}
              <path
                d="M143 55 C148 55, 150 58, 150 62 C150 66, 148 68, 144 68"
                stroke="rgba(0,255,136,0.3)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="150" cy="62" r="2" fill="rgba(0,255,136,0.4)" />

              {/* 首 — シャープ */}
              <path
                d="M88 98 L86 114 L114 114 L112 98"
                fill={`url(#${gradId})`}
              />

              {/* 肩〜胴体 — コートの襟を立てたスタイル */}
              <path
                d="M86 114
                   C86 114, 60 116, 36 130
                   C22 140, 14 155, 10 250
                   L190 250
                   C186 155, 178 140, 164 130
                   C140 116, 114 114, 114 114Z"
                fill={`url(#${gradId})`}
              />

              {/* コートの立て襟（左） */}
              <path
                d="M86 112 L72 106 L60 120 L78 126 Z"
                fill="rgba(255,255,255,0.06)"
              />
              {/* コートの立て襟（右） */}
              <path
                d="M114 112 L128 106 L140 120 L122 126 Z"
                fill="rgba(255,255,255,0.06)"
              />

              {/* ラペルV字 */}
              <path
                d="M86 126 L100 170 L114 126"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="1"
                fill="none"
              />

              {/* ネクタイ */}
              <path
                d="M96 126 L100 190 L104 126"
                fill="rgba(0,0,0,0.25)"
              />

              {/* サングラス — しっかりした形 */}
              {/* フレーム上部 */}
              <path
                d="M66 50 L68 44 C72 40, 80 38, 86 38 L114 38 C120 38, 128 40, 132 44 L134 50"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="2.5"
                fill="none"
              />
              {/* テンプル（左こめかみ） */}
              <path d="M66 48 L58 46 L56 50" stroke="rgba(0,0,0,0.7)" strokeWidth="2" fill="none" />
              {/* テンプル（右こめかみ） */}
              <path d="M134 48 L142 46 L144 50" stroke="rgba(0,0,0,0.7)" strokeWidth="2" fill="none" />
              {/* ブリッジ */}
              <path d="M93 48 C96 52, 104 52, 107 48" stroke="rgba(0,0,0,0.8)" strokeWidth="2" fill="none" />
              {/* 左レンズ */}
              <path
                d="M68 44 C70 40, 78 38, 86 38 L92 38 L93 48 L92 56 C88 60, 78 62, 72 60 L68 56 Z"
                fill="rgba(0,0,0,0.75)"
              />
              {/* 右レンズ */}
              <path
                d="M132 44 C130 40, 122 38, 114 38 L108 38 L107 48 L108 56 C112 60, 122 62, 128 60 L132 56 Z"
                fill="rgba(0,0,0,0.75)"
              />
              {/* レンズ反射ハイライト */}
              <path
                d="M72 42 L82 42 L78 52 L70 50 Z"
                fill={`url(#${glassGlowId})`}
                className={speaking ? 'silhouette-glass-flash' : ''}
              />
              <path
                d="M118 42 L128 42 L124 52 L116 50 Z"
                fill={`url(#${glassGlowId})`}
                className={speaking ? 'silhouette-glass-flash' : ''}
              />
            </>
          ) : (
            /* ===== VIPシルエット ===== */
            <>
              {/* 髪 — 整った短髪スタイル */}
              <path
                d="M100 14
                   C72 14, 58 28, 56 46
                   L56 36
                   C58 22, 72 10, 100 10
                   C128 10, 142 22, 144 36
                   L144 46
                   C142 28, 128 14, 100 14Z"
                fill={`url(#${gradId})`}
                opacity="0.8"
              />

              {/* 頭部 — 堂々とした形 */}
              <path
                d="M100 16
                   C76 16, 60 32, 58 52
                   C56 66, 60 76, 66 84
                   L72 90
                   C80 98, 90 102, 100 102
                   C110 102, 120 98, 128 90
                   L134 84
                   C140 76, 144 66, 142 52
                   C140 32, 124 16, 100 16Z"
                fill={`url(#${gradId})`}
              />

              {/* 耳 */}
              <ellipse cx="58" cy="60" rx="5" ry="10" fill={`url(#${gradId})`} />
              <ellipse cx="142" cy="60" rx="5" ry="10" fill={`url(#${gradId})`} />

              {/* 首 — 太めで堂々 */}
              <path
                d="M84 100 L82 118 L118 118 L116 100"
                fill={`url(#${gradId})`}
              />

              {/* 肩〜胴体 — 肩幅広くがっしり */}
              <path
                d="M82 118
                   C82 118, 50 120, 28 136
                   C14 146, 6 162, 2 250
                   L198 250
                   C194 162, 186 146, 172 136
                   C150 120, 118 118, 118 118Z"
                fill={`url(#${gradId})`}
              />

              {/* スーツのラペル（左） */}
              <path
                d="M90 118 L68 148 L82 154 L100 132 Z"
                fill="rgba(0,0,0,0.15)"
              />
              {/* スーツのラペル（右） */}
              <path
                d="M110 118 L132 148 L118 154 L100 132 Z"
                fill="rgba(0,0,0,0.15)"
              />

              {/* ネクタイ */}
              <path
                d="M95 132 L100 200 L105 132 Z"
                fill="rgba(0,0,0,0.2)"
              />
              {/* ネクタイの結び目 */}
              <path
                d="M96 128 L100 136 L104 128 L100 124 Z"
                fill="rgba(0,0,0,0.25)"
              />

              {/* シャツの襟ライン */}
              <path
                d="M88 120 L100 130 L112 120"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                fill="none"
              />

              {/* 肩のステッチライン（ディテール） */}
              <path
                d="M82 118 C70 122, 50 130, 38 140"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M118 118 C130 122, 150 130, 162 140"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
                fill="none"
              />
            </>
          )}
        </svg>
      </div>

      {/* VIP: 国旗SVGアイコン */}
      {!isFixer && flagIcon && (
        <div
          className="absolute -top-1 -right-2"
          style={{
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
          }}
        >
          {flagIcon}
        </div>
      )}
    </div>
  );
}
