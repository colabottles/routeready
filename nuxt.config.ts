// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  typescript: {
    strict: false,
    typeCheck: false
  },
  imports: {
    autoImport: true
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'RouteReady',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'RouteReady - Route management and delivery optimization platform' }
      ]
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils'
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/theme.css',
  ],
  // Make sure you have this if using Better Auth
  nitro: {
    experimental: {
      openAPI: true
    }
  }
})