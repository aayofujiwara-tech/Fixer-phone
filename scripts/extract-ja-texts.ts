#!/usr/bin/env npx tsx
/**
 * 全シナリオから日本語テキストを抽出し標準出力に出力するユーティリティ
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COUNTRIES = ['us', 'jp', 'cn', 'ru', 'uk', 'fr', 'de', 'kr', 'il', 'in', 'sa', 'va'];
const MOODS = ['serious', 'comedy'] as const;
const DATA_DIR = path.resolve(__dirname, '../src/data/scenarios');

for (const countryId of COUNTRIES) {
  const filePath = path.join(DATA_DIR, `${countryId}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const mood of MOODS) {
    const scenarios = data[mood] || [];
    scenarios.forEach((scenario: any, sIdx: number) => {
      console.log(`\n=== ${countryId.toUpperCase()} / ${mood} / #${sIdx}: ${scenario.scenario_title_ja} ===`);
      for (const line of scenario.lines) {
        console.log(line.ja);
      }
    });
  }
}
