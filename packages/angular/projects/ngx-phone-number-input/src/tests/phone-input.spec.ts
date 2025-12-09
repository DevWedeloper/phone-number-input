import type { PhoneInputConfig } from 'ngx-phone-number-input'
import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import * as maskito from '@phone-number-input/maskito'
import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { PhoneInput } from '../phone-input'

describe('phone-input', () => {
  @Component({
    template: `<input type="tel" placeholder="Input" phoneInput [config]="config" [(ngModel)]="value" />`,
    imports: [PhoneInput, FormsModule],
    standalone: true,
  })
  class TestComponent {
    config: PhoneInputConfig = { mode: 'auto' }
    value = signal('')
  }

  const setup = async () => {
    const { fixture } = await render(TestComponent)

    return {
      user: userEvent.setup(),
      fixture,
      directive: fixture.debugElement.query(d => !!d.injector.get(PhoneInput, null)).injector.get(PhoneInput),
      input: screen.getByPlaceholderText('Input') as HTMLInputElement,
    }
  }

  describe('CVA', () => {
    it('should update input value when writeValue is called', async () => {
      const { fixture, directive } = await setup()
      const component = fixture.componentInstance

      directive.writeValue('12345')
      fixture.detectChanges()

      expect(component.value()).toBe('12345')
    })

    it('should update ngModel when typing in input', async () => {
      const { fixture, input, user } = await setup()
      const component = fixture.componentInstance

      await user.type(input, '98765')

      expect(component.value()).toBe('+98765')
    })

    it('should call onTouched when input is blurred', async () => {
      const { directive, input } = await setup()
      const touchedSpy = vitest.fn()
      directive.registerOnTouched(touchedSpy)
      input.dispatchEvent(new Event('blur'))

      expect(touchedSpy).toHaveBeenCalled()
    })

    it('should enable/disable input via setDisabledState', async () => {
      const { fixture, input, directive } = await setup()

      // Disable the input
      directive.setDisabledState(true)
      fixture.detectChanges()
      expect(input.disabled).toBe(true)

      // Enable the input
      directive.setDisabledState(false)
      fixture.detectChanges()
      expect(input.disabled).toBe(false)
    })
  })

  describe('mask switching', () => {
    it('should update mask', async () => {
      const autoSpy = vi.spyOn(maskito, 'phoneAutoGenerator')
      const internationalSpy = vi.spyOn(maskito, 'phoneInternationalGenerator')

      const { fixture } = await setup()

      expect(autoSpy).toHaveBeenCalled()

      fixture.componentInstance.config = { mode: 'international', countryCode: 'US' }
      fixture.detectChanges()

      expect(internationalSpy).toHaveBeenCalled()
    })
  })

  describe('basic typing', () => {
    it('auto mode: basic typing works', async () => {
      const { fixture, input } = await setup()
      const component = fixture.componentInstance

      await userEvent.type(input, '12345')

      expect(component.value()).toBe('+12345')
    })

    it('international mode: basic typing works', async () => {
      const { fixture, input } = await setup()
      const component = fixture.componentInstance

      component.config = { mode: 'international', countryCode: 'US' }
      fixture.detectChanges()

      await userEvent.type(input, '2345')

      expect(component.value()).toBe('+12345')
    })

    it('national mode: basic typing works', async () => {
      const { fixture, input } = await setup()
      const component = fixture.componentInstance

      component.config = { mode: 'national', countryCode: 'US' }
      fixture.detectChanges()

      await userEvent.type(input, '2345')

      expect(component.value()).toBe('+12345')
    })
  })
})
