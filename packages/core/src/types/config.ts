import type { CountryCode } from 'libphonenumber-js'

/**
 * Configuration options for a phone input component.
 */
export type PhoneInputConfig
  = | {
    mode: 'auto'
    countryCode?: CountryCode
  }
  | {
    mode: 'international' | 'national'
    countryCode: CountryCode
    allowCountryChange?: boolean
  }
