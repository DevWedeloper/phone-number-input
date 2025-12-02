import { CountryCode } from 'libphonenumber-js'

export type Mode = 'auto' | 'international' | 'national'

interface BasePhoneState {
  input: string
}

interface PhoneStateAuto extends BasePhoneState {
  mode: 'auto'
  country: CountryCode | null
  countryContext: 'none' | 'user-selected' | 'auto-detected' | 'provided'
}

interface PhoneStateWithCountry extends BasePhoneState {
  mode: 'international' | 'national'
  country: CountryCode
  countryContext: 'provided'
}

export type PhoneState = PhoneStateAuto | PhoneStateWithCountry // TODO: might remove this if im not using it
