# Contributing

Thank you for considering contributing! Your help is valuable for improving the Phone Number Input project.

This guide will walk you through setting up the project, running it locally, writing changes, and submitting a pull request.

---

## Monorepo Structure

This is a monorepo with multiple packages:

- `apps/docs` – the documentation site for the project
- `packages/core` – shared, framework-agnostic logic
- `packages/maskito` – masking utilities
- `packages/angular` – Angular implementation
  - `ngx-phone-number-input` – published Angular package

When contributing, keep changes scoped to the relevant package unless they are shared improvements.

---

## Setup

This monorepo uses **pnpm**. To get started, run the install command to install all dependencies across the monorepo.

```bash
pnpm install
```

---

## Development

To start development or build packages, run the appropriate dev or build commands for your workflow.

```bash
pnpm run dev      # Run all packages in dev mode
pnpm run build    # Build all packages
pnpm run watch    # Watch all for changes

pnpm run watch --filter <package-name> # Watch for a specific package only
```

---

## Running Tests

To run the tests for all packages, use the test command for the monorepo.

```bash
pnpm run test

pnpm run test --filter <package-name> # Run tests for a specific package only
```

---

## Documentation

The documentation site lives in `apps/docs`. To preview changes locally:

```bash
pnpm run dev --filter docs
```

---

## Making a Pull Request

1. Fork the repository and create a branch for your changes.
2. Make your changes and commit them following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
3. Create a **Changeset** to record your changes for versioning. This will guide you through specifying the type of change and affected packages:

```bash
pnpm exec changeset
```

---

## Pull Request Guidelines

- Ensure all tests pass and linting passes before submitting.
- Include a clear description of what your PR does and why.
- Reference any related issues in the PR description.
- Keep your changes scoped to a single purpose (bug fix, feature, docs, etc.) when possible.

---

Thank you for helping improve **Phone Number Input**! Your contributions make the project better for everyone.
