import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const { id, sidebar } = context.locals.starlightRoute

  const normalize = (path: string) => path.replace(/^\/+/, '')

  const currentSlug = normalize(id)

  const markCurrent = (items: typeof sidebar) => {
    items.forEach((item) => {
      if (item.type === 'link' && item.href) {
        const linkHref = normalize(item.href)
        const firstSegment = linkHref.split('/')[0]

        item.isCurrent = currentSlug === firstSegment || currentSlug.startsWith(`${firstSegment}`)
      }

      if (item.type === 'group' && item.entries) {
        markCurrent(item.entries)
      }
    })
  }

  markCurrent(sidebar)
})
