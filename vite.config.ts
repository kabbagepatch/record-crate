import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      id: 'record-crate',
      name: 'Record Crate',
      short_name: 'Records',
      description: 'Track your Vinyl Activity and Catalog',
      theme_color: '#e2c6a7',
      background_color: '#e2c6a7',
      icons: [
        {
          src: '/icon-transparent.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512x512-small.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      screenshots: [
        {
          'src': 'screenshot-mobile.png',
          'sizes': '1080x2152',
          'form_factor': 'narrow',
          'type': 'image/png',
          'label': 'Record Crate'
        }
      ],
      orientation: 'portrait',
      categories: ['music', 'lifestyle', 'utilities'],
      dir: 'ltr',
      shortcuts: [
        {
          name: 'Activity',
          description: 'View your turntable activity',
          url: '/activity',
        }
      ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      navigateFallbackDenylist: [
        /^\/\.well-known\//,
      ]
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})