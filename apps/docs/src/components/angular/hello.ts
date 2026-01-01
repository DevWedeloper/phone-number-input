import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from '@phone-number-input/angular'

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [PhoneInput, FormsModule],
  template: `
    <input phoneInput [(ngModel)]="value" type="tel" placeholder="Input" />
  `,
})
export class HelloComponent {
  protected value = signal('')
}
