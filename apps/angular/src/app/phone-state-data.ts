import { Injectable } from '@angular/core';
import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import { Mode, PhoneState } from './types/state';
import { PhoneInputConfig } from './types/config';
import { combineLatest, concat, delay, distinctUntilChanged, distinctUntilKeyChanged, map, merge, of, pairwise, scan, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class PhoneStateData {
  private input$ = new Subject<string>();
  private config$ = new Subject<PhoneInputConfig>();
  private setSelectedCountry$ = new Subject<CountryCode | null>();

  private countrySelect$ = this.setSelectedCountry$.pipe(
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private state$ = combineLatest([
    this.config$,
    merge(
      this.input$.pipe(map((value) => ({ action: 'input' as const, value }))), 
      this.countrySelect$.pipe(map((value) => ({ action: 'country-select' as const, value }))), 
    )
  ]).pipe(
    scan(
      (prev, curr) => {
        const [{ mode }, event] = curr;
        const { action, value } = event;

        let next = {
          ...prev,
          mode,
        };

        // --- Handle base events ---
        if (action === 'input') {
          next = { ...next, input: value };
        } else if (action === 'country-select') {
          next = { ...next, country: value };
        }

        // --- Mode: AUTO ---
        if (mode === 'auto') {
          // Country selection forces national mode
          if (action === 'country-select') {
            next = {
              ...next,
              derivedMode: 'national',
              input: '',
            };
          }

          // Leading "+" forces international mode
          if (next.input.startsWith('+')) {
            next = {
              ...next,
              derivedMode: 'international',
            };
          }

          // --- Derived: INTERNATIONAL ---
          if (next.derivedMode === 'international') {
            const formatter = new AsYouType(
              { defaultCountry: undefined },
              metadata
            );

            formatter.input(next.input);

            next = {
              ...next,
              country: formatter.getCountry() ?? null,
              phone: next.input.replace(/[^\d+]/g, ''),
            };
          }

          // --- Derived: NATIONAL ---
          if (next.derivedMode === 'national' && next.country) {
            // If no input → phone should be empty
            if (!next.input.trim()) {
              next = { ...next, phone: '' };
            } else {
              const cc = getCountryCallingCode(next.country, metadata);
              next = {
                ...next,
                phone: cc + next.input.replace(/[^\d+]/g, ''),
              };
            }
          }
        }

        // TODO: handle mode === 'international' or 'national'

        return next;
      }, {
        mode: 'auto' as Mode,
        derivedMode: 'international' as Exclude<Mode, 'auto'>,
        input: '',
        country: null as CountryCode | null,
        phone: '',
      }
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  )

  private phone$ = this.state$.pipe(
    map((state) => state.phone)
  )
  private selectedCountry$ = this.state$.pipe(
    map((state) => state.country)
  )
  private countryAndDerivedMode$ = this.state$.pipe(
    map((state) => ({ country: state.country, derivedMode: state.derivedMode }))
  )
  private inputReset$ = this.countrySelect$.pipe(
    switchMap(() =>
      concat(
        of(true),
        of(false).pipe(delay(0))
      )
    )
  );
  
  phone = toSignal(this.phone$, { initialValue: '' });
  selectedCountry = toSignal(this.selectedCountry$, { initialValue: null });
  countryAndDerivedMode = toSignal(this.countryAndDerivedMode$, { initialValue: {
    country: null,
    derivedMode: 'international'
  } });
  inputReset = toSignal(this.inputReset$, { initialValue: false });

  constructor() {
    this.state$.subscribe((state) => {
      console.log(state);
    })
  }

  setInput(input: string): void {
    this.input$.next(input);
  }

  setConfig(config: PhoneInputConfig): void {
    this.config$.next(config);
  }

  setCountry(country: CountryCode | null): void {
    this.setSelectedCountry$.next(country);
  }
}
