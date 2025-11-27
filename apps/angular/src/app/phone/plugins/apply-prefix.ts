import { MaskitoPlugin, maskitoUpdateElement } from '@maskito/core';

export const applyPrefix = (value: string): MaskitoPlugin => (element) => maskitoUpdateElement(element, value)