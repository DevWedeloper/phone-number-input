import type {AsYouType} from 'libphonenumber-js/core';

export function getNationalPhoneTemplate(
    formatter: AsYouType,
    value: string,
    separator: string,
): string {
    formatter.input(value.replaceAll(/[^\d+]/g, ''));

    const initialTemplate = formatter.getTemplate();
    const split = initialTemplate.split(' ').slice(1); // Remove country code part
    const template =
        split.length > 1
            ? `${split.slice(0, 1).join(' ')} ${split.slice(1).join(separator)}`
            : initialTemplate;

    formatter.reset();

    return template.trim();
}
