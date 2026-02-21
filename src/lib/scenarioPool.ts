// シナリオプール（事前生成済み台本）
import type { Scenario } from '../types';

// 国別シナリオの読み込み
import { usSerious, usComedy } from './scenarios/us';
import { jpSerious, jpComedy } from './scenarios/jp';
import { cnSerious, cnComedy } from './scenarios/cn';
import { ruSerious, ruComedy } from './scenarios/ru';
import { ukSerious, ukComedy } from './scenarios/uk';
import { frSerious, frComedy } from './scenarios/fr';
import { deSerious, deComedy } from './scenarios/de';
import { krSerious, krComedy } from './scenarios/kr';
import { ilSerious, ilComedy } from './scenarios/il';
import { inSerious, inComedy } from './scenarios/in';

interface ScenarioPool {
  serious: Scenario[];
  comedy: Scenario[];
}

// 国ごとのシナリオプール（全10カ国）
const scenarioPools: Record<string, ScenarioPool> = {
  us: { serious: usSerious, comedy: usComedy },
  jp: { serious: jpSerious, comedy: jpComedy },
  cn: { serious: cnSerious, comedy: cnComedy },
  ru: { serious: ruSerious, comedy: ruComedy },
  uk: { serious: ukSerious, comedy: ukComedy },
  fr: { serious: frSerious, comedy: frComedy },
  de: { serious: deSerious, comedy: deComedy },
  kr: { serious: krSerious, comedy: krComedy },
  il: { serious: ilSerious, comedy: ilComedy },
  in: { serious: inSerious, comedy: inComedy },
};

/**
 * シナリオプールからシナリオを取得する
 * @param countryId 国ID（例: 'us'）
 * @param mood 'serious' | 'comedy'
 * @param index シナリオのインデックス（null = ランダム）
 * @returns Scenario | null（該当国のプールがなければnull）
 */
export function getScenario(countryId: string, mood: 'serious' | 'comedy', index: number | null = null): Scenario | null {
  console.log('=== POOL: getScenario ===');
  console.log('countryId:', countryId, 'mood:', mood, 'index:', index);

  const pool = scenarioPools[countryId];
  console.log('pool exists:', !!pool);
  if (!pool) return null;

  const scenarios = pool[mood];
  console.log('scenarios count:', scenarios?.length ?? 0);
  if (!scenarios || scenarios.length === 0) return null;

  if (index !== null && index >= 0 && index < scenarios.length) {
    console.log('selected index:', index, 'title:', scenarios[index].scenario_title_ja);
    return scenarios[index];
  }

  // ランダム
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  console.log('random index:', randomIndex, 'title:', scenarios[randomIndex].scenario_title_ja);
  return scenarios[randomIndex];
}

/**
 * 指定国のシナリオプールが存在するかチェック
 */
export function hasScenarioPool(countryId: string): boolean {
  return countryId in scenarioPools;
}

/**
 * シナリオのタイトル一覧を返す
 */
export function getScenarioList(countryId: string, mood: 'serious' | 'comedy'): { title_ja: string; title_en: string }[] {
  const pool = scenarioPools[countryId];
  if (!pool) return [];

  const scenarios = pool[mood];
  if (!scenarios) return [];

  return scenarios.map(s => ({
    title_ja: s.scenario_title_ja,
    title_en: s.scenario_title_en,
  }));
}
