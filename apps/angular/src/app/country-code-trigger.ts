import { Directive, inject, input } from '@angular/core';
import { CountryCode } from 'libphonenumber-js/core';
import { PhoneStateData } from './phone-state-data';

@Directive({
  selector: '[countryCodeTrigger]',
  host: {
    '(click)': 'onClick()',
  }
})
export class CountryCodeTrigger {
  private PhoneStateData = inject(PhoneStateData);

  countryCode = input.required<CountryCode | null>();

  protected onClick(): void {
    this.PhoneStateData.setCountry(this.countryCode());
  }
}
