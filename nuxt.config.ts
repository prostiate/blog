// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-23',
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/projects', '/blog', '/about', '/logo', '/rss.xml']
    }
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (nitroConfig.prerender) {
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
        const fs = await import('node:fs')
        const path = await import('node:path')
        const blogDir = path.resolve(process.cwd(), 'content/blog')
        if (fs.existsSync(blogDir)) {
          const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))
          blogFiles.forEach((file) => {
            nitroConfig.prerender!.routes!.push(`/blog/${file.replace(/\.md$/, '')}`)
          })
        }
        const projDir = path.resolve(process.cwd(), 'content/projects')
        if (fs.existsSync(projDir)) {
          const projFiles = fs.readdirSync(projDir).filter((f) => f.endsWith('.md'))
          projFiles.forEach((file) => {
            nitroConfig.prerender!.routes!.push(`/projects/${file.replace(/\.md$/, '')}`)
          })
        }
      }
    }
  },

  site: {
    url: 'https://irfankurniawan.com',
    name: 'Muhammad Irfan Kurniawan - Senior Full Stack Engineer'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: 'scroll-smooth'
      },
      title: 'Muhammad Irfan Kurniawan - Full Stack Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Senior Full Stack Engineer based in Jakarta. Specializing in high-performance frontend architecture, local-first systems, and resilient infrastructure.'
        },
        { name: 'theme-color', content: '#FAF9F5' },
        { property: 'og:site_name', content: 'Muhammad Irfan Kurniawan' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Muhammad Irfan Kurniawan - Full Stack Engineer' },
        {
          property: 'og:description',
          content:
            'Senior Full Stack Engineer based in Jakarta. Driven by relentless curiosity, sustained by perseverance.'
        },
        { property: 'og:url', content: 'https://irfankurniawan.com' },
        {
          property: 'og:image',
          content: 'https://irfankurniawan.com/assets/logo/logo-lockup-dark.png'
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Muhammad Irfan Kurniawan - Full Stack Engineer' },
        {
          name: 'twitter:description',
          content:
            'Senior Full Stack Engineer based in Jakarta. Driven by relentless curiosity, sustained by perseverance.'
        },
        {
          name: 'twitter:image',
          content: 'https://irfankurniawan.com/assets/logo/logo-lockup-dark.png'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/assets/logo/favicon-32.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css']
})
