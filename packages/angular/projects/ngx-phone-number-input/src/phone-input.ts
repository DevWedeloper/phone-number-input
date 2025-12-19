import type { ControlValueAccessor } from '@angular/forms'
import type { PhoneInputConfig } from '@phone-number-input/core'
import { computed, Directive, effect, ElementRef, forwardRef, inject, input, isDevMode, signal, untracked } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { MaskitoDirective } from '@maskito/angular'
import { maskitoTransform } from '@maskito/core'
import { phoneAutoGenerator, phoneInternationalGenerator, phoneNationalGenerator } from '@phone-number-input/maskito'
import metadata from 'libphonenumber-js/min/metadata'
import { PhoneStateData } from './phone-state-data'

/**
 * Directive that transforms a standard `<input>` into a reactive phone input.
 *
 * This directive:
 * - Integrates with `PhoneStateData` to track the current phone value and selected country.
 * - Supports automatic, international, and national formatting modes via `config`.
 * - Works as a `ControlValueAccessor` for use with Angular forms.
 * - Applies input masking using `MaskitoDirective` and phone number generators.
 *
 * ### Usage
 * ```html
 * <input type="tel" phoneInput />
 * ```
 */
@Directive({
  selector: 'input[phoneInput]',
  standalone: true,
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
  },
  hostDirectives: [MaskitoDirective],
  providers: [
    {
      provide: PhoneStateData,
      useFactory: () => {
        const phoneStateData = inject(PhoneStateData, { optional: true, skipSelf: true })
        return phoneStateData || new PhoneStateData()
      },
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInput),
      multi: true,
    },
  ],
})
export class PhoneInput implements ControlValueAccessor {
  private maskito = inject(MaskitoDirective)
  private elementRef = inject(ElementRef) as ElementRef<HTMLInputElement>
  private phoneStateData = inject(PhoneStateData)

  /**
   * Configuration input for the phone input.
   */
  config = input<PhoneInputConfig>({ mode: 'auto' })

  private mask = computed(() => {
    const config = this.config()
    const { country, derivedMode } = this.phoneStateData.countryAndDerivedMode()

    if (config.mode === 'auto') {
      if (derivedMode === 'national' && country) {
        return phoneAutoGenerator({ isInitialModeInternational: false, metadata, countryIsoCode: country })
      }
      else {
        return phoneAutoGenerator({ isInitialModeInternational: true, metadata, countryIsoCode: config.countryCode })
      }
    }
    else if (config.mode === 'international') {
      return phoneInternationalGenerator({ countryIsoCode: country || config.countryCode, metadata })
    }
    else {
      return phoneNationalGenerator({ countryIsoCode: country || config.countryCode, metadata })
    }
  })

  private value = signal('')
  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  /** @internal */
  constructor() {
    const element = this.elementRef.nativeElement as HTMLInputElement

    if (isDevMode() && element.type !== 'tel') {
      console.warn(
        `PhoneInput directive prefers <input type="tel">. Current type is "${element.type}".`,
      )
    }

    effect(() => this.maskito.options.set(this.mask()), { allowSignalWrites: true })
    effect(() => this.onChange(this.phoneStateData.phone()))
    effect(() => {
      const value = this.value()
      untracked(() => this.phoneStateData.setInput(value))
    })
    effect(() => {
      const config = this.config()
      untracked(() => this.phoneStateData.setConfig(config))
    })
    effect(() => {
      const inputReset = this.phoneStateData.inputReset()
      if (inputReset) {
        this.reset()
      }
    })
  }

  /** @internal */
  writeValue(value: string | null): void {
    const v = value ?? ''
    const sanitized = maskitoTransform(v, this.mask())
    this.value.set(sanitized)
    this.elementRef.nativeElement.value = sanitized
  }

  /** @internal */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  /** @internal */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  /** @internal */
  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.value.set(target.value)
  }

  protected onBlur(): void {
    this.onTouched()
  }

  private reset(): void {
    const element = this.elementRef.nativeElement
    element.value = ''
  }
}
