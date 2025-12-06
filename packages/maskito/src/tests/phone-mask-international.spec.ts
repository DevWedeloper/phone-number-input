import { Maskito } from '@maskito/core'
import userEvent from '@testing-library/user-event'
import metadata from 'libphonenumber-js/min/metadata'
import { phoneInternationalGenerator } from '../phone'

describe('phone-mask-international', () => {
  let input: HTMLInputElement
  let maskedInput: Maskito
  const user = userEvent.setup()

  const prefix = '+1 '

  beforeEach(() => {
    input = document.createElement('input')
    document.body.appendChild(input)

    const maskitoOptions = phoneInternationalGenerator({ countryIsoCode: 'US', metadata })
    maskedInput = new Maskito(input, maskitoOptions)
  })

  afterEach(() => {
    maskedInput.destroy()
    input.remove()
  })

  describe('mask behavior', () => {
    it('starts with prefix', () => {
      expect(input.value).toBe(prefix)
    })

    it('preserves prefix on removal', () => {
      user.clear(input)
      expect(input.value).toBe(prefix)
    })

    it('removes invalid characters', () => {
      user.type(input, 'a')
      expect(input.value).toBe(prefix)
    })

    it('handles pasting international format', async () => {
      await user.click(input)
      await userEvent.paste('+12125551234')

      expect(input.value).toBe('+1 212 555-1234')
    })

    it('handles pasting national format', async () => {
      await user.click(input)
      await userEvent.paste('2125551234')

      expect(input.value).toBe('+1 212 555-1234')
    })

    it('should not allow more digits when number is complete', async () => {
      await user.type(input, '2125551234444444')
      expect(input.value).toBe('+1 212 555-1234')
    })

    it('removes digits correctly with backspace at the end', async () => {
      await user.type(input, '2125551234')
      await user.keyboard('{Backspace}')
      expect(input.value).toBe('+1 212 555-123')

      await user.keyboard('{Backspace}')
      expect(input.value).toBe('+1 212 555-12')
    })
  })

  describe('formatting', () => {
    it('formats correctly', async () => {
      await user.type(input, '2125551234')
      expect(input.value).toBe('+1 212 555-1234')
    })
  })

  describe('cursor position', () => {
    it('inserts digits correctly when typing in the middle', async () => {
      await user.type(input, '2125551234')
      await user.click(input)
      await user.keyboard('{Home}{ArrowRight>6}9')

      expect(input.value).toBe('+1 212 955-5123')
    })

    it('deletes digits correctly when backspacing in the middle', async () => {
      await user.type(input, '2125551234')
      await user.click(input)

      // Move caret to after the second "5" in the middle
      // "+1 212 555-1234" → caret after the second "5" in "555"
      await user.keyboard('{Home}{ArrowRight>9}{Backspace}')
      // Deletes the "5" at that position
      expect(input.value).toBe('+1 212 551-234')

      // Backspace again, deletes the next digit to the left
      // "+1 212 551-234" → deletes the "5" in "51"
      await user.keyboard('{Backspace}')
      expect(input.value).toBe('+1 212 512-34')
    })
  })
})
