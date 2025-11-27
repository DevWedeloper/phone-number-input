import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { AsYouType, CountryCode, getCountryCallingCode, MetadataJson } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import {generatePhoneMask, getNationalPhoneTemplate, selectTemplate} from '../phone/utils';
import { phoneLengthNationalPostprocessorGenerator, validateNationalPhonePreprocessorGenerator } from '../phone/processors';

export default phoneNationalGenerator({
    countryIsoCode: 'PH',
    metadata,
});

export function phoneNationalGenerator({
    countryIsoCode,
    metadata,
    separator = '-',
}: {
    countryIsoCode: CountryCode;
    metadata: MetadataJson;
    separator?: string;
}): Required<MaskitoOptions> {
    const formatter = new AsYouType(countryIsoCode, metadata);
    const prefix = `+${getCountryCallingCode(countryIsoCode, metadata)}`;
    
    let currentTemplate = '';
    let currentPhoneLength = 0;

    return {
        ...MASKITO_DEFAULT_OPTIONS,
        mask: ({ value }) => {
            const newTemplate = getNationalPhoneTemplate(formatter, prefix + value, separator);
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
        preprocessors: [validateNationalPhonePreprocessorGenerator({prefix, countryIsoCode, metadata})],
        postprocessors: [
            phoneLengthNationalPostprocessorGenerator({prefix, metadata})
        ],
    }
}
