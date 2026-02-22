import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // PWAはプロダクションビルドのみ有効（開発中のService Workerキャッシュ干渉を防止）
    ...(mode === 'production' ? [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Fixer Phone - 極秘回線',
          short_name: 'FixerPhone',
          description: '国際フィクサー体験アプリ',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#0a0a0f',
          theme_color: '#00ff88',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          // HTMLは事前キャッシュから除外（NavigationRouteで制御）
          globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
          // ナビゲーション（HTML）はNetworkFirst — 常に最新を取得、オフライン時のみキャッシュ使用
          navigateFallback: undefined,
          runtimeCaching: [
            {
              // HTMLナビゲーション — NetworkFirst
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // API呼び出し — NetworkFirst
              urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 5 },
              },
            },
          ],
        },
      }),
    ] : []),
  ],
}))
