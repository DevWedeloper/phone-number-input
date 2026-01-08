import angular from '@analogjs/astro-angular'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@maskito/angular'],
    },
  },
  integrations: [
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
