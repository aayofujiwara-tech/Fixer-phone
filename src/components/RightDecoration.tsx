// 右装飾エリア: レーダー風 + 音声波形 + 暗号文スクロール
// CSSアニメーションのみで実装、pointer-events: none

export function RightDecoration() {
  return (
    <div className="deco-right">
      {/* レーダー風アニメーション */}
      <div className="deco-radar-wrap">
        <div className="deco-radar">
          <div className="deco-radar-circle deco-radar-circle-1" />
          <div className="deco-radar-circle deco-radar-circle-2" />
          <div className="deco-radar-circle deco-radar-circle-3" />
          <div className="deco-radar-circle deco-radar-circle-4" />
          <div className="deco-radar-glow" />
          <div className="deco-radar-sweep" />
          <div className="deco-radar-dot deco-radar-dot-1" />
          <div className="deco-radar-dot deco-radar-dot-2" />
          <div className="deco-radar-dot deco-radar-dot-3" />
          <div className="deco-radar-dot deco-radar-dot-4" />
          <div className="deco-radar-dot deco-radar-dot-5" />
        </div>
      </div>

      {/* 音声波形風 */}
      <div className="deco-waveform-wrap">
        <div className="deco-waveform-label">AUDIO INTERCEPT ACTIVE</div>
        <div className="deco-waveform">
          {Array.from({ length: 36 }, (_, i) => (
            <div
              key={i}
              className="deco-waveform-bar"
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      </div>

      {/* 暗号文スクロール */}
      <div className="deco-cipher-wrap">
        <div className="deco-cipher-label">DECRYPTION IN PROGRESS...</div>
        <div className="deco-cipher">
          <div className="deco-cipher-scroll">
            <span>4F 50 45 52 41 54 49 4F</span>
            <span>6E 20 <em>46</em> 49 58 45 <em>52</em> 20</span>
            <span>50 48 4F 4E <em>45</em> 20 53 45</span>
            <span>43 55 52 <em>45</em> 20 4C 49 4E</span>
            <span>A3 B7 <em>C9</em> D4 E8 F1 02 3A</span>
            <span>7B 2F <em>8E</em> 91 A5 B3 C7 DA</span>
            <span>E4 F0 12 <em>26</em> 3B 4F 53 67</span>
            <span>8C 9A AE <em>B2</em> C6 D3 E7 FA</span>
            <span>53 45 43 <em>55</em> 52 45 20 43</span>
            <span>48 41 4E <em>4E</em> 45 4C 20 41</span>
            <span>4F 50 45 52 41 54 49 4F</span>
            <span>6E 20 <em>46</em> 49 58 45 <em>52</em> 20</span>
            <span>50 48 4F 4E <em>45</em> 20 53 45</span>
            <span>43 55 52 <em>45</em> 20 4C 49 4E</span>
            <span>A3 B7 <em>C9</em> D4 E8 F1 02 3A</span>
            <span>7B 2F <em>8E</em> 91 A5 B3 C7 DA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
