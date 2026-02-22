// VIP（国家元首）のTTS音声パラメータ
// フィクサーとの差別化＋国ごとの個性付けに使用
export interface VipVoice {
  pitch: number;        // 声の高さ（0〜2, フィクサー: 0.45〜0.5）
  rateFactor: number;   // ユーザー設定速度への乗数（1.0 = 変更なし）
}

// 国データの型定義
export interface Country {
  id: string;
  name: string;
  nameEn: string;
  leader: string;
  leaderEn: string;
  flag: string;
  accentColor: string;
  vipVoice: VipVoice;
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
