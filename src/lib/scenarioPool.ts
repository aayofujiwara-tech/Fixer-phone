// シナリオプール（事前生成済み台本）
import type { Scenario } from '../types';

// 国別シナリオの読み込み（JSONファイルから）
import usData from '../data/scenarios/us.json';
import jpData from '../data/scenarios/jp.json';
import cnData from '../data/scenarios/cn.json';
import ruData from '../data/scenarios/ru.json';
import ukData from '../data/scenarios/uk.json';
import frData from '../data/scenarios/fr.json';
import deData from '../data/scenarios/de.json';
import krData from '../data/scenarios/kr.json';
import ilData from '../data/scenarios/il.json';
import inData from '../data/scenarios/in.json';
import saData from '../data/scenarios/sa.json';
import vaData from '../data/scenarios/va.json';

interface ScenarioPool {
  serious: Scenario[];
  comedy: Scenario[];
}

// 国ごとのシナリオプール（全12カ国）
const scenarioPools: Record<string, ScenarioPool> = {
  us: usData as unknown as ScenarioPool,
  jp: jpData as unknown as ScenarioPool,
  cn: cnData as unknown as ScenarioPool,
  ru: ruData as unknown as ScenarioPool,
  uk: ukData as unknown as ScenarioPool,
  fr: frData as unknown as ScenarioPool,
  de: deData as unknown as ScenarioPool,
  kr: krData as unknown as ScenarioPool,
  il: ilData as unknown as ScenarioPool,
  in: inData as unknown as ScenarioPool,
  sa: saData as unknown as ScenarioPool,
  va: vaData as unknown as ScenarioPool,
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
