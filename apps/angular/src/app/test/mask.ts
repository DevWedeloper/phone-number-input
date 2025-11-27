import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions, MaskitoPostprocessor, MaskitoPreprocessor } from '@maskito/core';
import { AsYouType, CountryCode, MetadataJson } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import { generatePhoneMask, getInternationalPhoneTemplate, selectTemplate } from '../phone/utils';

export default phoneTestGenerator({
    countryIsoCode: undefined,
    metadata,
});

export function phoneTestGenerator({ countryIsoCode, metadata, separator = '-', }: { countryIsoCode: CountryCode | undefined; metadata: MetadataJson, separator?: string }): Required<MaskitoOptions> {
    const formatter = new AsYouType(countryIsoCode, metadata);
    const prefix = '+';
    let currentTemplate = '';
    let currentPhoneLength = 0;
    
    return {
        ...MASKITO_DEFAULT_OPTIONS,
        mask: ({ value, selection }) => {
            console.log(
            "%cmask",
            "color: yellow;",
            { elementState: { value, selection } }
            );
            const newTemplate = getInternationalPhoneTemplate(formatter, value, separator);
            const newPhoneLength = value.replace(/\D/g, '').length;

            currentTemplate = selectTemplate({
                currentTemplate,
                newTemplate,
                currentPhoneLength,
                newPhoneLength,
            });
            currentPhoneLength = newPhoneLength;

            return currentTemplate.length === 1
                ? ['+', /\d/]
                : generatePhoneMask({value, template: currentTemplate, prefix});
        },
        preprocessors: [testPreprocessor()],
        postprocessors: [testPostprocessor()],
    }
}

function testPreprocessor(): MaskitoPreprocessor {
    return ({elementState, data}, actionType) => {
        console.log(
        "%ctestPreprocessor",
        "color: red;",
        { elementState, data, actionType }
        );
        return {elementState};
    };
}

function testPostprocessor(): MaskitoPostprocessor {
    return ({value, selection}, initialElementState) => {
        console.log(
        "%ctestPostprocessor",
        "color: blue;",
        { elementState: { value, selection }, initialElementState }
        );
        return { value, selection };
    };
}
