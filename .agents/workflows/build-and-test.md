# Build, Lint, Test Workflow

This project uses pnpm, Next.js, and Biome. Follow these commands and order.

## Install

```bash
pnpm install --frozen-lockfile
```

- Always use pnpm (no npm/yarn).
- Do not edit `pnpm-lock.yaml` manually.

## Lint / Format

```bash
pnpm lint
```

- Runs Biome: `biome check .`.
- Fix issues with:

```bash
pnpm lint:fix
```

## Type Checking

- There is no separate typecheck script.
- `pnpm build` runs type checks in Next.js.
- For a quick, explicit type check:

```bash
pnpm tsc --noEmit
```

## Build

```bash
pnpm build
```

- Output: `.next/`.
- Expected warning about `metadataBase` is ok.

## Dev Server

```bash
pnpm dev
```

## Production Run (Smoke Test)

```bash
pnpm start
```

## Single Test / Targeted Checks

There is no unit test runner in this repo.
Use targeted checks instead:

- Lint only a subset:

```bash
pnpm lint -- --files "path/to/file.tsx"
```

- Format only a subset:

```bash
pnpm lint:fix -- --files "path/to/file.tsx"
```

- Typecheck only:

```bash
pnpm tsc --noEmit
```

## CI Expectations (matches local)

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm build`
- `pnpm start` for a smoke test
