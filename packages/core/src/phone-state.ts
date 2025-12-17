import type { PhoneInputConfig } from './types/config'
import type { PhoneEvent } from './types/event'
import type { PhoneState } from './types/state'
import { AsYouType } from 'libphonenumber-js/core'
import metadata from 'libphonenumber-js/min/metadata'
import { formatNationalPhone, handleCountrySelect } from './utils'

export function updatePhoneState(
  prev: PhoneState,
  config: PhoneInputConfig,
  event: PhoneEvent,
): PhoneState {
  const { mode } = config
  const { action, value } = event

  let next: PhoneState = {
    ...prev,
    resetInput: false,
    mode,
  }

  if (action === 'input') {
    next = { ...next, input: value }
  }
  else if (action === 'country-select') {
    next = { ...next, country: value }
  }

  if (action === 'country-select' && prev.country !== next.country) {
    next = { ...next, resetInput: true }
  }

  if (mode === 'auto') {
    if (action === 'country-select') {
      next = {
        ...next,
        derivedMode: value ? 'national' : 'international',
        input: '',
      }
    }

    if (next.input.startsWith('+')) {
      next = { ...next, derivedMode: 'international' }
    }

    if (prev.derivedMode === 'international' && next.derivedMode === 'national') {
      next = { ...next, resetInput: true }
    }

    if (next.derivedMode === 'international') {
      const formatter = new AsYouType({ defaultCountry: config.countryCode }, metadata)
      formatter.input(next.input)

      next = {
        ...next,
        country: formatter.getCountry() ?? null,
        phone: next.input.replace(/[^\d+]/g, ''),
      }
    }

    if (next.derivedMode === 'national' && next.country) {
      next = {
        ...next,
        phone: formatNationalPhone(next.input, next.country, metadata),
      }
    }
  }

  if (mode === 'international') {
    next = {
      ...next,
      derivedMode: 'international',
      country: next.country ?? config.countryCode,
      phone: next.input.replace(/[^\d+]/g, ''),
    }

    if (action === 'country-select') {
      next = handleCountrySelect(prev.country, next, value, config)
    }
  }

  if (mode === 'national') {
    const country = next.country ?? config.countryCode

    next = {
      ...next,
      derivedMode: 'national',
      country,
      phone: formatNationalPhone(next.input, country, metadata),
    }

    if (action === 'country-select') {
      next = handleCountrySelect(prev.country, next, value, config)
    }
  }

  return next
}
