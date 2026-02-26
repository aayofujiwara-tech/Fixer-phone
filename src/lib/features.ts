// フィーチャーフラグ
// 各機能の表示/非表示を制御する。true にすれば復活する。
export const FEATURES = {
  /** APIキー入力・API経由シナリオ生成（上級モード） */
  API_MODE: false,
  /** PWAインストールプロンプト（バナー）を表示するか */
  PWA_INSTALL_PROMPT: false,
  /** TTS デバッグオーバーレイ（検証時のみ true） */
  TTS_DEBUG_OVERLAY: false,
} as const;
