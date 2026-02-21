export type Lang = 'ja' | 'en';

export const translations = {
  // SetupScreen
  subtitle: {
    ja: '極秘回線 // CLASSIFIED LINE',
    en: 'CLASSIFIED LINE // 極秘回線',
  },
  targetCountry: {
    ja: 'Target Country',
    en: 'Target Country',
  },
  operationMode: {
    ja: 'Operation Mode',
    en: 'Operation Mode',
  },
  serious: {
    ja: 'SERIOUS',
    en: 'SERIOUS',
  },
  seriousDesc: {
    ja: 'ガチ交渉',
    en: 'Hard Negotiation',
  },
  comedy: {
    ja: 'COMEDY',
    en: 'COMEDY',
  },
  comedyDesc: {
    ja: 'コメディ',
    en: 'Comedy',
  },
  apiKeyLabel: {
    ja: 'API Key',
    en: 'API Key',
  },
  apiKeyHint: {
    ja: 'Anthropic API Key（ローカル保存のみ）',
    en: 'Anthropic API Key (stored locally only)',
  },
  changeApiKey: {
    ja: 'API Key を変更する',
    en: 'Change API Key',
  },
  startCall: {
    ja: '通話を開始する',
    en: 'Start Call',
  },
  selectCountry: {
    ja: '国を選択してください',
    en: 'Select a country',
  },

  // CallScreen
  encryptedCall: {
    ja: 'ENCRYPTED CALL',
    en: 'ENCRYPTED CALL',
  },
  leaderSpeaking: {
    ja: '相手が発言中...',
    en: 'Counterpart speaking...',
  },
  speakJa: {
    ja: '日本語',
    en: '日本語 (JA)',
  },
  speakEn: {
    ja: 'English',
    en: 'English',
  },
  prev: {
    ja: '◀ 前へ',
    en: '◀ Prev',
  },
  next: {
    ja: '次のセリフ ▶',
    en: 'Next Line ▶',
  },
  endCallNext: {
    ja: '通話終了 ▶',
    en: 'End Call ▶',
  },
  endCall: {
    ja: '通話終了',
    en: 'End Call',
  },

  // SpeechBubble
  leaderLine: {
    ja: '相手のセリフ:',
    en: 'Their Line:',
  },
  yourLine: {
    ja: 'YOUR LINE:',
    en: 'YOUR LINE:',
  },

  autoModeOn: {
    ja: '自動進行中',
    en: 'Auto Mode',
  },
  autoModeOff: {
    ja: '手動モード',
    en: 'Manual Mode',
  },

  // CallEndScreen
  callTerminated: {
    ja: 'CALL TERMINATED',
    en: 'CALL TERMINATED',
  },
  callEnded: {
    ja: '通話終了',
    en: 'Call Ended',
  },
  callDuration: {
    ja: '通話時間',
    en: 'Duration',
  },
  scenarioLabel: {
    ja: 'シナリオ',
    en: 'Scenario',
  },
  standby: {
    ja: 'STANDBY...',
    en: 'STANDBY...',
  },
  erasing: {
    ja: 'CLASSIFIED - 機密データ消去中...',
    en: 'CLASSIFIED - Erasing classified data...',
  },
  eraseComplete: {
    ja: '✓ すべてのデータが安全に消去されました',
    en: '✓ All classified data has been securely erased',
  },
  eraseCompleteSub: {
    ja: 'All classified data has been securely erased',
    en: 'すべてのデータが安全に消去されました',
  },
  newCall: {
    ja: '新しい通話を開始',
    en: 'Start New Call',
  },

  // LoadingScreen messages
  loading1: {
    ja: '暗号化回線を確立中...',
    en: 'Establishing encrypted channel...',
  },
  loading2: {
    ja: '相手方のセキュリティを検証中...',
    en: 'Verifying counterpart security...',
  },
  loading3: {
    ja: '通訳プロトコルを起動中...',
    en: 'Initializing interpreter protocol...',
  },
  loading4: {
    ja: '回線接続完了',
    en: 'Connection established',
  },

  // App.tsx errors
  connectionUnstable: {
    ja: '回線が不安定です',
    en: 'Connection unstable',
  },
  reconnect: {
    ja: '戻る',
    en: 'Go Back',
  },
  useFallback: {
    ja: 'デモモードで通話',
    en: 'Use Demo Mode',
  },

  // Error messages
  connectionError: {
    ja: '回線が不安定です。再接続してください。',
    en: 'Connection unstable. Please reconnect.',
  },
  noApiKey: {
    ja: 'APIキーが設定されていません',
    en: 'API key is not configured',
  },
  apiCallFailed: {
    ja: 'API呼び出し失敗',
    en: 'API call failed',
  },
  scenarioGenerationFailed: {
    ja: 'シナリオの生成に失敗しました',
    en: 'Failed to generate scenario',
  },
  invalidScenarioFormat: {
    ja: '生成されたシナリオの形式が不正です',
    en: 'Generated scenario has invalid format',
  },
} as const;

export type TranslationKey = keyof typeof translations;
