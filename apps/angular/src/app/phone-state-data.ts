import { Injectable, signal } from '@angular/core';
import { CountryCode } from 'libphonenumber-js';

@Injectable()
export class PhoneStateData {
  private _selectedCountry = signal<CountryCode | null>(null);

  selectedCountry = this._selectedCountry.asReadonly();

  setCountry(country: CountryCode | null) {
    this._selectedCountry.set(country);
  }
}
