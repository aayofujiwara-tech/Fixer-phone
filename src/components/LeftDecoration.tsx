// 左装飾エリア: スキャンライン + データストリーム + 座標表示
// ランダム生成テキスト（バイナリ、16進数、座標、多言語）で変化を演出
// useMemo で初回のみ生成 → CSSアニメーションで流す（パフォーマンス重視）

import { useMemo } from 'react';

/* ========== テキスト素材 ========== */

// 12カ国の都市座標（ゲーム内の国に対応）
const COORDS = [
  'N35.6762', 'E139.650',  // Tokyo
  'N40.7128', 'W074.006',  // New York
  'N51.5074', 'W000.127',  // London
  'N55.7558', 'E037.617',  // Moscow
  'N39.9042', 'E116.407',  // Beijing
  'N48.8566', 'E002.352',  // Paris
  'N52.5200', 'E013.405',  // Berlin
  'N37.5665', 'E126.978',  // Seoul
  'N31.7683', 'E035.213',  // Jerusalem
  'N28.6139', 'E077.209',  // Delhi
  'N24.7136', 'E046.675',  // Riyadh
  'N41.9028', 'E012.496',  // Vatican
  'S33.8688', 'E151.209',  // Sydney
  'N34.0522', 'W118.243',  // Los Angeles
];

// 多言語スパイ用語（各国語・フォント不要のものを中心に）
const MULTI_LANG = [
  // Russian (Cyrillic — JetBrains Mono対応)
  'ШИФР', 'СВЯЗЬ', 'АГЕНТ', 'ДОСТУП', 'СЕТЬ', 'ЦЕНТР',
  // Chinese/Japanese (Noto Sans JP対応)
  '加密', '監視中', '安全', '接続', '解析', '傍受',
  // Korean (system fonts fallback)
  '암호화', '보안', '연결', '수신중', '해독',
  // Arabic (system fonts fallback)
  'تشفير', 'أمان', 'اتصال', 'مراقبة',
  // Hebrew (system fonts fallback)
  'מוצפן', 'חיבור', 'מעקב',
  // Hindi (system fonts fallback)
  'सुरक्षा', 'एजेंट',
  // French / German (Latin — JetBrains Mono対応)
  'CHIFFRÉ', 'LIAISON', 'ACCÈS', 'ZUGANG', 'SIGNAL',
  // Latin (Vatican)
  'SECURITAS', 'NEXUS', 'ARCANUM',
];

// ステータス断片
const STATUS = [
  'SYS_OK', 'AUTH:PASS', 'SEC:LV7', 'NET:UP', 'ENC:AES',
  'TOR:ROUTE', 'PING:12ms', 'SNR:42dB', 'CH:LOCK', 'ACK:0xFF',
  'PID:4092', 'TTL:128', 'MTU:1500', 'VPN:ON', 'DNS:SEC',
];

// 日本語数字
const JA_NUMS = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'];

/* ========== ランダム生成関数 ========== */

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randBinary(): string {
  return Array.from({ length: 8 }, () => (Math.random() < 0.5 ? '1' : '0')).join('');
}

function randHex(): string {
  const len = Math.random() < 0.5 ? 4 : 8;
  const hex = Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase(),
  ).join('');
  return len === 4 ? `0x${hex}` : `${hex.slice(0, 4)} ${hex.slice(4)}`;
}

function randJaNums(): string {
  return Array.from({ length: 4 }, () => pick(JA_NUMS)).join('');
}

function randTimestamp(): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(Math.random() * 24))}:${p(Math.floor(Math.random() * 60))}:${p(Math.floor(Math.random() * 60))}`;
}

/** 重み付きランダムで1エントリ生成 */
function randEntry(): { text: string; bright: boolean } {
  const r = Math.random();
  let text: string;
  if (r < 0.22) text = randBinary();
  else if (r < 0.36) text = randHex();
  else if (r < 0.50) text = pick(COORDS);
  else if (r < 0.60) text = randJaNums();
  else if (r < 0.74) text = pick(MULTI_LANG);
  else if (r < 0.86) text = pick(STATUS);
  else text = randTimestamp();
  // ~18% の確率でハイライト
  return { text, bright: Math.random() < 0.18 };
}

/* ========== カラム生成 ========== */

const COL_COUNT = 6;
const ENTRIES_PER_COL = 28;

interface ColData {
  entries: { text: string; bright: boolean }[];
  duration: number;
  delay: number;
}

function generateColumns(): ColData[] {
  return Array.from({ length: COL_COUNT }, () => ({
    entries: Array.from({ length: ENTRIES_PER_COL }, () => randEntry()),
    duration: 11 + Math.random() * 10, // 11–21s
    delay: -(Math.random() * 12),       // -12–0s（開始位置バラバラ）
  }));
}

/* ========== コンポーネント ========== */

export function LeftDecoration() {
  const columns = useMemo(generateColumns, []);

  return (
    <div className="deco-left">
      {/* スキャンライン */}
      <div className="deco-scanline" />

      {/* データストリーム */}
      <div className="deco-stream">
        {columns.map((col, i) => (
          <div
            key={i}
            className="deco-stream-col"
            style={{
              animationDuration: `${col.duration.toFixed(1)}s`,
              animationDelay: `${col.delay.toFixed(1)}s`,
            }}
          >
            {col.entries.map((entry, j) => (
              <span
                key={j}
                style={entry.bright ? { color: 'rgba(0,255,136,0.65)' } : undefined}
              >
                {entry.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* 座標・ステータス表示 */}
      <div className="deco-status">
        <div className="deco-status-line deco-blink-slow">
          LAT: 35.6762
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '0.5s' }}>
          LON: 139.6503
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '1.0s' }}>
          ALT: 40.2m
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '1.5s' }}>
          STATUS: MONITORING
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '2.0s' }}>
          SIGNAL: ENCRYPTED
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '2.5s' }}>
          FREQ: 2.4GHz
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '3.0s' }}>
          PROTOCOL: AES-256
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '3.5s' }}>
          UPLINK: ACTIVE
        </div>
      </div>
    </div>
  );
}
