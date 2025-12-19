import type { MaskitoPreprocessor } from '@maskito/core'
import type { CountryCode, MetadataJson } from 'libphonenumber-js/core'
import {
  AsYouType,
  parsePhoneNumber,
  validatePhoneNumberLength,
} from 'libphonenumber-js/core'

export function validateInternationalPhonePreprocessorGenerator({
  prefix,
  countryIsoCode,
  metadata,
}: {
  prefix: string
  countryIsoCode?: CountryCode
  metadata: MetadataJson
}): MaskitoPreprocessor {
  return ({ elementState, data }) => {
    const { selection, value } = elementState
    const cleanCode = prefix.trim()

    // handling autocomplete
    if (value && !value.startsWith(cleanCode) && !data) {
      const formatter = new AsYouType({ defaultCountry: countryIsoCode }, metadata)

      formatter.input(value)
      const numberValue = formatter.getNumberValue() ?? ''

      formatter.reset()

      const newVal = formatter.input(numberValue) || `+${value}`

      return { elementState: { value: newVal, selection } }
    }

    try {
      const validationError = validatePhoneNumberLength(
        data,
        { defaultCountry: countryIsoCode },
        metadata,
      )

      if (!validationError || validationError === 'TOO_SHORT') {
        // handle paste-event with different code, for example for 8 / +7
        const phone = countryIsoCode
          ? parsePhoneNumber(data, countryIsoCode, metadata)
          : parsePhoneNumber(data, metadata)

        const { nationalNumber, countryCallingCode } = phone

        return {
          elementState: {
            selection,
            value: '',
          },
          data: `+${countryCallingCode} ${nationalNumber}`,
        }
      }
    }
    catch {
      return { elementState }
    }

    return { elementState }
  }
}
