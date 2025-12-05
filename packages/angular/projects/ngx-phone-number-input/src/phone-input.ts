import { computed, Directive, effect, ElementRef, forwardRef, inject, input, isDevMode, signal, untracked } from '@angular/core';
import { MaskitoDirective } from '@maskito/angular';
import { phoneAutoGenerator, phoneInternationalGenerator, phoneNationalGenerator } from '@phone-number-input/maskito';
import metadata from 'libphonenumber-js/min/metadata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PhoneStateData } from './phone-state-data';
import { PhoneInputConfig } from '@phone-number-input/phone-core';

@Directive({
  selector: 'input[phoneInput]',
  standalone: true,
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
  private phoneStateData = inject(PhoneStateData);

  config = input<PhoneInputConfig>({ mode: 'auto' });

  private mask = computed(() => {
    const config = this.config();
    const { country, derivedMode } = this.phoneStateData.countryAndDerivedMode();

    if (config.mode === 'auto') {
      if (derivedMode === 'national' && country) {
        return phoneAutoGenerator({ isInitialModeInternational: false, metadata, countryIsoCode: country });
      } else {
        return phoneAutoGenerator({ isInitialModeInternational: true, metadata });
      }
    } else if (config.mode === 'international') {
      return phoneInternationalGenerator({ countryIsoCode: country || config.countryCode, metadata });
    } else {
      return phoneNationalGenerator({ countryIsoCode: country || config.countryCode, metadata });
    }
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
    effect(() => this.onChange(this.phoneStateData.phone()));
    effect(() => {
      const value = this.value();
      untracked(() => this.phoneStateData.setInput(value));
    })
    effect(() => {
      const config = this.config();
      untracked(() => this.phoneStateData.setConfig(config));
    })
    effect(() => {
      const inputReset = this.phoneStateData.inputReset();
      if (inputReset) {
        this.reset();
      }
    })
  }

  writeValue(value: string | null): void {
    this.value.set(value ? value : '');
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
    element.value = '';
  }
}
