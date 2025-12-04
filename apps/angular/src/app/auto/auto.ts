import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { PhoneField, PhoneInput } from '@phone-number-input/angular';
import { FormsModule } from '@angular/forms';
import { CountrySelect } from '../country-select';

@Component({
  selector: 'app-auto',
  imports: [PhoneField, PhoneInput, CountrySelect, FormsModule],
  standalone: true,
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
