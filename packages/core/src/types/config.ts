import type { CountryCode } from 'libphonenumber-js'

export type PhoneInputConfig
  = | { mode: 'auto' }
    | {
      mode: 'international' | 'national'
      countryCode: CountryCode
      allowCountryChange?: boolean
    }
