import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PhoneStateData } from './phone-state-data';

@Component({
  selector: 'phone-field',
  template: `
    <ng-content />
  `,
  providers: [PhoneStateData],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneField {

}
