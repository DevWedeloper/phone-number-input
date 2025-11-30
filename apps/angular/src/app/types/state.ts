import { CountryCode } from 'libphonenumber-js'

interface BasePhoneState {
  input: string
}

interface PhoneStateAuto extends BasePhoneState {
  mode: 'auto'
  country: CountryCode | null
  countryContext: 'user-selected' | 'auto-detected' | 'provided'
}

interface PhoneStateWithCountry extends BasePhoneState {
  mode: 'international' | 'national'
  country: CountryCode
  countryContext: 'provided'
}

export type PhoneState = PhoneStateAuto | PhoneStateWithCountry
