import {maskitoUpdateElement, type MaskitoOptions, type MaskitoPlugin} from '@maskito/core';
import {maskitoPhoneOptionsGenerator} from '@maskito/phone';
import {getCountryCallingCode} from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';

const countryIsoCode = 'US';
const code = getCountryCallingCode(countryIsoCode, metadata);
const prefix = `+${code} `;

const phoneOptions = maskitoPhoneOptionsGenerator({
    metadata,
    countryIsoCode,
    strict: true,
});

const applyPrefix = (value: string): MaskitoPlugin => (element) => maskitoUpdateElement(element, value)
    
export default {
    ...phoneOptions,
    plugins: [
        ...phoneOptions.plugins,
        applyPrefix(prefix),
    ],
} satisfies MaskitoOptions;
