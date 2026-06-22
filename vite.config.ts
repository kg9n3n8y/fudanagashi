import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/fudanagashi/';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: 'index.source.html',
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['icon.png', 'thumbnail.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,webmanifest}'],
        globIgnores: ['**/node_modules/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/fudanagashi\/torifuda\//, /^\/fudanagashi\/assets\//],
        runtimeCaching: [
          {
            urlPattern: /\/fudanagashi\/torifuda\/.+\.png$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'torifuda-images',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: '札流し',
        short_name: '札流し',
        description: '札流しを練習するためのWebアプリ',
        theme_color: '#FFFFFF',
        background_color: '#E1DAC3',
        display: 'standalone',
        scope: base,
        start_url: base,
        id: base,
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
