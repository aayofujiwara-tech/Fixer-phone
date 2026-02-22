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

// プロダクション: SW登録 + 更新検知 → 自動リロード
// VitePWA の injectRegister: false により、ここで手動登録する。
// これにより hadController ガードで初回インストール時のリロードを確実に防止できる。
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // 初回インストール（hadController === false）ではリロードしない。
    // SW更新時（hadController === true）のみリロードして新アセットを反映。
    if (hadController && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // SW登録（VitePWAが生成する registerSW.js の代わり）
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
      // 新しいSWが見つかった場合、即座にアクティブ化を促す
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新バージョンが待機中 → skipWaiting を送信して即座に切り替え
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
