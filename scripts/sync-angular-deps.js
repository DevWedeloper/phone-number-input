#!/usr/bin/env node

/**
 * Sync selected workspace package versions into
 * Angular publish package.json
 */

const fs = require('node:fs')
const path = require('node:path')

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

// eslint-disable-next-line node/prefer-global/process
const ROOT = process.cwd()

// workspace package -> where its package.json lives
const WORKSPACE_PACKAGES = {
  '@phone-number-input/core': 'packages/core',
  '@phone-number-input/maskito': 'packages/maskito',
}

// angular publish package
const ANGULAR_PACKAGE_JSON
  = 'packages/angular/projects/ngx-phone-number-input/package.json'

// version range strategy
const VERSION_PREFIX = '^' // "^", "~", or ""

// version source for ngx-phone-number-input
const VERSION_SOURCE_PACKAGE = {
  name: '@phone-number-input/angular',
  path: 'packages/angular',
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function readJSON(relPath) {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, relPath), 'utf8'),
  )
}

function writeJSON(relPath, data) {
  fs.writeFileSync(
    path.join(ROOT, relPath),
    `${JSON.stringify(data, null, 2)}\n`,
  )
}

function readWorkspacePackage(pkgName, pkgPath) {
  const pkgJsonPath = path.join(ROOT, pkgPath, 'package.json')

  if (!fs.existsSync(pkgJsonPath)) {
    throw new Error(`Missing package.json for ${pkgName}`)
  }

  const pkg = JSON.parse(
    fs.readFileSync(pkgJsonPath, 'utf8'),
  )

  if (pkg.name !== pkgName) {
    throw new Error(
      `Package name mismatch in ${pkgPath}: expected ${pkgName}, got ${pkg.name}`,
    )
  }

  return pkg
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

const angularPkg = readJSON(ANGULAR_PACKAGE_JSON)

angularPkg.dependencies ||= {}

let changed = false

// ─────────────────────────────────────────────
// SYNC PACKAGE VERSION
// ─────────────────────────────────────────────

const versionSourcePkg = readWorkspacePackage(
  VERSION_SOURCE_PACKAGE.name,
  VERSION_SOURCE_PACKAGE.path,
)

if (angularPkg.version !== versionSourcePkg.version) {
  angularPkg.version = versionSourcePkg.version
  changed = true
}

// ─────────────────────────────────────────────
// SYNC DEPENDENCY VERSIONS
// ─────────────────────────────────────────────

for (const [pkgName, pkgPath] of Object.entries(WORKSPACE_PACKAGES)) {
  const workspacePkg = readWorkspacePackage(pkgName, pkgPath)

  const nextVersion = VERSION_PREFIX + workspacePkg.version
  const prevVersion = angularPkg.dependencies[pkgName]

  if (prevVersion !== nextVersion) {
    angularPkg.dependencies[pkgName] = nextVersion
    changed = true
  }
}

// remove deps no longer tracked
for (const dep of Object.keys(angularPkg.dependencies)) {
  if (!WORKSPACE_PACKAGES[dep] && dep.startsWith('@phone-number-input/')) {
    delete angularPkg.dependencies[dep]
    changed = true
  }
}

if (changed) {
  writeJSON(ANGULAR_PACKAGE_JSON, angularPkg)
  console.log('✔ Synced Angular dependencies')
}
else {
  console.log('✔ Angular dependencies already up to date')
}
