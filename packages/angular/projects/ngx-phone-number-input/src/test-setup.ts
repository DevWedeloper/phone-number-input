import { TestBed } from '@angular/core/testing'
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing'
import '@analogjs/vitest-angular/setup-zone'
import '@testing-library/jest-dom/vitest'

const ANGULAR_TESTBED_SETUP = Symbol.for('angular-testbed-setup')

afterEach(() => {
  TestBed.resetTestingModule()
})

if (!(globalThis as any)[ANGULAR_TESTBED_SETUP]) {
  (globalThis as any)[ANGULAR_TESTBED_SETUP] = true
  TestBed.initTestEnvironment(
    [BrowserDynamicTestingModule],
    platformBrowserDynamicTesting(),
  )
}
