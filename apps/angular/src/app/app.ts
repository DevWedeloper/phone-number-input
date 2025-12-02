import { Component } from '@angular/core';
import { Auto } from './auto/auto';
import { International } from './international/international';
import { National } from './national/national';

@Component({
  selector: 'app-root',
  imports: [Auto, International, National],
  host: {
    class: 'flex min-h-screen justify-center items-center',
  },
  template: `
    <div class="flex flex-col gap-4">
      <app-auto />
      <app-international />
      <app-national />
    </div>
  `,
})
export class App { }
