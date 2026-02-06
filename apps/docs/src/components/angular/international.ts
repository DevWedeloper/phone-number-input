import type { PhoneInputConfig } from '@phone-number-input/angular'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from '@phone-number-input/angular'

@Component({
  selector: 'international',
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
export class International {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'international',
    countryCode: 'US',
  }
}
