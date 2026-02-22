import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LanguageProvider } from './i18n/LanguageContext'
import App from './App.tsx'

// 開発モード: 残存Service Workerを自動解除（キャッシュ干渉防止）
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister());
  });
}

// プロダクション: SW更新検知 → 自動リロード
// ※初回インストール時はリロード不要（hadController で判定）
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

  // 新しいSWが待機中の場合、即座にアクティブ化を促す
  navigator.serviceWorker.ready.then(registration => {
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
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
