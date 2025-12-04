import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountrySelect } from '../country-select';
import { PhoneField, PhoneInput, PhoneInputConfig } from 'ngx-phone-number-input';

@Component({
  selector: 'app-international',
  standalone: true,
  imports: [PhoneField, PhoneInput, CountrySelect, FormsModule],
  template: `
    <phone-field> 
      <country-select />
      <input
        class="border-border border rounded-sm"
        type="tel"
        placeholder="International..."
        autocomplete="tel"
        phoneInput
        [config]="config"
        [(ngModel)]="value"
      />
    </phone-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class International {
  protected config: PhoneInputConfig = {
    mode: 'international',
    countryCode: 'PH',
  };

  protected value = signal('');

  constructor() {
    // effect(() => console.log('Phone value:', this.value()));
  }
}
