import { CountryCode, getCountryCallingCode, MetadataJson } from 'libphonenumber-js/core';

export function formatNationalPhone(input: string, country: CountryCode, metadata: MetadataJson) {
  const sanitized = input.replace(/[^\d]/g, '');
  if (!sanitized.trim()) return '';
  const prefix = `+${getCountryCallingCode(country, metadata)}`;
  return prefix + sanitized;
}

export function handleCountrySelect<T extends { country: CountryCode | null; input: string }>(
  prevCountry: CountryCode | null,
  current: T,
  value: CountryCode | null,
  config: { allowCountryChange?: boolean; countryCode: CountryCode }
) {
  if (config.allowCountryChange === false) {
    return { ...current, country: config.countryCode };
  }

  const isNewCountry = prevCountry !== value;

  return {
    ...current,
    country: value,
    input: isNewCountry ? '' : current.input,
  };
}
