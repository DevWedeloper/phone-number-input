# React Phone Number Input — Comprehensive Notes

## Variants
- **With country select** (default export).
- **Without country select** (import from `react-phone-number-input/input`).

---

## Country & Format Behavior

### Country Selection Logic
- `defaultCountry`:  
  Enables national format for the default country **and** international format for any country.
- `country`:  
  Restricts input to **national format** for that country.
- `international` (boolean):
  - `true`: forces **international format** (input begins with `+`).
  - `false`: forces **national format**.
- `withCountryCallingCode`:  
  Displays a non-editable country calling code inside the `<input/>`.
- `countryCallingCodeEditable`:  
  Allows editing the calling code when using `withCountryCallingCode`.

### Special Formatting Rules
- `country` + `international=true`:
  - Input is **international format for that specific country**,  
  - **But without the country-calling-code part** (e.g., `+1` is displayed externally, not typed).
- Using only `defaultCountry`:
  - User can type either **national for defaultCountry**,  
  - Or **international for any country**.
- No `country` and no `defaultCountry`:
  - Input is **strictly international**.

### Initial Value Behavior
- `initialValueFormat`:
  - `"international"` (default): initial value formatted internationally.
  - `"national"`: initial value formatted in national format (if applicable).
- `displayInitialValueAsLocalNumber`:
  - `false` (default): initial value remains international.
  - `true`: initial value is reformatted as **local/national number** when possible.

---

## Props / Inputs

- `placeholder`
- `value`
- `onChange(value: string)`
- `defaultCountry`
- `country`
- `international`
- `withCountryCallingCode`
- `countryCallingCodeEditable`
- `initialValueFormat`
- `displayInitialValueAsLocalNumber`
- `inputComponent` — custom `<input/>` renderer.
- `countrySelectProps` — e.g., `{ unicodeFlags: true }`.
- `labels` — localized country names (for internationalization).
- `error` — validation error message.

---

## Outputs
- `onChange(value: string)` — returns phone number in **E.164** when valid.

---

## Utility Functions

### Formatting
- `formatPhoneNumber(value: string)` → National format.
- `formatPhoneNumberIntl(value: string)` → International format.

### Validation
- `isValidPhoneNumber(value: string)` → Strict validation.
- `isPossiblePhoneNumber(value: string)` → Length-only validation.

### Country Helpers
- `getCountries()` → List of country codes.
- `getCountryCallingCode(country: string)` → Calling code for a country.

---

## Notes & Implementation Details

- Initial value formatting is affected by both  
  `initialValueFormat` and `displayInitialValueAsLocalNumber`.
- Custom `<input/>` components must accept:
  - `value` (string)
  - `onChange(event)`
- Without the built-in country select, you can construct your own using:
  - `getCountries()`  
  - `getCountryCallingCode()`
- `international=true` ensures the number always starts with `"+"`.
- Unicode flags may not display on older OS fonts (e.g., Windows 10 shows 2-letter codes).
