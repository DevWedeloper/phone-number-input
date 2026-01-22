import angular from '@analogjs/astro-angular'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@maskito/angular', 'zod'],
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
        { label: 'Angular', link: '/angular' },
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
