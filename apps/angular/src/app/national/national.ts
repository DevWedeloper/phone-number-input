import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MaskitoDirective} from '@maskito/angular';
import { phoneNationalGenerator } from '../phone';
import metadata from 'libphonenumber-js/min/metadata';

@Component({
  selector: 'app-national',
  imports: [MaskitoDirective],
  template: `
    <input
      class="border-border border rounded-sm"
      type="tel"
      placeholder="National..."
      [maskito]="mask"
      autocomplete="tel"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class National {
  protected mask = phoneNationalGenerator({
    countryIsoCode: 'PH',
    metadata,
});
}
