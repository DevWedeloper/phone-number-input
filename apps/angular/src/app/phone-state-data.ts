import { Injectable } from '@angular/core';
import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import { Mode } from './types/state';
import { PhoneInputConfig } from './types/config';
import { combineLatest, concat, delay, distinctUntilChanged, filter, map, merge, of, pairwise, scan, shareReplay, Subject, switchMap, tap } from 'rxjs';
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
        const [config, event] = curr;
        const { mode } = config;
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
              const prefix = `+${getCountryCallingCode(next.country, metadata)}`;
              next = {
                ...next,
                phone: prefix + next.input.replace(/[^\d+]/g, ''),
              };
            }
          }
        }

        if (mode === 'international') {
          // Always start from a consistent international baseline
          next = {
            ...next,
            derivedMode: 'international',
            country: next.country ?? config.countryCode,
            phone: next.input.replace(/[^\d+]/g, ''),
          };  

          if (action === 'country-select') {
            // If country change is NOT allowed → force back to config country
            if (config.allowCountryChange === false) {
              next = { ...next, country: config.countryCode };
            } else {
              // Country change allowed → reset input
              const isNewCountry = prev.country !== value;

              next = {
                ...next,
                country: value,
                input: isNewCountry ? '' : next.input,
              };
            }
          }
        }
        
        if (mode === 'national') {
          // Keep state consistent for national mode
          next = {
            ...next,
            derivedMode: 'national',
            country: next.country ?? config.countryCode,
          };

          // Compute phone only if input is not empty
          const sanitized = next.input.replace(/[^\d]/g, '');
          if (sanitized.trim()) {
            const prefix = `+${getCountryCallingCode(next.country!, metadata)}`;
            next = { ...next, phone: prefix + sanitized };
          } else {
            next = { ...next, phone: '' };
          }

          if (action === 'country-select') {
            if (config.allowCountryChange === false) {
              // Force country back to configured default
              next = { ...next, country: config.countryCode };
            } else {
              const isNewCountry = prev.country !== value;

              next = {
                ...next,
                country: value,
                input: isNewCountry ? '' : next.input,
              };
            }
          }
        }

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
    this.state$.subscribe((state) => console.log('State:', state));
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
