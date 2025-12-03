import type {MaskitoPreprocessor} from '@maskito/core';
import type {MetadataJson} from 'libphonenumber-js/core';
import {
    AsYouType,
    parsePhoneNumber,
    validatePhoneNumberLength,
} from 'libphonenumber-js/core';

export function validateInternationalPhonePreprocessorGenerator({
    prefix,
    metadata,
}: {
    prefix: string;
    metadata: MetadataJson;
}): MaskitoPreprocessor {
    return ({elementState, data}) => {
        const {selection, value} = elementState;
        const [from] = selection;
        const selectionIncludesPrefix = from < prefix.length;
        const cleanCode = prefix.trim();

        // handling autocomplete
        if (value && !value.startsWith(cleanCode) && !data) {
            const formatter = new AsYouType({defaultCountry: undefined}, metadata);

            formatter.input(value);
            const numberValue = formatter.getNumberValue() ?? '';

            formatter.reset();

            return {elementState: {value: formatter.input(numberValue), selection}};
        }

        try {
            const validationError = validatePhoneNumberLength(
                data,
                metadata,
            );

            if (!validationError || validationError === 'TOO_SHORT') {
                // handle paste-event with different code, for example for 8 / +7
                const phone = parsePhoneNumber(data, metadata)

                const {nationalNumber, countryCallingCode} = phone;

                return {
                    elementState: {
                        selection,
                        value: selectionIncludesPrefix ? '' : prefix,
                    },
                    data: selectionIncludesPrefix
                        ? `+${countryCallingCode} ${nationalNumber}`
                        : nationalNumber,
                };
            }
        } catch {
            return {elementState};
        }

        return {elementState};
    };
}