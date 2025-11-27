import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { AsYouType, CountryCode, getCountryCallingCode, MetadataJson } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import { generatePhoneMask, getInternationalPhoneTemplate, getNationalPhoneTemplate, selectTemplate, shouldUseInternational } from '../phone/utils';
import { phoneLengthInternationalPostprocessorGenerator, phoneLengthNationalPostprocessorGenerator, validateInternationalPhonePreprocessorGenerator, validateNationalPhonePreprocessorGenerator } from '../phone/processors';

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

export function phoneAutoGenerator(options: PhoneAutoGeneratorOptions): Required<MaskitoOptions> {
    const { isInitialModeInternational, countryIsoCode, metadata, separator = '-' } = options;

    const formatter = new AsYouType(countryIsoCode, metadata);
    let currentTemplate = '';
    let currentPhoneLength = 0;

    return {
        ...MASKITO_DEFAULT_OPTIONS,
        mask: ({ value }) => {
            const isInternational = isInitialModeInternational || shouldUseInternational(isInitialModeInternational, value);

            const newTemplate = isInternational ?
                getInternationalPhoneTemplate(formatter, value, separator) :
                getNationalPhoneTemplate(formatter, `+${getCountryCallingCode(countryIsoCode, metadata)}` + value, separator);
            const newPhoneLength = value.replaceAll(/\D/g, '').length;

            currentTemplate = selectTemplate({
                currentTemplate,
                newTemplate,
                currentPhoneLength,
                newPhoneLength,
            });
            currentPhoneLength = newPhoneLength;

            if (currentTemplate.length === 1 && isInternational) {
                return ['+', /\d/];
            }

            return generatePhoneMask({
                value,
                template: currentTemplate,
                prefix: isInternational ? '+' : ''
            });
        },
        preprocessors: [
            (data, actionType) => {
                const value = data.elementState.value || data.data;

                if (isInitialModeInternational || shouldUseInternational(isInitialModeInternational, value)) {
                    return validateInternationalPhonePreprocessorGenerator({ prefix: '+', metadata })(data, actionType);
                } else {
                    return validateNationalPhonePreprocessorGenerator({ prefix: `+${getCountryCallingCode(countryIsoCode, metadata)}`, countryIsoCode, metadata })(data, actionType);
                }
            }
        ],
        postprocessors: [
            (elementState, initialElementState) => {
                const value = elementState.value;

                if (isInitialModeInternational || shouldUseInternational(isInitialModeInternational, value)) {
                    return phoneLengthInternationalPostprocessorGenerator(metadata)(elementState, initialElementState);
                } else {
                    return phoneLengthNationalPostprocessorGenerator({ prefix: `+${getCountryCallingCode(countryIsoCode, metadata)}`, metadata })(elementState, initialElementState);
                }
            }
        ]
    }
}