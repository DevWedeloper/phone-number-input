import { Directive, inject, input } from '@angular/core';
import { CountryCode } from 'libphonenumber-js/core';
import { PhoneStateData } from './phone-state-data';

@Directive({
  selector: '[countryCodeTrigger]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  }
})
export class CountryCodeTrigger {
  private phoneStateData = inject(PhoneStateData);

  countryCode = input.required<CountryCode | null>();

  protected onClick(): void {
    this.phoneStateData.setCountry(this.countryCode());
  }
}
