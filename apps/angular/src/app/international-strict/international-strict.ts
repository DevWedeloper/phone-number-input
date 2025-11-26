import { ChangeDetectionStrategy, Component } from '@angular/core';
import mask from './mask';
import {MaskitoDirective} from '@maskito/angular';

@Component({
  selector: 'app-international-strict',
  imports: [MaskitoDirective],
  template: `
    <input
      class="border-border border rounded-sm"
      type="tel"
      placeholder="International strict..."
      [maskito]="mask"
      autocomplete="tel"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalStrict {
  protected mask = mask;
}
