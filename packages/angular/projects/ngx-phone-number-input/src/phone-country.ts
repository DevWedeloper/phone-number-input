import type { CountryCode } from 'libphonenumber-js/core'
import { inject, Injectable } from '@angular/core'
import { PhoneStateData } from './phone-state-data'

/**
 * Service responsible for managing the selected phone country.
 *
 * Acts as a thin facade over {@link PhoneStateData}, exposing
 * the currently selected country and providing a method
 * to update it.
 */
@Injectable()
export class PhoneCountry {
  private phoneState = inject(PhoneStateData)

  selectedCountry = this.phoneState.selectedCountry

  setCountry(country: CountryCode | null) {
    this.phoneState.setCountry(country)
  }
}
