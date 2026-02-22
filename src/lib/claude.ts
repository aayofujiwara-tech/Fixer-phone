import type { Country, Mood, Scenario } from '../types';
import { generateScenarioPrompt } from './prompts';
import { translations, type Lang } from '../i18n/translations';
import { safeGetItem, safeSetItem } from './storage';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const API_TIMEOUT_MS = 30_000;

// APIキーをlocalStorageから取得・保存
export function getApiKey(): string | null {
  return safeGetItem('fixer-phone-api-key');
}

export function setApiKey(key: string): void {
  safeSetItem('fixer-phone-api-key', key);
}

function getLang(): Lang {
  const saved = safeGetItem('fixer-phone-lang');
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(API_URL, {
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
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(translations.connectionError[lang]);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`${translations.apiCallFailed[lang]}: ${response.status} - ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  // JSONをパース（余分なテキストがあった場合に備えて抽出）
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(translations.scenarioGenerationFailed[lang]);
  }

  let scenario: Scenario;
  try {
    scenario = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(translations.scenarioGenerationFailed[lang]);
  }

  // バリデーション
  if (!scenario.scenario_title_ja || !scenario.scenario_title_en || !scenario.lines || scenario.lines.length < 4) {
    throw new Error(translations.invalidScenarioFormat[lang]);
  }

  for (const line of scenario.lines) {
    if (!line.ja || !line.en || !['leader', 'fixer'].includes(line.speaker)) {
      throw new Error(translations.invalidScenarioFormat[lang]);
    }
  }

  return scenario;
}
