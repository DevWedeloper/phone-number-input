import type {MaskitoPostprocessor} from '@maskito/core';
import type {MetadataJson} from 'libphonenumber-js/core';

import {cutPhoneByValidLength} from '../utils';

const MIN_LENGTH = 3;
export function phoneLengthNationalPostprocessorGenerator({
    prefix,
    metadata,
}: {
    prefix: string;
    metadata: MetadataJson;
}): MaskitoPostprocessor {
    return ({value, selection}) => ({
        value:
            value.length > MIN_LENGTH
                ? cutPhoneByValidLength({phone: prefix + value, metadata}).slice(prefix.length).trim()
                : value,
        selection,
    });
}
