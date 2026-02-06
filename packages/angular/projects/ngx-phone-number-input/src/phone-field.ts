import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PhoneCountry } from './phone-country'
import { PhoneStateData } from './phone-state-data'

/** Container for a phone input field, managing its state. */
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
