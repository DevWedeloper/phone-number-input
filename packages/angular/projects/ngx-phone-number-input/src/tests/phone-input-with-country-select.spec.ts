import { Component, inject } from '@angular/core'
import * as maskito from '@phone-number-input/maskito'
import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { CountryCodeTrigger } from '../country-code-trigger'
import { PhoneField } from '../phone-field'
import { PhoneInput } from '../phone-input'
import { PhoneStateData } from '../phone-state-data'

describe('phone-input-with-country-select', () => {
  @Component({
    selector: 'country-selector-test',
    standalone: true,
    imports: [CountryCodeTrigger],
    template: `
      <button countryCodeTrigger [countryCode]="'US'">US</button>
      <span>Selected country: {{ selectedCountry() }}</span>
    `,
  })
  class CountrySelectorTestComponent {
    selectedCountry = inject(PhoneStateData).selectedCountry
  }

  @Component({
    standalone: true,
    imports: [PhoneInput, PhoneField, CountrySelectorTestComponent],
    template: `
      <phone-field>
        <country-selector-test />
        <input type="tel" placeholder="Input" phoneInput />
      </phone-field>
    `,
  })
  class TestComponent {}

  const setup = async () => {
    await render(TestComponent)

    return {
      user: userEvent.setup(),
      countryCodeTrigger: screen.getByText('US') as HTMLButtonElement,
      selectedCountry: screen.getByText(/Selected country:/) as HTMLSpanElement,
    }
  }

  it('updates selectedCountry when a country is chosen', async () => {
    const { user, countryCodeTrigger, selectedCountry } = await setup()

    expect(selectedCountry.textContent).toBe('Selected country: ')

    await user.click(countryCodeTrigger)

    expect(selectedCountry.textContent).toBe('Selected country: US')
  })

  it('triggers mask recomputation when country is changed', async () => {
    const autoSpy = vi.spyOn(maskito, 'phoneAutoGenerator')

    const { user, countryCodeTrigger } = await setup()

    let lastCall = autoSpy.mock.lastCall![0]
    expect(lastCall.isInitialModeInternational).toBe(true)

    await user.click(countryCodeTrigger)

    lastCall = autoSpy.mock.lastCall![0]
    expect(lastCall.isInitialModeInternational).toBe(false)
  })
})
