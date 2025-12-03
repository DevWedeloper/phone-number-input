import { MaskitoPlugin, maskitoUpdateElement } from '@maskito/core';

export const applyPrefix = (prefix: string): MaskitoPlugin => (element) => {
    if (!element.value.startsWith(prefix)) {
        maskitoUpdateElement(element, prefix + element.value);
    }
};
