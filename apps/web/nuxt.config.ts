import { faL } from '@fortawesome/free-solid-svg-icons'
import packageInfo from './package.json'

// APP_MODEを定義し環境を分類する
console.log('ENV: ', process.env.APP_MODE)

/** process.env.APP_MODEを参照 */
const coreEnv = {
  'dev-inmemory': '@/plugins/core/inmemory-infra',
  'dev-emulator': '@/plugins/core/firebase-local-infra',
  'dev-storage': '@/plugins/core/web-storage-infra',
  'production': '@/plugins/core/firebase-production-infra'
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: 'src',
  ssr: false,
  // TIPS: pluginsを読み込み中に表示するローディング
  spaLoadingTemplate: true,
  // call from useRuntimeConfig
  runtimeConfig: {
    public: {
      appVersion: packageInfo.version,
      rootPath: '/today/list'
    }
  },
  app: {
    head: {
      title: 'what-to-do-today',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'robots', name: 'robots', content: 'noindex' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: "48x48" },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: "any" },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }
      ]
    }
  },

  // TIPS: 記載順に読み込まれる
  plugins: [
    // @ts-ignore
    { src: coreEnv[process.env.APP_MODE], mode: 'client' },
    { src: '@/plugins/app/auth', mode: 'client' },
  ],

  postcss: {
    plugins: {
      tailwindcss: {}
    }
  },

  modules: [
    '@nuxtjs/device',
    '@vite-pwa/nuxt'
  ],

  dir: {
    layouts: "layouts",
    pages: "pages",
    assets: "assets",
    public: "public",
    static: "public",
    middleware: "middleware",
    modules: "modules",
    plugins: "plugins",
  },

  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/common.css',
    '@/assets/css/dialog.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  typescript: {
    strict: true
  },

  // @ts-ignore
  pwa: {
    // registerType: 'autoUpdate',
    manifest: {
      name: 'what-to-do-today',
      short_name: 'what-to-do-today',
      display: 'standalone',
      lang: 'ja',
      theme_color: 'green',
      icons: [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,vue,ts}'],
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true, // true: ローカルでPWAインストール可
      suppressWarnings: true,
      // navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  }
})
