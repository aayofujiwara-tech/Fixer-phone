// 国データの型定義
export interface Country {
  id: string;
  name: string;
  nameEn: string;
  leader: string;
  leaderEn: string;
  flag: string;
  accentColor: string;
}

// 台本の1行分
export interface ScenarioLine {
  speaker: 'leader' | 'fixer';
  ja: string;
  en: string;
}

// 生成されたシナリオ全体
export interface Scenario {
  scenario_title_ja: string;
  scenario_title_en: string;
  lines: ScenarioLine[];
}

// アプリの画面状態
export type AppScreen = 'setup' | 'loading' | 'call' | 'callEnd';

// トーン（雰囲気）
export type Mood = 'serious' | 'comedy';

// 通話モード
export type CallMode = 'auto' | 'practice';

// アプリの状態
export interface AppState {
  screen: AppScreen;
  selectedCountry: Country | null;
  mood: Mood;
  scenario: Scenario | null;
  callDuration: number;
}
