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

  /**
   * The currently selected country.
   *
   * This reflects the state in {@link PhoneStateData} and can be
   * used to read the currently active country code.
   */
  selectedCountry = this.phoneState.selectedCountry

  /**
   * Sets the selected country.
   *
   * @param country - The new country code to set, or `null` to clear it.
   */
  setCountry(country: CountryCode | null) {
    this.phoneState.setCountry(country)
  }
}
