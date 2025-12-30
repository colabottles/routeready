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