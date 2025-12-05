import type { MaskitoPlugin } from '@maskito/core'
import { maskitoUpdateElement } from '@maskito/core'

export function applyPrefix(prefix: string): MaskitoPlugin {
  return (element) => {
    if (!element.value.startsWith(prefix)) {
      maskitoUpdateElement(element, prefix + element.value)
    }
  }
}
