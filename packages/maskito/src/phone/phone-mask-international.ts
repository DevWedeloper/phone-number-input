import type { MaskitoOptions } from '@maskito/core'
import type { CountryCode, MetadataJson } from 'libphonenumber-js/core'
import { maskitoPhoneOptionsGenerator } from '@maskito/phone'
import { getCountryCallingCode } from 'libphonenumber-js/core'
import { applyPrefix } from './plugins'

export function phoneInternationalGenerator({ countryIsoCode, metadata}: { countryIsoCode: CountryCode, metadata: MetadataJson }): Required<MaskitoOptions> {
  const code = getCountryCallingCode(countryIsoCode, metadata)
  const prefix = `+${code} `

  const phoneOptions = maskitoPhoneOptionsGenerator({
    metadata,
    countryIsoCode,
    strict: true,
  })

  return {
    ...phoneOptions,
    plugins: [
      ...phoneOptions.plugins,
      applyPrefix(prefix),
    ],
  } satisfies MaskitoOptions
}
