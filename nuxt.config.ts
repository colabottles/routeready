export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  typescript: {
    strict: false,
    typeCheck: false
  },
  ssr: false,
  imports: {
    autoImport: true
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'RouteReady',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'RouteReady - Route management and maintenance optimization platform' }
      ]
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/theme.css',
  ],
  runtimeConfig: {
    // Server only
    orsApiKey: process.env.ORS_API_KEY || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    databaseUrl: process.env.DATABASE_URL || '',
    betterAuthSecret: process.env.BETTER_AUTH_SECRET || '',
    betterAuthUrl: process.env.BETTER_AUTH_URL || '',
    // Public (exposed to client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    }
  },
  nitro: {
    experimental: {
      openAPI: true
    },
    database: {
      default: {
        connector: 'postgresql',
        options: {
          url: process.env.DATABASE_URL
        }
      }
    }
  },
  vite: {
  optimizeDeps: {
    include: [
      '@vue/devtools-core',
      '@vue/devtools-kit',
      'better-auth/vue',
      '@supabase/supabase-js',
    ]
  }
}
})