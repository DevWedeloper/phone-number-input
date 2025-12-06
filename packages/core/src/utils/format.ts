import type { CountryCode, MetadataJson } from 'libphonenumber-js/core'
import { getCountryCallingCode } from 'libphonenumber-js/core'

export function formatNationalPhone(input: string, country: CountryCode, metadata: MetadataJson) {
  const sanitized = input.replace(/\D/g, '')
  if (!sanitized.trim())
    return ''
  return `+${getCountryCallingCode(country, metadata)}${sanitized}`
}
