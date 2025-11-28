import { computed, Directive, effect, ElementRef, forwardRef, inject, signal } from '@angular/core';
import { MaskitoDirective } from '@maskito/angular';
import { phoneAutoGenerator } from './phone';
import metadata from 'libphonenumber-js/min/metadata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[phoneInput], textarea[phoneInput], [contenteditable][phoneInput]',
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

  private mask = computed(() => {
    return phoneAutoGenerator({
      isInitialModeInternational: true,
      metadata,
    });
  });

  private value = signal('');
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private elementRef = inject(ElementRef) as ElementRef<HTMLInputElement | HTMLTextAreaElement | HTMLElement>;

  constructor() {
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
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;

    // For input or textarea
    const value = 'value' in target ? target.value : target.innerText;

    this.writeValue(value);
  }

  private reset(): void {
    const element = this.elementRef.nativeElement;
    if ('value' in element) {
      element.value = '';
    } else {
      element.innerText = '';
    }
  }
}
