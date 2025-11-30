import { computed, Directive, effect, ElementRef, forwardRef, inject, input, isDevMode, signal } from '@angular/core';
import { MaskitoDirective } from '@maskito/angular';
import { phoneAutoGenerator } from './phone';
import metadata from 'libphonenumber-js/min/metadata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PhoneInputConfig } from './types/config';

@Directive({
  selector: 'input[phoneInput]',
  host: {
    '(input)': 'onInput($event)',
  },
  hostDirectives: [MaskitoDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInput),
      multi: true,
    },
  ],
})
export class PhoneInput implements ControlValueAccessor {
  private maskito = inject(MaskitoDirective);
  private elementRef = inject(ElementRef) as ElementRef<HTMLInputElement>;

  config = input<PhoneInputConfig>({ mode: 'auto' });

  private mask = computed(() => {
    return phoneAutoGenerator({
      isInitialModeInternational: true,
      metadata,
    });
  });

  private value = signal('');
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    const element = this.elementRef.nativeElement as HTMLInputElement;

    if (isDevMode() && element.type !== 'tel') {
      console.warn(
        `PhoneInput directive prefers <input type="tel">. Current type is "${element.type}".`
      );
    }

    effect(() => this.maskito.options.set(this.mask()));
    effect(() => this.onChange(this.value()));
  }

  writeValue(value: string | null): void {
    this.value.set(value ? value.replace(/[^\d+]/g, '') : '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.writeValue(target.value);
  }

  private reset(): void {
    const element = this.elementRef.nativeElement;
    this.writeValue(element.value);
  }
}
