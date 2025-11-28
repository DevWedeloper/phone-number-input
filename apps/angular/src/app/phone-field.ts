import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PhoneState } from './phone-state';

@Component({
  selector: 'phone-field',
  template: `
    <ng-content />
  `,
  providers: [PhoneState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneField {

}
