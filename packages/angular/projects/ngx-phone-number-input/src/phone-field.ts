import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PhoneCountry } from './phone-country'
import { PhoneStateData } from './phone-state-data'

/**
 * Component representing a phone input field container.
 *
 * This component provides phone input state management via
 * {@link PhoneStateData} and {@link PhoneCountry} services.
 * It uses content projection (`<ng-content />`) for rendering
 * the actual input element, allowing flexible UI composition.
 */
@Component({
  selector: 'phone-field,[phoneField]',
  template: `
    <ng-content />
  `,
  providers: [PhoneStateData, PhoneCountry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneField {

}
