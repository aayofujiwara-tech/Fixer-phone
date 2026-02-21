import type { Country, Mood, Scenario } from '../types';
import { generateScenarioPrompt } from './prompts';
import { translations, type Lang } from '../i18n/translations';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// APIキーをlocalStorageから取得・保存
export function getApiKey(): string | null {
  return localStorage.getItem('fixer-phone-api-key');
}

export function setApiKey(key: string): void {
  localStorage.setItem('fixer-phone-api-key', key);
}

function getLang(): Lang {
  const saved = localStorage.getItem('fixer-phone-lang');
  return saved === 'en' ? 'en' : 'ja';
}

// Claude APIでシナリオを生成
export async function generateScenario(
  country: Country,
  mood: Mood
): Promise<Scenario> {
  const apiKey = getApiKey();
  const lang = getLang();
  if (!apiKey) {
    throw new Error(translations.noApiKey[lang]);
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
    throw new Error(`${translations.apiCallFailed[lang]}: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  // JSONをパース（余分なテキストがあった場合に備えて抽出）
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(translations.scenarioGenerationFailed[lang]);
  }

  const scenario: Scenario = JSON.parse(jsonMatch[0]);

  // バリデーション
  if (!scenario.scenario_title_ja || !scenario.lines || scenario.lines.length < 4) {
    throw new Error(translations.invalidScenarioFormat[lang]);
  }

  return scenario;
}
