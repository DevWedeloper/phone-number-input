import { CountryCode } from 'libphonenumber-js';

export type Mode = 'auto' | 'international' | 'national';
type CountryContext = 'none' | 'user-selected' | 'auto-detected';

interface PhoneStateInAuto {
  mode: 'auto';
  input: string;
  country: CountryCode | null;
  countryContext: CountryContext;
}

interface PhoneStateInInternational {
  mode: 'international';
  input: string;
  country: CountryCode;
  countryContext: 'auto-detected';
}

interface PhoneStateInNational {
  mode: 'national';
  input: string;
  country: CountryCode;
  countryContext: 'auto-detected';
}

export type PhoneState = PhoneStateInAuto | PhoneStateInInternational | PhoneStateInNational;
