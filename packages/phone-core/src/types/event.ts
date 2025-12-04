import { CountryCode } from 'libphonenumber-js/core';

export type PhoneEvent =
  | { action: 'input'; value: string }
  | { action: 'country-select'; value: CountryCode | null };