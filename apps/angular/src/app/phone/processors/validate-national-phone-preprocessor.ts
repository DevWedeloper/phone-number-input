import type {MaskitoPreprocessor} from '@maskito/core';
import type {CountryCode, MetadataJson} from 'libphonenumber-js/core';
import {
    AsYouType,
    parsePhoneNumber,
    validatePhoneNumberLength,
} from 'libphonenumber-js/core';

export function validateNationalPhonePreprocessorGenerator({
    prefix,
    countryIsoCode,
    metadata,
}: {
    prefix: string;
    countryIsoCode: CountryCode;
    metadata: MetadataJson;
}): MaskitoPreprocessor {
    return ({elementState, data}) => {
        const {selection, value} = elementState;
        
        // handling autocomplete
        if (value && !data) {
            const formatter = new AsYouType({defaultCountry: countryIsoCode}, metadata);

            formatter.input(value);
            const numberValue = formatter.getNumberValue() ?? '';

            formatter.reset();

            const val = formatter.input(numberValue);
            const trimmedVal = val.slice(prefix.length).trim();
            const test = {elementState: {value: trimmedVal, selection}};

            console.log('return at autocomplete', {val, test});

            return test
        }

        try {
            const validationError = validatePhoneNumberLength(
                data,
                {defaultCountry: countryIsoCode},
                metadata,
            );

            if (!validationError || validationError === 'TOO_SHORT') {
                // handle paste-event with different code, for example for 8 / +7
                const phone = parsePhoneNumber(data, countryIsoCode, metadata);

                const {nationalNumber} = phone;

                console.log('return at try', {nationalNumber, elementState, data});

                return {
                    elementState,
                    data: nationalNumber,
                };
            }
        } catch {
            console.log('return at catch', {elementState, data});
            return {elementState};
        }

        console.log('return at end', {elementState, data});
        return {elementState};
    };
}
