// 左装飾エリア: スキャンライン + データストリーム + 座標表示
// CSSアニメーションのみで実装、pointer-events: none

export function LeftDecoration() {
  return (
    <div className="deco-left">
      {/* スキャンライン */}
      <div className="deco-scanline" />

      {/* データストリーム（マトリックス風） */}
      <div className="deco-stream">
        <div className="deco-stream-col deco-stream-col-1">
          <span>01001101</span><span>壱零壱壱</span><span>00110100</span>
          <span>11010011</span><span>参零壱零</span><span>01011010</span>
          <span>N35.6762</span><span>10110001</span><span>零壱壱零</span>
          <span>E139.650</span><span>01100111</span><span>壱壱零壱</span>
          <span>00101110</span><span>伍零壱壱</span><span>11001010</span>
          <span>01001101</span><span>壱零壱壱</span><span>00110100</span>
        </div>
        <div className="deco-stream-col deco-stream-col-2">
          <span>11100010</span><span>零参壱壱</span><span>10011001</span>
          <span>N51.5074</span><span>01110100</span><span>壱零零壱</span>
          <span>W000.127</span><span>10001011</span><span>零壱零零</span>
          <span>11010110</span><span>参壱零壱</span><span>01101001</span>
          <span>10100011</span><span>壱壱零零</span><span>00111010</span>
          <span>11100010</span><span>零参壱壱</span><span>10011001</span>
        </div>
        <div className="deco-stream-col deco-stream-col-3">
          <span>10110100</span><span>壱零零壱</span><span>01010111</span>
          <span>N48.8566</span><span>11001001</span><span>零壱壱零</span>
          <span>E002.352</span><span>01110010</span><span>壱壱零壱</span>
          <span>10001110</span><span>零零壱壱</span><span>11010001</span>
          <span>00110110</span><span>壱零壱零</span><span>10101100</span>
          <span>10110100</span><span>壱零零壱</span><span>01010111</span>
        </div>
      </div>

      {/* 座標・ステータス表示 */}
      <div className="deco-status">
        <div className="deco-status-line deco-blink-slow">
          LAT: 35.6762
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '0.5s' }}>
          LON: 139.6503
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '1.2s' }}>
          STATUS: MONITORING
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '1.8s' }}>
          SIGNAL: ENCRYPTED
        </div>
        <div className="deco-status-line deco-blink-slow" style={{ animationDelay: '2.5s' }}>
          FREQ: 2.4GHz
        </div>
      </div>
    </div>
  );
}
