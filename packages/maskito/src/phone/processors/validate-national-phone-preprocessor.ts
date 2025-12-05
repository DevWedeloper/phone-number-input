import type { MaskitoPreprocessor } from '@maskito/core'
import type { CountryCode, MetadataJson } from 'libphonenumber-js/core'
import {
  AsYouType,
  parsePhoneNumber,
  validatePhoneNumberLength,
} from 'libphonenumber-js/core'

export function validateNationalPhonePreprocessorGenerator({
  prefix,
  countryIsoCode,
  metadata,
}: {
  prefix: string
  countryIsoCode: CountryCode
  metadata: MetadataJson
}): MaskitoPreprocessor {
  return ({ elementState, data }) => {
    const { selection, value } = elementState

    // handling autocomplete
    if (value && !data) {
      const formatter = new AsYouType({ defaultCountry: countryIsoCode }, metadata)

      formatter.input(value)
      const numberValue = formatter.getNumberValue() ?? ''

      formatter.reset()

      const val = formatter.input(numberValue)
      const trimmedVal = val.slice(prefix.length).trim()

      return { elementState: { value: trimmedVal, selection } }
    }

    try {
      const validationError = validatePhoneNumberLength(
        data,
        { defaultCountry: countryIsoCode },
        metadata,
      )

      if (!validationError || validationError === 'TOO_SHORT') {
        // handle paste-event with different code, for example for 8 / +7
        const phone = parsePhoneNumber(data, countryIsoCode, metadata)

        const { nationalNumber } = phone

        return {
          elementState,
          data: nationalNumber,
        }
      }
    }
    catch {
      return { elementState }
    }

    return { elementState }
  }
}
