import type { CountryCode } from 'libphonenumber-js/core'
import { Directive, inject, input } from '@angular/core'
import { PhoneStateData } from './phone-state-data'

/**
 * Directive that sets the phone country code when the host element is clicked.
 *
 * Use this directive on a clickable element (e.g., button or list item)
 * to update the selected country in the phone input state.
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
   * The country code that will be set when the host element is clicked.
   *
   * This input is required and should be a valid ISO country code.
   */
  countryCode = input.required<CountryCode | null>()

  protected onClick(): void {
    this.phoneStateData.setCountry(this.countryCode())
  }
}
