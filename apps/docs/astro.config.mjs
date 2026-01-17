import angular from '@analogjs/astro-angular'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig } from 'astro/config'
import { ion } from 'starlight-ion-theme'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@maskito/angular'],
    },
  },
  integrations: [
    starlight({
      title: 'My delightful docs site',
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
        { label: 'Angular', link: '/angular' },
      ],
      plugins: [ion()],
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
