import { Component } from '@angular/core';
import { Auto } from './auto/auto';
import { National } from './national/national';
import { International } from './international/international';

@Component({
  selector: 'app-root',
  imports: [Auto, National, International],
  host: {
    class: 'flex min-h-screen justify-center items-center',
  },
  template: `
    <div class="flex flex-col gap-4">
      <app-auto />
      <app-national />
      <app-international />
    </div>
  `,
})
export class App { }
