import type { MaskitoPlugin } from '@maskito/core'
import { maskitoUpdateElement } from '@maskito/core'

export function applyPrefixInitially(prefix: string): MaskitoPlugin {
  let hasRun = false

  return (element) => {
    if (!hasRun && !element.value.startsWith(prefix)) {
      maskitoUpdateElement(element, prefix + element.value)
      hasRun = true
    }
  }
}
