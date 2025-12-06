import type { PhoneInputConfig, PhoneState } from '../types'
import { updatePhoneState } from '../phone-state'

describe('phone-state', () => {
  const initialState: PhoneState = {
    mode: 'auto',
    derivedMode: 'international',
    input: '',
    country: null,
    phone: '',
    resetInput: false,
  }

  it('sets resetInput when country changes', () => {
    const state = { ...initialState, country: 'US' as const, input: '555', phone: '555' }

    const next = updatePhoneState(state, { mode: 'auto' }, {
      action: 'country-select',
      value: 'CA',
    })

    expect(next.resetInput).toBe(true)
    expect(next.country).toBe('CA')
    expect(next.input).toBe('')
    expect(next.phone).toBe('')
  })

  describe('auto mode', () => {
    const config: PhoneInputConfig = {
      mode: 'auto',
    }

    it('country-select sets derivedMode=national and resets input', () => {
      const state = { ...initialState, country: 'US' as const }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.country).toBe('CA')
      expect(next.derivedMode).toBe('national')
      expect(next.input).toBe('')
      expect(next.resetInput).toBe(true)
    })

    it('country-select with null sets derivedMode=international', () => {
      const state = { ...initialState, country: 'US' as const }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: null,
      })

      expect(next.country).toBe(null)
      expect(next.derivedMode).toBe('international')
    })

    it('typing + forces derivedMode=international', () => {
      const state = { ...initialState, input: '' }

      const next = updatePhoneState(state, config, {
        action: 'input',
        value: '+44',
      })

      expect(next.derivedMode).toBe('international')
    })

    it('international mode auto detects country', () => {
      const next = updatePhoneState(initialState, config, {
        action: 'input',
        value: '+442079460958',
      })

      expect(next.country).toBe('GB')
      expect(next.phone).toBe('+442079460958')
    })

    it('switching from international → national triggers resetInput', () => {
      const state = {
        ...initialState,
        derivedMode: 'international' as const,
        country: null,
        input: '+44',
      }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'GB',
      })

      expect(next.country).toBe('GB')
      expect(next.derivedMode).toBe('national')
      expect(next.resetInput).toBe(true)
      expect(next.input).toBe('')
      expect(next.phone).toBe('')
    })

    it('national mode produces expected phone output', () => {
    // === Non-empty case ===
      let state = {
        ...initialState,
        country: 'GB' as const,
        derivedMode: 'national' as const,
      }

      let next = updatePhoneState(state, config, {
        action: 'input',
        value: '2079460958',
      })

      expect(next.phone).toBe('+442079460958')

      // === Empty input case ===
      state = {
        ...initialState,
        country: 'GB' as const,
        derivedMode: 'national' as const,
      }

      next = updatePhoneState(state, config, {
        action: 'input',
        value: '',
      })

      expect(next.phone).toBe('')
    })

    it('auto mode retains previous state properties when unrelated input is given', () => {
      const next = updatePhoneState(initialState, config, {
        action: 'input',
        value: '555',
      })

      expect(next.input).toBe('555')
      expect(next.resetInput).toBe(false)
      expect(next.mode).toBe('auto')
      expect(next.country).toBe(null)
      expect(next.phone).toBe('555')
    })
  })

  describe('international mode', () => {
    const config: PhoneInputConfig = {
      mode: 'international',
      countryCode: 'US',
    }

    it('input updates phone and sets derivedMode to international', () => {
      const next = updatePhoneState(initialState, config, {
        action: 'input',
        value: '123456789',
      })

      expect(next.input).toBe('123456789')
      expect(next.derivedMode).toBe('international')
      expect(next.phone).toBe('123456789')
    })

    it('country defaults to config.countryCode if not set', () => {
      const next = updatePhoneState(initialState, config, {
        action: 'input',
        value: '5551234',
      })

      expect(next.country).toBe('US')
      expect(next.phone).toBe('5551234')
    })

    it('country-select updates country and resets input if changed', () => {
      const state = { ...initialState, country: 'US' as const, input: '555' }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.country).toBe('CA')
      expect(next.input).toBe('')
      expect(next.resetInput).toBe(true)
      expect(next.phone).toBe('')
    })

    it('country-select respects allowCountryChange = false', () => {
      const state = { ...initialState, input: '555' }
      const cfg = { ...config, allowCountryChange: false }

      const next = updatePhoneState(state, cfg, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.country).toBe('US')
      expect(next.input).toBe('555')
      expect(next.phone).toBe('555')
    })

    it('country-select leaves input if selecting same country', () => {
      const state = { ...initialState, country: 'US' as const, input: '555' }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'US',
      })

      expect(next.country).toBe('US')
      expect(next.input).toBe('555')
      expect(next.resetInput).toBe(false)
      expect(next.phone).toBe('555')
    })

    it('derivedMode remains international after country-select', () => {
      const next = updatePhoneState(initialState, config, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.derivedMode).toBe('international')
    })
  })

  describe('national mode', () => {
    const config: PhoneInputConfig = {
      mode: 'national',
      countryCode: 'US',
    }

    it('input updates phone using national formatting', () => {
      let state = { ...initialState, country: 'US' as const }

      let next = updatePhoneState(state, config, {
        action: 'input',
        value: '5551234',
      })

      expect(next.phone).toBe('+15551234')
      expect(next.derivedMode).toBe('national')

      state = { ...initialState, country: 'US' as const }

      next = updatePhoneState(state, config, {
        action: 'input',
        value: '',
      })

      expect(next.phone).toBe('')
    })

    it('country defaults to config.countryCode if not set', () => {
      const state = { ...initialState, country: 'US' as const }

      const next = updatePhoneState(state, config, {
        action: 'input',
        value: '5551234',
      })

      expect(next.country).toBe('US')
      expect(next.phone).toBe('+15551234')
    })

    it('country-select updates country and resets input if changed', () => {
      const state = { ...initialState, country: 'US' as const, input: '5551234', phone: '+15551234' }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.country).toBe('CA')
      expect(next.input).toBe('')
      expect(next.phone).toBe('')
      expect(next.resetInput).toBe(true)
      expect(next.derivedMode).toBe('national')
    })

    it('country-select respects allowCountryChange = false', () => {
      const state = { ...initialState, country: 'US' as const, input: '555', phone: '+1555' }
      const cfg = { ...config, allowCountryChange: false }

      const next = updatePhoneState(state, cfg, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.country).toBe('US')
      expect(next.input).toBe('555')
      expect(next.phone).toBe('+1555')
      expect(next.derivedMode).toBe('national')
    })

    it('country-select leaves input if selecting same country', () => {
      const state = { ...initialState, country: 'US' as const, input: '555', phone: '+1555' }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'US',
      })

      expect(next.country).toBe('US')
      expect(next.input).toBe('555')
      expect(next.phone).toBe('+1555')
      expect(next.resetInput).toBe(false)
      expect(next.derivedMode).toBe('national')
    })

    it('derivedMode remains national after country-select', () => {
      const state = { ...initialState, country: 'US' as const, input: '555', phone: '+1555' }

      const next = updatePhoneState(state, config, {
        action: 'country-select',
        value: 'CA',
      })

      expect(next.derivedMode).toBe('national')
    })
  })
})
