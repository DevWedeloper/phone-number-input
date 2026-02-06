import type { Mode, PhoneInputConfig } from '@phone-number-input/core'
import type { CountryCode } from 'libphonenumber-js/core'
import { Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { updatePhoneState } from '@phone-number-input/core'
import { combineLatest, distinctUntilChanged, map, merge, scan, shareReplay, Subject } from 'rxjs'

/**
 * @internal
 * Manages phone input state, including value, selected country, config, and derived state.
 */
@Injectable()
export class PhoneStateData {
  private input$ = new Subject<string>()
  private config$ = new Subject<PhoneInputConfig>()
  private setSelectedCountry$ = new Subject<CountryCode | null>()

  private state$ = combineLatest([
    this.config$,
    merge(
      this.input$.pipe(map(value => ({ action: 'input' as const, value }))),
      this.setSelectedCountry$.pipe(map(value => ({ action: 'country-select' as const, value }))),
    ),
  ]).pipe(
    scan(
      (prev, [config, event]) => updatePhoneState(prev, config, event),
      {
        mode: 'auto' as Mode,
        derivedMode: 'international' as Exclude<Mode, 'auto'>,
        input: '',
        country: null as CountryCode | null,
        phone: '',
        resetInput: false,
      },
    ),
    shareReplay({ refCount: true, bufferSize: 1 }),
  )

  private phone$ = this.state$.pipe(
    map(state => state.phone),
  )

  private selectedCountry$ = this.state$.pipe(
    map(state => state.country),
  )

  private countryAndDerivedMode$ = this.state$.pipe(
    map(state => ({ country: state.country, derivedMode: state.derivedMode })),
    distinctUntilChanged((prev, curr) => (
      prev.country === curr.country && prev.derivedMode === curr.derivedMode
    )),
  )

  private inputReset$ = this.state$.pipe(
    map(state => state.resetInput),
  )

  phone = toSignal(this.phone$, { initialValue: '' })
  selectedCountry = toSignal(this.selectedCountry$, { initialValue: null })
  countryAndDerivedMode = toSignal(this.countryAndDerivedMode$, { initialValue: {
    country: null,
    derivedMode: 'international',
  } })

  inputReset = toSignal(this.inputReset$, { initialValue: false })

  setInput(input: string): void {
    this.input$.next(input)
  }

  setConfig(config: PhoneInputConfig): void {
    this.config$.next(config)
  }

  setCountry(country: CountryCode | null): void {
    this.setSelectedCountry$.next(country)
  }
}
