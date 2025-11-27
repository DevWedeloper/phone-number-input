import { ChangeDetectionStrategy, Component } from '@angular/core';
import mask from './mask';
import {MaskitoDirective} from '@maskito/angular';

@Component({
  selector: 'app-auto',
  imports: [MaskitoDirective],
  template: `
    <input
      class="border-border border rounded-sm"
      type="tel"
      placeholder="Auto..."
      [maskito]="mask"
      autocomplete="tel"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auto {
  protected mask = mask;
}
