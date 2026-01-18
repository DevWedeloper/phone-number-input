import type { CountryCode } from 'libphonenumber-js/core'

export function handleCountrySelect<T extends { country: CountryCode | null, input: string, phone: string, resetInput: boolean }>(
  prevCountry: CountryCode | null,
  current: T,
  value: CountryCode | null,
  config: { allowCountryChange?: boolean, countryCode: CountryCode },
) {
  if (config.allowCountryChange === false) {
    return { ...current, country: config.countryCode, resetInput: false }
  }

  return {
    ...current,
    country: value,
    input: prevCountry !== value ? '' : current.input,
    phone: prevCountry !== value ? '' : current.phone,
  }
}
