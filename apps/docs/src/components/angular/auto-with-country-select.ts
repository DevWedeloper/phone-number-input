import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneField, PhoneInput } from '@phone-number-input/angular'
import { CountrySelect } from './country-select'

@Component({
  selector: 'auto-with-country-select',
  imports: [PhoneInput, PhoneField, CountrySelect, FormsModule],
  template: `
    <div class="flex flex-col gap-2">
      <fieldset phoneField class="flex gap-2">
        <country-select />
        <input
          phoneInput
          [(ngModel)]="value"
          type="tel"
          placeholder="Enter phone number"
        />
      </fieldset>

      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  `,
})
export class AutoWithCountrySelect {
  protected value = signal('')
}
