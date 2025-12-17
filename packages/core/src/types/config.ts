import type { CountryCode } from 'libphonenumber-js'

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
