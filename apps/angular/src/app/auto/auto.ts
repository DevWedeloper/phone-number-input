import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { PhoneInput } from '../phone-input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auto',
  imports: [PhoneInput],
  template: `
    <input
      class="border-border border rounded-sm"
      type="tel"
      placeholder="Auto..."
      autocomplete="tel"
      phoneInput
      (input)="onChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auto {
  protected value = signal('');

  constructor() {
    effect(() => console.log('Phone value:', this.value()));
  }

  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
