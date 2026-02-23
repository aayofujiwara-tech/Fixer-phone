#!/usr/bin/env npx tsx
/**
 * FIXER PHONE — シナリオデータ健全性チェック
 *
 * 全12カ国 × 6シナリオ（serious 3 + comedy 3）= 72シナリオを検証する。
 *
 * 使い方:
 *   npx tsx scripts/check-scenarios.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== 定数 ==========
const COUNTRIES = ['us', 'jp', 'cn', 'ru', 'uk', 'fr', 'de', 'kr', 'il', 'in', 'sa', 'va'];
const MOODS = ['serious', 'comedy'] as const;
const EXPECTED_SCENARIOS_PER_MOOD = 3;
const EXPECTED_LINES = 10; // 5往復
const DATA_DIR = path.resolve(__dirname, '../src/data/scenarios');

// テキスト長の閾値
const MIN_TEXT_LEN = 5;   // 極端に短い
const MAX_TEXT_LEN = 500;  // 極端に長い

// ========== 型 ==========
interface Line {
  speaker: string;
  ja: string;
  en: string;
}

interface Scenario {
  scenario_title_ja?: string;
  scenario_title_en?: string;
  lines?: Line[];
}

interface ScenarioFile {
  serious?: Scenario[];
  comedy?: Scenario[];
}

// ========== チェック ==========
interface Issue {
  level: 'ERROR' | 'WARN';
  country: string;
  mood?: string;
  scenario?: number;
  line?: number;
  message: string;
}

const issues: Issue[] = [];
const allIds = new Set<string>();

function addIssue(level: Issue['level'], country: string, message: string, opts?: { mood?: string; scenario?: number; line?: number }) {
  issues.push({ level, country, mood: opts?.mood, scenario: opts?.scenario, line: opts?.line, message });
}

// 日本語テキストに英語が大量に含まれている（言語逆転）チェック
function looksEnglish(text: string): boolean {
  const ascii = text.replace(/[\s\d.,!?'"(){}\[\]:;\/\\@#$%^&*+=<>~`_\-—–…。、！？「」『』（）【】]/g, '');
  if (ascii.length === 0) return false;
  const latinCount = (ascii.match(/[a-zA-Z]/g) || []).length;
  return latinCount / ascii.length > 0.7;
}

function looksJapanese(text: string): boolean {
  const cleaned = text.replace(/[\s\d.,!?'"(){}\[\]:;\/\\@#$%^&*+=<>~`_\-—–…。、！？「」『』（）【】]/g, '');
  if (cleaned.length === 0) return false;
  const jaCount = (cleaned.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g) || []).length;
  return jaCount / cleaned.length > 0.3;
}

// メイン検証
let totalScenarios = 0;

for (const countryId of COUNTRIES) {
  const filePath = path.join(DATA_DIR, `${countryId}.json`);

  // ファイル存在チェック
  if (!fs.existsSync(filePath)) {
    addIssue('ERROR', countryId, `ファイルが存在しない: ${filePath}`);
    continue;
  }

  let data: ScenarioFile;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    addIssue('ERROR', countryId, `JSONパース失敗: ${(e as Error).message}`);
    continue;
  }

  for (const mood of MOODS) {
    const scenarios = data[mood];

    // mood配列の存在チェック
    if (!scenarios || !Array.isArray(scenarios)) {
      addIssue('ERROR', countryId, `"${mood}" 配列が存在しない`, { mood });
      continue;
    }

    // シナリオ数チェック
    if (scenarios.length !== EXPECTED_SCENARIOS_PER_MOOD) {
      addIssue('ERROR', countryId, `"${mood}" シナリオ数: ${scenarios.length} (期待値: ${EXPECTED_SCENARIOS_PER_MOOD})`, { mood });
    }

    scenarios.forEach((scenario, sIdx) => {
      totalScenarios++;
      const scenarioId = `${countryId}_${mood}_${sIdx}`;

      // 重複IDチェック
      if (allIds.has(scenarioId)) {
        addIssue('ERROR', countryId, `重複ID: ${scenarioId}`, { mood, scenario: sIdx });
      }
      allIds.add(scenarioId);

      // タイトルチェック
      if (!scenario.scenario_title_ja || scenario.scenario_title_ja.trim() === '') {
        addIssue('ERROR', countryId, `scenario_title_ja が空`, { mood, scenario: sIdx });
      }
      if (!scenario.scenario_title_en || scenario.scenario_title_en.trim() === '') {
        addIssue('ERROR', countryId, `scenario_title_en が空`, { mood, scenario: sIdx });
      }

      // lines チェック
      if (!scenario.lines || !Array.isArray(scenario.lines)) {
        addIssue('ERROR', countryId, `lines 配列が存在しない`, { mood, scenario: sIdx });
        return;
      }

      if (scenario.lines.length !== EXPECTED_LINES) {
        addIssue('ERROR', countryId, `セリフ数: ${scenario.lines.length} (期待値: ${EXPECTED_LINES})`, { mood, scenario: sIdx });
      }

      scenario.lines.forEach((line, lIdx) => {
        // speaker チェック（偶数=leader, 奇数=fixer）
        const expectedSpeaker = lIdx % 2 === 0 ? 'leader' : 'fixer';
        if (line.speaker !== expectedSpeaker) {
          addIssue('ERROR', countryId, `speaker が不正: "${line.speaker}" (期待値: "${expectedSpeaker}")`, { mood, scenario: sIdx, line: lIdx });
        }

        // ja テキストチェック
        if (!line.ja || line.ja.trim() === '') {
          addIssue('ERROR', countryId, `ja テキストが空`, { mood, scenario: sIdx, line: lIdx });
        } else {
          if (line.ja.length < MIN_TEXT_LEN) {
            addIssue('WARN', countryId, `ja テキストが極端に短い (${line.ja.length}文字): "${line.ja}"`, { mood, scenario: sIdx, line: lIdx });
          }
          if (line.ja.length > MAX_TEXT_LEN) {
            addIssue('WARN', countryId, `ja テキストが極端に長い (${line.ja.length}文字)`, { mood, scenario: sIdx, line: lIdx });
          }
          if (looksEnglish(line.ja)) {
            addIssue('WARN', countryId, `ja テキストが英語のように見える: "${line.ja.slice(0, 60)}..."`, { mood, scenario: sIdx, line: lIdx });
          }
        }

        // en テキストチェック
        if (!line.en || line.en.trim() === '') {
          addIssue('ERROR', countryId, `en テキストが空`, { mood, scenario: sIdx, line: lIdx });
        } else {
          if (line.en.length < MIN_TEXT_LEN) {
            addIssue('WARN', countryId, `en テキストが極端に短い (${line.en.length}文字): "${line.en}"`, { mood, scenario: sIdx, line: lIdx });
          }
          if (line.en.length > MAX_TEXT_LEN) {
            addIssue('WARN', countryId, `en テキストが極端に長い (${line.en.length}文字)`, { mood, scenario: sIdx, line: lIdx });
          }
          if (looksJapanese(line.en)) {
            addIssue('WARN', countryId, `en テキストに日本語が多く含まれている: "${line.en.slice(0, 60)}..."`, { mood, scenario: sIdx, line: lIdx });
          }
        }
      });
    });
  }
}

// ========== レポート ==========
console.log('='.repeat(60));
console.log('FIXER PHONE — シナリオデータ健全性チェック');
console.log('='.repeat(60));
console.log(`\n検査対象: ${COUNTRIES.length} カ国`);
console.log(`検出シナリオ数: ${totalScenarios} / 72 (期待値)`);
console.log();

const errors = issues.filter(i => i.level === 'ERROR');
const warns = issues.filter(i => i.level === 'WARN');

if (errors.length === 0 && warns.length === 0) {
  console.log('✅ 全チェック合格！問題は見つかりませんでした。\n');
} else {
  if (errors.length > 0) {
    console.log(`❌ エラー: ${errors.length} 件`);
    for (const e of errors) {
      const loc = [e.country, e.mood, e.scenario !== undefined ? `#${e.scenario}` : '', e.line !== undefined ? `L${e.line}` : ''].filter(Boolean).join('/');
      console.log(`  [ERROR] ${loc}: ${e.message}`);
    }
    console.log();
  }

  if (warns.length > 0) {
    console.log(`⚠️  警告: ${warns.length} 件`);
    for (const w of warns) {
      const loc = [w.country, w.mood, w.scenario !== undefined ? `#${w.scenario}` : '', w.line !== undefined ? `L${w.line}` : ''].filter(Boolean).join('/');
      console.log(`  [WARN]  ${loc}: ${w.message}`);
    }
    console.log();
  }
}

// 終了コード
process.exit(errors.length > 0 ? 1 : 0);
