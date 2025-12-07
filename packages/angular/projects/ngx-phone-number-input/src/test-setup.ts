import { TestBed } from '@angular/core/testing'
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'
import '@angular/compiler'
import '@analogjs/vitest-angular/setup-zone'
import '@testing-library/jest-dom/vitest'

TestBed.initTestEnvironment(
  [BrowserDynamicTestingModule],
  platformBrowserDynamicTesting(),
)
