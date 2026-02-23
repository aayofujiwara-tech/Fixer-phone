// 左装飾エリア: スキャンライン + データストリーム + 座標表示
// 各行が独立してランダム位置にフェードイン→フェードアウト（ハッキングシーン風）
// DOM要素は固定プール、useRef で直接操作（React再レンダーなし）

import { useRef, useEffect } from 'react';

/* ========== テキスト素材 ========== */

const COORDS = [
  'N35.6762', 'E139.650', 'N40.7128', 'W074.006', 'N51.5074', 'W000.127',
  'N55.7558', 'E037.617', 'N39.9042', 'E116.407', 'N48.8566', 'E002.352',
  'N52.5200', 'E013.405', 'N37.5665', 'E126.978', 'N31.7683', 'E035.213',
  'N28.6139', 'E077.209', 'N24.7136', 'E046.675', 'N41.9028', 'E012.496',
  'S33.8688', 'E151.209', 'N34.0522', 'W118.243',
];

const MULTI_LANG = [
  'ШИФР', 'СВЯЗЬ', 'АГЕНТ', 'ДОСТУП', 'СЕТЬ', 'ЦЕНТР',
  '加密', '監視中', '安全', '接続', '解析', '傍受',
  '암호화', '보안', '연결', '수신중', '해독',
  'تشفير', 'أمان', 'اتصال', 'مراقبة',
  'מוצפן', 'חיבור', 'מעקב',
  'सुरक्षा', 'एजेंट',
  'CHIFFRÉ', 'LIAISON', 'ACCÈS', 'ZUGANG', 'SIGNAL',
  'SECURITAS', 'NEXUS', 'ARCANUM',
];

const STATUS = [
  'SYS_OK', 'AUTH:PASS', 'SEC:LV7', 'NET:UP', 'ENC:AES',
  'TOR:ROUTE', 'PING:12ms', 'SNR:42dB', 'CH:LOCK', 'ACK:0xFF',
  'PID:4092', 'TTL:128', 'MTU:1500', 'VPN:ON', 'DNS:SEC',
];

const JA_NUMS = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'];

/* ========== ランダム生成 ========== */

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randBin(): string {
  return Array.from({ length: 8 }, () => (Math.random() < 0.5 ? '1' : '0')).join('');
}

function randHex(): string {
  const n = Math.random() < 0.5 ? 4 : 8;
  const h = Array.from({ length: n }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase(),
  ).join('');
  return n === 4 ? `0x${h}` : `${h.slice(0, 4)} ${h.slice(4)}`;
}

function randJa(): string {
  return Array.from({ length: 4 }, () => pick(JA_NUMS)).join('');
}

function randTime(): string {
  const p = (v: number) => String(v).padStart(2, '0');
  return `${p(Math.floor(Math.random() * 24))}:${p(Math.floor(Math.random() * 60))}:${p(Math.floor(Math.random() * 60))}`;
}

function randEntry(): { text: string; bright: boolean } {
  const r = Math.random();
  let text: string;
  if (r < 0.22) text = randBin();
  else if (r < 0.36) text = randHex();
  else if (r < 0.50) text = pick(COORDS);
  else if (r < 0.60) text = randJa();
  else if (r < 0.74) text = pick(MULTI_LANG);
  else if (r < 0.86) text = pick(STATUS);
  else text = randTime();
  return { text, bright: Math.random() < 0.18 };
}

/* ========== 定数 ========== */

const COL_COUNT = 6;
const SLOTS_PER_COL = 7; // 固定プール: 6×7 = 42 DOM要素

/* ========== コンポーネント ========== */

export function LeftDecoration() {
  const slotsRef = useRef<(HTMLSpanElement | null)[][]>(
    Array.from({ length: COL_COUNT }, () => new Array<HTMLSpanElement | null>(SLOTS_PER_COL).fill(null)),
  );

  useEffect(() => {
    let active = true;

    /** 1スロットの表示サイクル（再帰） */
    const cycle = (col: number, slot: number) => {
      if (!active) return;
      const el = slotsRef.current[col]?.[slot];
      if (!el) return;

      const { text, bright } = randEntry();
      const isFlash = Math.random() < 0.08;

      /* ---- Phase 1: 非表示のまま再配置・テキスト変更 ---- */
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.textContent = text;
      el.style.top = `${2 + Math.random() * 88}%`;

      if (isFlash) {
        el.style.color = 'rgba(0,255,136,0.95)';
        el.style.textShadow = '0 0 8px rgba(0,255,136,0.5)';
      } else {
        el.style.color = bright ? 'rgba(0,255,136,0.55)' : '';
        el.style.textShadow = '';
      }

      /* ---- Phase 2: transition再有効化 → フェードイン ---- */
      requestAnimationFrame(() => {
        if (!active) return;
        el.style.transition = '';           // CSS定義のtransitionに戻す
        requestAnimationFrame(() => {
          if (!active) return;
          el.style.opacity = '1';           // フェードイン開始
        });
      });

      /* ---- Phase 3: フラッシュ色を戻す（smooth transition） ---- */
      if (isFlash) {
        setTimeout(() => {
          if (!active) return;
          el.style.color = bright ? 'rgba(0,255,136,0.55)' : '';
          el.style.textShadow = '';
        }, 400);
      }

      /* ---- Phase 4: ホールド → フェードアウト → 次サイクル ---- */
      const hold = 1000 + Math.random() * 3000;         // 1–4秒表示
      setTimeout(() => {
        if (!active) return;
        el.style.opacity = '0';                          // フェードアウト
        const gap = 400 + Math.random() * 1100;          // 0.4–1.5秒の空白
        setTimeout(() => cycle(col, slot), gap);
      }, hold);
    };

    // 初期スタガー（0–5秒でバラバラに開始）
    for (let c = 0; c < COL_COUNT; c++) {
      for (let s = 0; s < SLOTS_PER_COL; s++) {
        setTimeout(() => cycle(c, s), Math.random() * 5000);
      }
    }

    return () => { active = false; };
  }, []);

  return (
    <div className="deco-left">
      {/* スキャンライン */}
      <div className="deco-scanline" />

      {/* データストリーム — 個別フェード方式 */}
      <div className="deco-stream">
        {Array.from({ length: COL_COUNT }, (_, ci) => (
          <div key={ci} className="deco-stream-col">
            {Array.from({ length: SLOTS_PER_COL }, (_, si) => (
              <span
                key={si}
                className="stream-slot"
                ref={(el) => { slotsRef.current[ci][si] = el; }}
              />
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
