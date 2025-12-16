import { ChangeDetectionStrategy, Component } from '@angular/core'
import { PhoneCountry } from './phone-country'
import { PhoneStateData } from './phone-state-data'

@Component({
  selector: 'phone-field',
  standalone: true,
  template: `
    <ng-content />
  `,
  providers: [PhoneStateData, PhoneCountry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneField {

}
