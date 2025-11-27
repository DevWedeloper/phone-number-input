import { Component } from '@angular/core';
import { International } from './international/international';
import { National } from './national/national';
import { InternationalStrict } from './international-strict/international-strict';

@Component({
  selector: 'app-root',
  imports: [International, National, InternationalStrict],
  host: {
    class: 'flex min-h-screen justify-center items-center',
  },
  template: `
    <div class="flex flex-col gap-4">
      <app-international />
      <app-national />
      <app-international-strict />
    </div>
  `,
})
export class App { }
