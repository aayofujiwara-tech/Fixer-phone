import type { Country, Mood } from '../types';

// シナリオ生成プロンプト
export function generateScenarioPrompt(
  country: Country,
  mood: Mood
): string {
  return `あなたは映画の脚本家です。以下の設定で「国際フィクサーと${country.name}の${country.leader}の極秘電話会話」の台本を作成してください。

## 設定
- 相手: ${country.name}の${country.leader}（${country.nameEn} ${country.leaderEn}）
- トーン: ${mood === 'serious' ? '深刻で緊迫感のある国際交渉。リアルな政治・外交用語を使用。' : 'コメディ。くだらないけど本人たちは真剣。シュールな状況設定。'}
- フィクサー（ユーザー）は冷静沈着で、すべてをコントロールしている雰囲気で話す
- ${mood === 'serious' ? 'シナリオ例：停戦交渉、経済制裁、機密情報、国境紛争など' : 'シナリオ例：国宝レシピの返還、宇宙人対応、世界一まずい料理の廃絶条約など'}

## 出力形式（必ずこのJSON形式で出力）
{
  "scenario_title_ja": "シナリオタイトル（日本語）",
  "scenario_title_en": "Scenario Title (English)",
  "lines": [
    {
      "speaker": "leader",
      "ja": "相手のセリフ（日本語）",
      "en": "Their line (English)"
    },
    {
      "speaker": "fixer",
      "ja": "フィクサーのセリフ（日本語）",
      "en": "Fixer's line (English)"
    }
  ]
}

## ルール
- linesは必ず leader → fixer の交互で、合計12〜16行（6〜8往復）
- leaderのセリフから始めること
- fixerのセリフは堂々として自信に満ちた口調
- leaderはfixerを頼りにしている感じ
- 各セリフは1〜3文程度（読み上げに適した長さ）
- 会話は起承転結がある（問題提起→議論→解決策→締め）
- 実在の人物名は使わず、役職名で呼ぶこと（「閣下」「Mr. President」等）
- JSONのみ出力。説明文やマークダウンは不要`;
}
