import { Maskito } from '@maskito/core'
import userEvent from '@testing-library/user-event'
import metadata from 'libphonenumber-js/min/metadata'
import { phoneNationalGenerator } from '../phone'

describe('phone-mask-national', () => {
  let input: HTMLInputElement
  let maskedInput: Maskito
  const user = userEvent.setup()

  beforeEach(() => {
    input = document.createElement('input')
    document.body.appendChild(input)

    const maskitoOptions = phoneNationalGenerator({ countryIsoCode: 'US', metadata })
    maskedInput = new Maskito(input, maskitoOptions)
  })

  afterEach(() => {
    maskedInput.destroy()
    input.remove()
  })

  describe('mask behavior', () => {
    it('removes invalid characters', () => {
      user.type(input, 'a')
      expect(input.value).toBe('')
    })

    it('handles pasting international format', async () => {
      await user.click(input)
      await user.paste('+12125551234')

      expect(input.value).toBe('212 555-1234')
    })

    it('handles pasting national format', async () => {
      await user.click(input)
      await user.paste('2125551234')

      expect(input.value).toBe('212 555-1234')
    })

    it('trims extra digits when pasting too-long number', async () => {
      await user.click(input)
      await user.paste('212555123400000')
      expect(input.value).toBe('212 555-1234')
    })

    it('should not allow more digits when number is complete', async () => {
      await user.type(input, '2125551234444444')
      expect(input.value).toBe('212 555-1234')
    })

    it('removes digits correctly with backspace at the end', async () => {
      await user.type(input, '2125551234')
      await user.keyboard('{Backspace}')
      expect(input.value).toBe('212 555-123')

      await user.keyboard('{Backspace}')
      expect(input.value).toBe('212 555-12')
    })
  })

  describe('formatting', () => {
    it('formats correctly', async () => {
      await user.type(input, '2125551234')
      expect(input.value).toBe('212 555-1234')
    })
  })

  describe('cursor position', () => {
    it('inserts digits correctly when typing in the middle', async () => {
      await user.type(input, '2125551234')
      await user.click(input)

      // Move caret to after the area code: "212 555-1234" → caret after "212 "
      await user.keyboard('{Home}{ArrowRight>4}9') // 4 steps to after the space
      await user.type(input, '9') // insert '9' at that position

      // Maskito auto-formats
      expect(input.value).toBe('212 955-5123')
    })

    it('deletes digits correctly when backspacing in the middle', async () => {
      await user.type(input, '2125551234')
      await user.click(input)

      // Move caret to after the second "5" in the middle: "212 555-1234"
      await user.keyboard('{Home}{ArrowRight>7}{Backspace}')
      // Deletes the "5" at that position
      expect(input.value).toBe('212 551-234')

      // Backspace again, deletes the next digit to the left
      await user.keyboard('{Backspace}')
      expect(input.value).toBe('212 512-34')
    })
  })
})
