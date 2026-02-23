import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onClose: () => void;
}

export function AboutPage({ onClose }: Props) {
  const { lang } = useLanguage();
  const ja = lang === 'ja';

  return (
    <div className="fixed inset-0 z-50 bg-dark/98 backdrop-blur-sm animate-fade-in flex flex-col">
      {/* ヘッダー */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <div className="font-mono text-accent text-sm tracking-wider">
          {ja ? 'BRIEFING // ブリーフィング' : 'BRIEFING // INFO'}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs font-mono text-gray-400 border border-gray-700 rounded hover:text-white hover:border-gray-500 transition-colors"
        >
          {ja ? '✕ 閉じる' : '✕ CLOSE'}
        </button>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-6 text-sm leading-relaxed">

          {/* 1. コメディ/エンタメ宣言 */}
          <div className="border border-yellow-500/40 bg-yellow-500/5 rounded-lg px-4 py-3">
            <div className="text-yellow-400 font-mono text-xs tracking-wider mb-1">
              {ja ? '// NOTICE' : '// NOTICE'}
            </div>
            <p className="text-yellow-300/90 text-sm">
              {ja
                ? 'このアプリはコメディ／エンターテインメント目的で制作されたフィクション作品です。'
                : 'This app is a comedy / entertainment fiction product.'}
            </p>
          </div>

          {/* 2. アプリ名とコンセプト */}
          <section>
            <h2 className="about-heading">FIXER PHONE</h2>
            <p className="text-accent/70 font-mono text-xs tracking-widest mb-2">
              {ja ? '極秘回線 // CLASSIFIED LINE' : 'CLASSIFIED LINE // 極秘回線'}
            </p>
            <p className="text-gray-300">
              {ja
                ? 'あなたは世界を裏で動かす「フィクサー」。各国の首脳から極秘回線で直接電話がかかってくる——そんな設定の外交ロールプレイアプリです。'
                : 'You are a "Fixer" — a behind-the-scenes power broker. World leaders call you directly on a classified line. This is a diplomatic role-play app built around that premise.'}
            </p>
          </section>

          {/* 3. 遊び方 */}
          <section>
            <h2 className="about-heading">{ja ? 'HOW TO PLAY // 遊び方' : 'HOW TO PLAY'}</h2>
            <ol className="list-none space-y-1.5 text-gray-300">
              <li className="flex gap-2">
                <span className="text-accent font-mono text-xs shrink-0 mt-0.5">01</span>
                <span>{ja ? '通話相手の国を選択' : 'Select a target country'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-mono text-xs shrink-0 mt-0.5">02</span>
                <span>{ja ? 'オペレーションモード（SERIOUS / COMEDY）を選択' : 'Choose operation mode (SERIOUS / COMEDY)'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-mono text-xs shrink-0 mt-0.5">03</span>
                <span>{ja ? 'シナリオを選択（またはランダム）' : 'Pick a scenario (or go random)'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-mono text-xs shrink-0 mt-0.5">04</span>
                <span>{ja ? '通話モード（AUTO / PRACTICE）を選択して通話開始' : 'Select call mode (AUTO / PRACTICE) and start the call'}</span>
              </li>
            </ol>
          </section>

          {/* 4. モード説明 */}
          <section>
            <h2 className="about-heading">{ja ? 'CALL MODES // 通話モード' : 'CALL MODES'}</h2>
            <div className="space-y-3">
              <div className="border border-gray-700 rounded-lg px-4 py-3">
                <div className="text-accent font-mono text-xs font-bold mb-1">▶ AUTO</div>
                <p className="text-gray-300">
                  {ja
                    ? '全自動進行。相手の発言も自分のセリフも自動で読み上げられ、通話が進行します。シャドーイングに最適。'
                    : 'Fully automatic. Both the counterpart\'s lines and your lines are read aloud automatically. Ideal for shadowing practice.'}
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg px-4 py-3">
                <div className="text-accent font-mono text-xs font-bold mb-1">🎙 PRACTICE</div>
                <p className="text-gray-300">
                  {ja
                    ? '自分のセリフが表示されたら、声に出して読む練習モード。読み終えたら「次へ」で進行します。'
                    : 'When your line appears, practice reading it aloud. Tap "Next" when you\'re done to advance.'}
                </p>
              </div>
            </div>
          </section>

          {/* 5. おすすめの遊び方 */}
          <section>
            <h2 className="about-heading">{ja ? 'RECOMMENDED // おすすめの遊び方' : 'RECOMMENDED PLAY'}</h2>
            <div className="border border-accent/30 bg-accent/5 rounded-lg px-4 py-3 space-y-2">
              <div className="flex gap-2 text-gray-300">
                <span className="text-accent font-mono text-xs shrink-0 mt-0.5">STEP 1</span>
                <span>{ja
                  ? 'まず PRACTICE モードでセリフを声に出して練習する'
                  : 'First, practice reading lines aloud in PRACTICE mode'}</span>
              </div>
              <div className="flex gap-2 text-gray-300">
                <span className="text-accent font-mono text-xs shrink-0 mt-0.5">STEP 2</span>
                <span>{ja
                  ? 'その後 AUTO モードで同じシナリオをシャドーイングし、フィクサー感を味わう'
                  : 'Then run the same scenario in AUTO mode and shadow along to feel like a true Fixer'}</span>
              </div>
            </div>
          </section>

          {/* 6. 特徴 */}
          <section>
            <h2 className="about-heading">{ja ? 'FEATURES // 特徴' : 'FEATURES'}</h2>
            <ul className="space-y-1.5 text-gray-300">
              <li className="flex gap-2">
                <span className="text-accent/70 shrink-0">—</span>
                <span>{ja ? 'バイリンガル対応（日本語 / English 全セリフ併記）' : 'Bilingual support (Japanese / English for all lines)'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent/70 shrink-0">—</span>
                <span>{ja ? '12カ国 × 各6シナリオ = 72シナリオ収録' : '12 countries × 6 scenarios each = 72 scenarios'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent/70 shrink-0">—</span>
                <span>{ja ? 'TTS（テキスト読み上げ）対応 — 速度調整可能' : 'TTS (Text-to-Speech) with adjustable speed'}</span>
              </li>
            </ul>
          </section>

          {/* 7. SPEAKER / STEALTH */}
          <section>
            <h2 className="about-heading">{ja ? 'AUDIO MODES // 音声モード' : 'AUDIO MODES'}</h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="text-green-400 font-mono text-xs font-bold">SPEAKER</span>
                {' — '}
                {ja ? '通常音量で再生。スピーカーやヘッドホンでの使用向け。' : 'Normal volume playback. For speakers or headphones.'}
              </p>
              <p>
                <span className="text-gray-400 font-mono text-xs font-bold">STEALTH</span>
                {' — '}
                {ja ? '小音量で再生。公共の場や深夜の使用向け。' : 'Low volume playback. For public spaces or late-night use.'}
              </p>
            </div>
          </section>

          {/* 8. 全ランダム */}
          <section>
            <h2 className="about-heading">{ja ? 'ALL RANDOM // 全ランダム' : 'ALL RANDOM'}</h2>
            <p className="text-gray-300">
              {ja
                ? '「全ランダム — 極秘任務」ボタンを押すと、国・モード・シナリオがすべて自動で選定されます。どの国のどんなシナリオが来るかわからない緊張感を楽しめます。'
                : 'Tap "ALL RANDOM — Classified Mission" to auto-select country, mode, and scenario. Enjoy the thrill of not knowing which country or situation you\'ll face.'}
            </p>
          </section>

          {/* 9. 免責事項 */}
          <div className="border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3 mt-4">
            <div className="text-red-400 font-mono text-xs tracking-wider mb-1">
              {ja ? '// DISCLAIMER — 免責事項' : '// DISCLAIMER'}
            </div>
            <p className="text-red-300/80 text-xs leading-relaxed">
              {ja
                ? 'このアプリに登場するすべてのシナリオ、会話、キャラクターはフィクションです。実在の人物、団体、国家の実際の行動や発言とは一切関係ありません。'
                : 'All scenarios, dialogues, and characters in this app are entirely fictional. They bear no relation to the actual actions or statements of any real individuals, organizations, or nations.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
