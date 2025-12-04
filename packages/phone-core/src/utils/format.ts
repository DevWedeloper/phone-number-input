import { CountryCode, getCountryCallingCode, MetadataJson } from 'libphonenumber-js/core';

export function formatNationalPhone(input: string, country: CountryCode, metadata: MetadataJson) {
  const sanitized = input.replace(/[^\d]/g, '');
  if (!sanitized.trim()) return '';
  return `+${getCountryCallingCode(country, metadata)}${sanitized}`;
}
