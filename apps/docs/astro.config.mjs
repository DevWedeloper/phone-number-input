import angular from '@analogjs/astro-angular'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@maskito/angular'],
    },
  },
  integrations: [
    starlight({
      title: 'Phone Number Input',
      routeMiddleware: './src/routeData.ts',
      components: {
        Head: './src/components/Head.astro',
        ContentPanel: './src/components/ContentPanel.astro',
      },
      customCss: [
        './src/styles/global.css',
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/DevWedeloper/phone-number-input',
        },
      ],
      sidebar: [
        { label: 'Getting Started', link: '/getting-started' },
        { label: 'Core', link: '/core/overview' },
        { label: 'Angular', link: '/angular/overview' },
      ],
      plugins: [
        starlightThemeBlack({}),
      ],
    }),
    angular({
      vite: {
        transformFilter: (_code, id) => {
          return id.includes('src/components/angular')
        },
      },
    }),
    react({
      exclude: ['src/components/angular/**'],
    }),
  ],
})
