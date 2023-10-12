import packageInfo from './package.json'

// APP_MODEを定義し環境を分類する
console.log('ENV: ', process.env.APP_MODE)

/** process.env.APP_MODEを参照 */
const coreEnv = {
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: 'src',
  ssr: false,
  // call from useRuntimeConfig
  runtimeConfig: {
    public: {
      appVersion: packageInfo.version,
      rootPath: '/'
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  plugins: [
  ],

  postcss: {
    plugins: {
      tailwindcss: {}
    }
  },

  modules: [
    '@nuxtjs/device'
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
  ],

  typescript: {
    strict: true
  }
})
