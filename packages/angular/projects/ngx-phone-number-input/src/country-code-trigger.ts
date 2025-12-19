import type { CountryCode } from 'libphonenumber-js/core'
import { Directive, inject, input } from '@angular/core'
import { PhoneStateData } from './phone-state-data'

/**
 * Directive that sets the phone country code when the host element is clicked.
 *
 * Use this directive on a clickable element (e.g., button or list item)
 * to update the selected country in the phone input state.
 *
 * ### Usage
 * ```html
 * <button [countryCodeTrigger]="countryCode">Select Country</button>
 * ```
 */
@Directive({
  selector: '[countryCodeTrigger]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class CountryCodeTrigger {
  private phoneStateData = inject(PhoneStateData)

  countryCode = input.required<CountryCode | null>()

  protected onClick(): void {
    this.phoneStateData.setCountry(this.countryCode())
  }
}
