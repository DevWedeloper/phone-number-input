import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { PhoneInput } from '../phone-input';
import { CountrySelect } from '../country-select';
import { PhoneField } from '../phone-field';

@Component({
  selector: 'app-auto',
  imports: [PhoneField, PhoneInput, CountrySelect],
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
        (input)="onChange($event)"
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

  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
