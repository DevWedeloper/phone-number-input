import { Maskito } from '@maskito/core'
import userEvent from '@testing-library/user-event'
import metadata from 'libphonenumber-js/min/metadata'
import { phoneAutoGenerator } from '../phone'

describe('phone-mask-auto', () => {
  let input: HTMLInputElement
  let maskedInput: Maskito
  const user = userEvent.setup()

  const setup = ({ isInternational}: { isInternational: boolean }) => {
    const maskitoInternationalOptions = phoneAutoGenerator({ isInitialModeInternational: true, countryIsoCode: 'US', metadata })
    const maskitoNationalOptions = phoneAutoGenerator({ isInitialModeInternational: false, countryIsoCode: 'US', metadata })

    if (isInternational) {
      maskedInput = new Maskito(input, maskitoInternationalOptions)
    }
    else {
      maskedInput = new Maskito(input, maskitoNationalOptions)
    }
  }

  beforeEach(() => {
    input = document.createElement('input')
    document.body.appendChild(input)
  })

  afterEach(() => {
    maskedInput.destroy()
    input.remove()
  })

  describe('mask behavior', () => {
    describe('international mode', () => {
      it('adds prefix when typing', async () => {
        setup({ isInternational: true })
        await user.type(input, '1')
        expect(input.value).toBe('+1')
      })

      it('formats pasted national number when default country is provided', async () => {
        setup({ isInternational: true })
        await user.click(input)
        await user.paste('2125551234')

        expect(input.value).toBe('+1 212 555-1234')
      })

      it('pastes complete number', async () => {
        setup({ isInternational: true })

        await user.click(input)
        await user.paste('648885554567')
        expect(input.value).toBe('+64 888 555-4567')
      })
    })

    describe('national mode', () => {
      it('does not add prefix when typing', async () => {
        setup({ isInternational: false })
        await user.type(input, '1')
        expect(input.value).toBe('')
      })

      it('transitions to international mode when starting with +', async () => {
        setup({ isInternational: false })
        await user.type(input, '+1')
        expect(input.value).toBe('+1')
      })
    })
  })
})
