import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { AsYouType, CountryCode, getCountryCallingCode, MetadataJson } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import { generatePhoneMask, getInternationalPhoneTemplate, getNationalPhoneTemplate, selectTemplate, shouldUseInternational } from '../phone/utils';
import { validateInternationalPhonePreprocessorGenerator, validateNationalPhonePreprocessorGenerator } from '../phone/processors';

export default phoneAutoGenerator({
    isInitialModeInternational: true,
    metadata,
});

type PhoneAutoGeneratorOptions =
    | {
          isInitialModeInternational: true;
          countryIsoCode?: undefined; // cannot provide country code in international mode
          metadata: MetadataJson;
          separator?: string;
      }
    | {
          isInitialModeInternational: false;
          countryIsoCode: CountryCode; // must provide country code in local mode
          metadata: MetadataJson;
          separator?: string;
      };

// TODO: write helper function that determines if i should handle national or international phone number
export function phoneAutoGenerator(options: PhoneAutoGeneratorOptions): Required<MaskitoOptions> {
    const { isInitialModeInternational, countryIsoCode, metadata, separator = '-' } = options;

    const formatter = new AsYouType(countryIsoCode, metadata);

    let currentTemplate = '';
    let currentPhoneLength = 0;

    return {
        ...MASKITO_DEFAULT_OPTIONS,
        mask: ({ value }) => {
            const newTemplate = isInitialModeInternational || shouldUseInternational(isInitialModeInternational, value) ?
                getInternationalPhoneTemplate(formatter, '+' + value, separator) :
                getNationalPhoneTemplate(formatter, `+${getCountryCallingCode(countryIsoCode, metadata)}` + value, separator);
            const newPhoneLength = value.replace(/\D/g, '').length;

            currentTemplate = selectTemplate({
                currentTemplate,
                newTemplate,
                currentPhoneLength,
                newPhoneLength,
            });
            currentPhoneLength = newPhoneLength;

            return generatePhoneMask({ value, template: currentTemplate });
        },
        preprocessors: [
            (data, actionType) => {
                const value = data.data || data.elementState.value;

                if (isInitialModeInternational || shouldUseInternational(isInitialModeInternational, value)) {
                    return validateInternationalPhonePreprocessorGenerator({ prefix: '+', metadata })(data, actionType);
                } else {
                    return validateNationalPhonePreprocessorGenerator({ prefix: `+${getCountryCallingCode(countryIsoCode, metadata)}`, countryIsoCode, metadata })(data, actionType);
                }
            }
        ]
    }
}