import { Injectable } from '@angular/core';
import { AsYouType, CountryCode } from 'libphonenumber-js/core';
import metadata from 'libphonenumber-js/min/metadata';
import { Mode } from './types/state';
import { PhoneInputConfig } from './types/config';
import { combineLatest, map, merge, scan, shareReplay, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { formatNationalPhone, handleCountrySelect } from './utils';

@Injectable()
export class PhoneStateData {
  private input$ = new Subject<string>();
  private config$ = new Subject<PhoneInputConfig>();
  private setSelectedCountry$ = new Subject<CountryCode | null>();

  private state$ = combineLatest([
    this.config$,
    merge(
      this.input$.pipe(map((value) => ({ action: 'input' as const, value }))), 
      this.setSelectedCountry$.pipe(map((value) => ({ action: 'country-select' as const, value }))), 
    )
  ]).pipe(
    scan(
      (prev, curr) => {
        const [config, event] = curr;
        const { mode } = config;
        const { action, value } = event;

        let next = {
          ...prev,
          resetInput: false,
          mode,
        };

        if (action === 'input') {
          next = { ...next, input: value };
        } else if (action === 'country-select') {
          next = { ...next, country: value, phone: value ? next.phone : '', input: value ? next.input : '' };
        }

        if (action === 'country-select' && prev.country !== next.country) {
          next = { ...next, resetInput: true };
        }

        if (mode === 'auto') {
          if (action === 'country-select') {
            next = {
              ...next,
              derivedMode: value ? 'national' : 'international',
              input: '',
            };
          }

          if (next.input.startsWith('+')) {
            next = {
              ...next,
              derivedMode: 'international',
            };
          }

          if (prev.derivedMode === 'international' && next.derivedMode === 'national') {
            next = { ...next, resetInput: true };
          }

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

          if (next.derivedMode === 'national' && next.country) {
            next = { ...next, phone: formatNationalPhone(next.input, next.country, metadata) };
          }
        }

        if (mode === 'international') {
          next = {
            ...next,
            derivedMode: 'international',
            country: next.country ?? config.countryCode,
            phone: next.input.replace(/[^\d+]/g, ''),
          };  

          if (action === 'country-select') {
            next = handleCountrySelect(prev.country, next, value, config);
          }
        }
        
        if (mode === 'national') {
          const country = next.country ?? config.countryCode;

          next = {
            ...next,
            derivedMode: 'national',
            country,
            phone: formatNationalPhone(next.input, country, metadata),
          };

          if (action === 'country-select') {
            next = handleCountrySelect(prev.country, next, value, config);
          }
        }

        return next;
      }, {
        mode: 'auto' as Mode,
        derivedMode: 'international' as Exclude<Mode, 'auto'>,
        input: '',
        country: null as CountryCode | null,
        phone: '',
        resetInput: false
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
  private inputReset$ = this.state$.pipe(
    map((state) => state.resetInput),
  );
  
  phone = toSignal(this.phone$, { initialValue: '' });
  selectedCountry = toSignal(this.selectedCountry$, { initialValue: null });
  countryAndDerivedMode = toSignal(this.countryAndDerivedMode$, { initialValue: {
    country: null,
    derivedMode: 'international'
  } });
  inputReset = toSignal(this.inputReset$, { initialValue: false });

  constructor() {
    this.state$.subscribe(console.log)
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
