import {
  ChangeDetectionStrategy, 
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { CountryCodeTrigger, PhoneStateData } from '@phone-number-input/angular';

@Component({
  selector: 'country-select',
  standalone: true,
  imports: [CountryCodeTrigger],
  host: {
    class: 'inline-block relative border-border border rounded-sm w-10'
  },
  template: `
    <button
      #trigger
      (click)="openDropdown()"
      class="flex items-center justify-center w-full"
    >
      @if (selectedCountry()) {
        <span class="text-xl">{{ flag(selectedCountry()!) }}</span>
      } @else {
        <span class="text-xl text-muted-foreground">n/a</span>
      }
    </button>

    <ng-template #dropdownPanel>
      <div
        class="flex flex-col border rounded-md bg-background"
      >
        <input
          #searchInput
          type="text"
          placeholder="Search..."
          class="px-3 py-2 border-b outline-none"
          (input)="searchText.set(searchInput.value)"
        />

        <div class="overflow-y-auto max-h-56">
          <button
            class="px-3 py-2 cursor-pointer block"
            (click)="choose()"
            countryCodeTrigger
            [countryCode]="null"
          >
            <span class="ml-2">Select country</span>
          </button>
          @for (country of filtered(); track $index) {
            <button
              class="px-3 py-2 cursor-pointer block"
              (click)="choose()"
              countryCodeTrigger
              [countryCode]="country"
            >
              <span class="text-xl">{{ flag(country) }}</span>
              <span class="ml-2">{{ country }} ({{ dialCode(country) }})</span>
            </button>
          }
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountrySelect {
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private PhoneStateData = inject(PhoneStateData);

  private dropdownPanel = viewChild.required<TemplateRef<any>>('dropdownPanel');
  private trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');

  private overlayRef!: OverlayRef;

  private countries = getCountries();
  protected searchText = signal('');
  protected filtered = computed(() => this.countries.filter(c => c.toLowerCase().includes(this.searchText())));
  protected selectedCountry = this.PhoneStateData.selectedCountry;

  protected openDropdown() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.trigger().nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ])
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
      this.searchText.set('');
    });

    const portal = new TemplatePortal(this.dropdownPanel(), this.vcr);
    this.overlayRef.attach(portal);
  }

  protected choose() {
    this.overlayRef.dispose();
      this.searchText.set('');
  }

  protected dialCode(country: CountryCode): string {
    return '+' + getCountryCallingCode(country);
  }

  protected flag(country: CountryCode): string {
    return country
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }
}
