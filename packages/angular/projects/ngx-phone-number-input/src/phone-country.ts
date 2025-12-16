import type { CountryCode } from 'libphonenumber-js/core'
import { inject, Injectable } from '@angular/core'
import { PhoneStateData } from './phone-state-data'

@Injectable()
export class PhoneCountry {
  private phoneState = inject(PhoneStateData)

  selectedCountry = this.phoneState.selectedCountry

  setCountry(country: CountryCode | null) {
    this.phoneState.setCountry(country)
  }
}
