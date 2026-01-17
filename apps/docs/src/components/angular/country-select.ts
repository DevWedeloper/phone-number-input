import type { OverlayRef } from '@angular/cdk/overlay'
import type {
  ElementRef,
  TemplateRef,
} from '@angular/core'
import type { CountryCode } from 'libphonenumber-js/core'
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core'
import { CountryCodeTrigger, PhoneCountry } from '@phone-number-input/angular'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/core'
import metadata from 'libphonenumber-js/min/metadata'

@Component({
  selector: 'country-select',
  imports: [CountryCodeTrigger],
  host: {
    class: 'inline-block relative w-10 border',
  },
  template: `
    <button
      #trigger
      type="button"
      class="flex items-center justify-center w-full"
      (click)="open()"
    >
      @if (selectedCountry()) {
        <span class="text-xl">{{ flag(selectedCountry()!) }}</span>
      } @else {
        <span class="text-xl">n/a</span>
      }
    </button>

    <ng-template #dropdown>
      <div class="flex flex-col border">
        <input
          #search
          type="text"
          placeholder="Search..."
          class="px-3 py-2 border-b outline-none"
          (input)="searchText.set(search.value)"
        />

        <div class="max-h-56 overflow-y-auto">
          <button
            class="block px-3 py-2 text-left cursor-pointer border-b w-full"
            countryCodeTrigger
            [countryCode]="null"
            (click)="select()"
          >
            Select country
          </button>

          @for (country of filteredCountries(); track country) {
            <button
              class="block px-3 py-2 text-left cursor-pointer border-b last:border-b-0 w-full"
              countryCodeTrigger
              [countryCode]="country"
              (click)="select()"
            >
              <span class="text-xl">{{ flag(country) }}</span>
              <span class="ml-2">
                {{ country }} ({{ dialCode(country) }})
              </span>
            </button>
          }
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountrySelect {
  private readonly overlay = inject(Overlay)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly phoneCountry = inject(PhoneCountry)
  private readonly sso = inject(ScrollStrategyOptions)

  private readonly dropdownTemplate
    = viewChild.required<TemplateRef<unknown>>('dropdown')

  private readonly trigger
    = viewChild.required<ElementRef<HTMLButtonElement>>('trigger')

  private overlayRef?: OverlayRef

  private readonly countries = getCountries(metadata)

  protected readonly searchText = signal('')
  protected readonly selectedCountry = this.phoneCountry.selectedCountry

  protected readonly filteredCountries = computed(() => {
    const query = this.searchText().toLowerCase()
    return this.countries.filter(country =>
      country.toLowerCase().includes(query),
    )
  })

  protected open(): void {
    this.close()

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger().nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ])
      .withFlexibleDimensions(false)
      .withPush(true)

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.sso.reposition(),
    })

    this.overlayRef.backdropClick().subscribe(() => this.close())

    const portal = new TemplatePortal(
      this.dropdownTemplate(),
      this.viewContainerRef,
    )

    this.overlayRef.attach(portal)
  }

  protected select(): void {
    this.close()
  }

  private close(): void {
    this.overlayRef?.dispose()
    this.overlayRef = undefined
    this.searchText.set('')
  }

  protected dialCode(country: CountryCode): string {
    return `+${getCountryCallingCode(country, metadata)}`
  }

  protected flag(country: CountryCode): string {
    return country
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0)))
  }
}
