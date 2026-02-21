import type { Country, Mood, Scenario } from '../types';
import { generateScenarioPrompt } from './prompts';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// APIキーをlocalStorageから取得・保存
export function getApiKey(): string | null {
  return localStorage.getItem('fixer-phone-api-key');
}

export function setApiKey(key: string): void {
  localStorage.setItem('fixer-phone-api-key', key);
}

// Claude APIでシナリオを生成
export async function generateScenario(
  country: Country,
  mood: Mood
): Promise<Scenario> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('APIキーが設定されていません');
  }

  const prompt = generateScenarioPrompt(country, mood);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API呼び出し失敗: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  // JSONをパース（余分なテキストがあった場合に備えて抽出）
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('シナリオの生成に失敗しました');
  }

  const scenario: Scenario = JSON.parse(jsonMatch[0]);

  // バリデーション
  if (!scenario.scenario_title_ja || !scenario.lines || scenario.lines.length < 4) {
    throw new Error('生成されたシナリオの形式が不正です');
  }

  return scenario;
}
