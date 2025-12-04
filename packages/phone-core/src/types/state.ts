import { CountryCode } from 'libphonenumber-js/core';

export type Mode = 'auto' | 'international' | 'national'

export interface PhoneState {
  mode: Mode;
  derivedMode: Exclude<Mode, 'auto'>;
  input: string;
  country: CountryCode | null;
  phone: string;
  resetInput: boolean;
}