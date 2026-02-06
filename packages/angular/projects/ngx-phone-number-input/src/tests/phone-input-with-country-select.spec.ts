import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import * as maskito from '@phone-number-input/maskito'
import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { CountryCodeTrigger } from '../country-code-trigger'
import { PhoneCountry } from '../phone-country'
import { PhoneField } from '../phone-field'
import { PhoneInput } from '../phone-input'

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
    selectedCountry = inject(PhoneCountry).selectedCountry
  }

  @Component({
    standalone: true,
    imports: [PhoneInput, PhoneField, CountrySelectorTestComponent, FormsModule],
    template: `
      <phone-field>
        <country-selector-test />
        <input type="tel" placeholder="Input" phoneInput [(ngModel)]="value" />
      </phone-field>
    `,
  })
  class TestComponent {
    value = signal('')
  }

  const setup = async () => {
    const { fixture } = await render(TestComponent)

    return {
      user: userEvent.setup(),
      fixture,
      input: screen.getByPlaceholderText('Input') as HTMLInputElement,
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

  it('auto mode: type → switch country → type', async () => {
    const { user, fixture, input, countryCodeTrigger } = await setup()
    const component = fixture.componentInstance

    await user.type(input, '1212555')

    expect(component.value()).toBe('+1212555')

    await user.click(countryCodeTrigger)

    expect(component.value()).toBe('')

    await user.type(input, '212555')

    expect(component.value()).toBe('+1212555')
  })
})
