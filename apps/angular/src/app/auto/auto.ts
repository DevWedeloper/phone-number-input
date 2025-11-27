import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MaskitoDirective} from '@maskito/angular';
import { phoneAutoGenerator } from '../phone';
import metadata from 'libphonenumber-js/min/metadata';

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
  protected mask = phoneAutoGenerator({
      isInitialModeInternational: true,
      metadata,
  });
}
