import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LanguageProvider } from './i18n/LanguageContext'
import { FEATURES } from './lib/features'
import App from './App.tsx'

// PWAインストールプロンプト制御
// FEATURES.PWA_INSTALL_PROMPT が false の間、ブラウザネイティブの
// 「ホーム画面に追加」バナーを抑制する。true に戻せば復活する。
window.addEventListener('beforeinstallprompt', (e) => {
  if (!FEATURES.PWA_INSTALL_PROMPT) {
    e.preventDefault();
  }
});

// 開発モード: 残存Service Workerを自動解除（キャッシュ干渉防止）
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister());
  });
}

// プロダクション: SW登録のみ。更新は自然なライフサイクルに任せる。
// VitePWA の injectRegister: false により、ここで手動登録する。
//
// ★ skipWaiting + controllerchange → reload を行わない理由:
// HTMLは NetworkFirst 戦略で常にネットワークから最新版を取得する。
// JS/CSS はハッシュ付きファイル名なので、新HTMLが正しいバンドルを参照する。
// したがって SW 更新時にリロードする必要がない。
// 新SWは次回ナビゲーション（タブを閉じて再度開く等）で自然に activate する。
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
