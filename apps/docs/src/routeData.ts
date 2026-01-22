import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const { id, sidebar } = context.locals.starlightRoute

  const normalize = (path: string) => path.replace(/^\/+/, '')

  const currentSlug = normalize(id)

  sidebar.forEach((link) => {
    if (link.type === 'link') {
      const linkHref = normalize(link.href)
      const firstSegment = linkHref.split('/')[0]

      link.isCurrent = currentSlug === firstSegment || currentSlug.startsWith(`${firstSegment}`)
    }
  })
})
