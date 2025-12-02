import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountrySelect } from '../country-select';
import { PhoneField } from '../phone-field';
import { PhoneInput } from '../phone-input';
import { PhoneInputConfig } from '../types/config';

@Component({
  selector: 'app-national',
  imports: [PhoneField, PhoneInput, CountrySelect, FormsModule],
  template: `
    <phone-field> 
      <country-select />
      <input
        class="border-border border rounded-sm"
        type="tel"
        placeholder="National..."
        autocomplete="tel"
        phoneInput
        [config]="config"
        [(ngModel)]="value"
      />
    </phone-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class National {
  protected config: PhoneInputConfig = {
    mode: 'national',
    countryCode: 'PH',
    allowCountryChange: false,
  };

  protected value = signal('');

  constructor() {
    effect(() => console.log('Phone value:', this.value()));
  }
}
