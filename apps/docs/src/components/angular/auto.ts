import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from '@phone-number-input/angular'

@Component({
  selector: 'auto',
  imports: [PhoneInput, FormsModule],
  template: `
    <div class="flex flex-col gap-2">
      <input
        phoneInput
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
export class Auto {
  protected value = signal('')
}
