export const autoExample = `
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from 'ngx-phone-number-input'

@Component({
  selector: 'auto',
  imports: [PhoneInput, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <input
        phoneInput
        [(ngModel)]="value"
        type="tel"
        placeholder="Enter phone number"
      />
      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class Auto {
  protected value = signal('')
}
`

export const autoWithCountrySelectExample = `
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneField, PhoneInput } from 'ngx-phone-number-input'
import { CountrySelect } from './country-select'

@Component({
  selector: 'auto-with-country-select',
  imports: [PhoneInput, PhoneField, CountrySelect, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <fieldset phoneField class="flex gap-2">
        <country-select />
        <input
          phoneInput
          [(ngModel)]="value"
          type="tel"
          placeholder="Enter phone number"
        />
      </fieldset>

      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class AutoWithCountrySelect {
  protected value = signal('')
}
`

export const internationalExample = `
import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from 'ngx-phone-number-input'

@Component({
  selector: 'international',
  imports: [PhoneInput, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <input
        phoneInput
        [config]="config"
        [(ngModel)]="value"
        type="tel"
        placeholder="Enter phone number"
      />
      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class International {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'international',
    countryCode: 'US',
  }
}
`

export const internationalWithCountrySelectExample = `
import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneField, PhoneInput } from 'ngx-phone-number-input'
import { CountrySelect } from './country-select'

@Component({
  selector: 'international-with-country-select',
  imports: [PhoneInput, PhoneField, CountrySelect, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <fieldset phoneField class="flex gap-2">
        <country-select />
        <input
          phoneInput
          [config]="config"
          [(ngModel)]="value"
          type="tel"
          placeholder="Enter phone number"
        />
      </fieldset>

      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class InternationalWithCountrySelect {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'international',
    countryCode: 'US',
  }
}
`

export const internationalWithCountrySelectLockedExample = `
import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneField, PhoneInput } from 'ngx-phone-number-input'
import { CountrySelect } from './country-select'

@Component({
  selector: 'international-with-country-select-locked',
  imports: [PhoneInput, PhoneField, CountrySelect, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <fieldset phoneField class="flex gap-2">
        <country-select />
        <input
          phoneInput
          [config]="config"
          [(ngModel)]="value"
          type="tel"
          placeholder="Enter phone number"
        />
      </fieldset>

      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class InternationalWithCountrySelectLocked {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'international',
    countryCode: 'US',
    allowCountryChange: false,
  }
}
`

export const nationalExample = `
import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneInput } from 'ngx-phone-number-input'

@Component({
  selector: 'national',
  imports: [PhoneInput, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <input
        phoneInput
        [config]="config"
        [(ngModel)]="value"
        type="tel"
        placeholder="Enter phone number"
      />
      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class National {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'national',
    countryCode: 'US',
  }
}
`

export const nationalWithCountrySelectExample = `
import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneField, PhoneInput } from 'ngx-phone-number-input'
import { CountrySelect } from './country-select'

@Component({
  selector: 'national-with-country-select',
  imports: [PhoneInput, PhoneField, CountrySelect, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <fieldset phoneField class="flex gap-2">
        <country-select />
        <input
          phoneInput
          [config]="config"
          [(ngModel)]="value"
          type="tel"
          placeholder="Enter phone number"
        />
      </fieldset>

      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class NationalWithCountrySelect {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'national',
    countryCode: 'US',
  }
}
`

export const nationalWithCountrySelectLockedExample = `
import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PhoneField, PhoneInput } from 'ngx-phone-number-input'
import { CountrySelect } from './country-select'

@Component({
  selector: 'national-with-country-select-locked',
  imports: [PhoneInput, PhoneField, CountrySelect, FormsModule],
  template: \`
    <div class="flex flex-col gap-2">
      <fieldset phoneField class="flex gap-2">
        <country-select />
        <input
          phoneInput
          [config]="config"
          [(ngModel)]="value"
          type="tel"
          placeholder="Enter phone number"
        />
      </fieldset>

      <span class="text-sm">
        Value: {{ value() }}
      </span>
    </div>
  \`,
})
export class NationalWithCountrySelectLocked {
  protected value = signal('')

  protected config: PhoneInputConfig = {
    mode: 'national',
    countryCode: 'US',
    allowCountryChange: false,
  }
}
`
