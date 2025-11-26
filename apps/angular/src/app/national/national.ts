import { ChangeDetectionStrategy, Component } from '@angular/core';
import mask from './mask';
import {MaskitoDirective} from '@maskito/angular';

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
  protected mask = mask;
}
