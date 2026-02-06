import type { Signal } from '@angular/core'
import type { CountryCode } from 'libphonenumber-js/core'
import { inject, Injectable } from '@angular/core'
import { PhoneStateData } from './phone-state-data'

/** Manages the selected phone country. */
@Injectable()
export class PhoneCountry {
  private phoneState = inject(PhoneStateData)

  /** The currently selected phone country code. */
  selectedCountry: Signal<CountryCode | null> = this.phoneState.selectedCountry

  /**
   * Sets the selected country.
   *
   * @param country - The new country code to set, or `null` to clear it.
   */
  setCountry(country: CountryCode | null) {
    this.phoneState.setCountry(country)
  }
}
