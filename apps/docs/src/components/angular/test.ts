import type { PhoneInputConfig } from '@phone-number-input/angular'
import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneCountry, PhoneField, PhoneInput } from '@phone-number-input/angular'

@Component({
  selector: 'country-select',
  standalone: true,
  template: `
    <p>Selected country: {{ selectedCountry() }}</p>
  `,
})
export class CountrySelectComponent {
  private phoneCountry = inject(PhoneCountry)

  protected selectedCountry = this.phoneCountry.selectedCountry
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PhoneInput, PhoneField, CountrySelectComponent, FormsModule],
  template: `
    <div phoneField>
      <country-select />
      <input phoneInput [config]="config" [(ngModel)]="value" type="tel" placeholder="Input" />
    </div>
  `,
})
export class TestComponent {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'auto',
    countryCode: 'RU',
  }
}
