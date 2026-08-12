import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'LIFE//SAVE — 人生存档系统',
          short_name: 'LIFE//SAVE',
          description: '你的现实人生，也值得拥有存档界面。',
          theme_color: '#090b18',
          background_color: '#090b18',
          display: 'standalone',
          orientation: 'portrait-primary',
          icons: [
            { src: 'pwa-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
            { src: 'pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
        },
        workbox: { navigateFallback: 'index.html', globPatterns: ['**/*.{js,css,html,svg,webp,png}'] }
      })
    ],
    build: { sourcemap: false, assetsInlineLimit: 4096 },
  }
})
