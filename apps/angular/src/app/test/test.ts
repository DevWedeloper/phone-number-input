import { ChangeDetectionStrategy, Component } from '@angular/core';
import mask from './mask';
import {MaskitoDirective} from '@maskito/angular';

@Component({
  selector: 'app-test',
  imports: [MaskitoDirective],
  template: `
    <input
      class="border-border border rounded-sm"
      type="tel"
      placeholder="Test..."
      [maskito]="mask"
      autocomplete="tel"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test {
  protected mask = mask;
}
