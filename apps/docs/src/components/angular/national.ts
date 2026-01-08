import type { PhoneInputConfig } from '@phone-number-input/angular'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from '@phone-number-input/angular'

@Component({
  selector: 'national',
  imports: [PhoneInput, FormsModule],
  template: `
    <div class="flex flex-col gap-2">
      <input
        phoneInput
        [config]="config"
        [(ngModel)]="value"
        type="tel"
        placeholder="Enter phone number"
      />
      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  `,
})
export class National {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'national',
    countryCode: 'US',
  }
}
