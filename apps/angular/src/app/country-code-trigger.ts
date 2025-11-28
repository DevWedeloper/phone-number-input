import { Directive, inject, input } from '@angular/core';
import { CountryCode } from 'libphonenumber-js/core';
import { PhoneState } from './phone-state';

@Directive({
  selector: '[countryCodeTrigger]',
  host: {
    '(click)': 'onClick()',
  }
})
export class CountryCodeTrigger {
  private phoneState = inject(PhoneState);

  countryCode = input.required<CountryCode>();

  protected onClick(): void {
    // TODO: set the country code in the service
  }
}
