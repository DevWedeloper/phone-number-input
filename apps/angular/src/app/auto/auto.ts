import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { PhoneInput } from '../phone-input';
import { CountrySelect } from '../country-select';
import { PhoneField } from '../phone-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auto',
  imports: [PhoneField, PhoneInput, CountrySelect, FormsModule],
  host: {
    class: 'flex gap-4'
  },
  template: `
    <phone-field> 
      <country-select />
      <input
        class="border-border border rounded-sm"
        type="tel"
        placeholder="Auto..."
        autocomplete="tel"
        phoneInput
        [(ngModel)]="value"
      />
    </phone-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auto {
  protected value = signal('');

  constructor() {
    // effect(() => console.log('Phone value:', this.value()));
  }
}
