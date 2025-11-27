import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MaskitoDirective} from '@maskito/angular';
import { phoneInternationalGenerator } from '../phone';
import metadata from 'libphonenumber-js/min/metadata';

@Component({
  selector: 'app-international',
  imports: [MaskitoDirective],
  template: `
    <input
      class="border-border border rounded-sm"
      type="tel"
      placeholder="International..."
      [maskito]="mask"
      autocomplete="tel"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class International {
  protected mask = phoneInternationalGenerator({
    countryIsoCode: 'US',
    metadata,
  });
}
