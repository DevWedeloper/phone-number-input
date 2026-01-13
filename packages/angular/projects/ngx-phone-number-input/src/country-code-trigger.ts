import type { CountryCode } from 'libphonenumber-js/core'
import { Directive, inject, input } from '@angular/core'
import { PhoneStateData } from './phone-state-data'

/**
 * Sets the phone country code when the host element is clicked.
 * Use on clickable elements to update the phone input's selected country.
 */
@Directive({
  selector: '[countryCodeTrigger]',
  host: {
    '(click)': 'onClick()',
  },
})
export class CountryCodeTrigger {
  private phoneStateData = inject(PhoneStateData)

  /**
   * Required ISO country code to set when the host element is clicked.
   */
  countryCode = input.required<CountryCode | null>()

  protected onClick(): void {
    this.phoneStateData.setCountry(this.countryCode())
  }
}
