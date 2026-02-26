---
trigger: always_on
---

# Code Style Rules

## Formatting

- Biome controls formatting and linting.
- Indent: 2 spaces; line width: 80; line endings: LF.
- Quotes: single for JS/TS, double for JSX attributes.
- Semicolons: omitted (`asNeeded`).
- Trailing commas: always.

## Imports

- Biome organizes imports automatically.
- Prefer absolute imports with alias: `@/*` (see `tsconfig.json`).
- Order: external -> internal (`@/`) -> relative.
- Use `import type` for type-only imports.

## TypeScript

- `strict: true` in `tsconfig.json`; do not weaken it.
- Prefer explicit return types for exported, non-trivial functions.
- Prefer `type` for object shapes; `interface` only for extension.
- Shared types live in `app/types.ts`.

## Naming

- Components: `PascalCase` filenames and exports.
- Hooks: `useX`.
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` when truly constant.

## React / Next.js Patterns

- Default to Server Components; add `'use client'` only when needed.
- Add `'use client'` when using hooks, state, effects, browser APIs, or event handlers.
- Keep server data fetching in `lib/` (see `lib/github.ts`).
- Favor composable components; avoid large monolithic components.

## Styling

- Tailwind CSS 4 with utility classes in JSX.
- Shared styles in `app/globals.css`.
- Shadcn UI components live in `components/ui/`.
- Use `cn()` from `lib/utils.ts` for conditional classes.

## Error Handling

- Check `fetch` responses explicitly (see `lib/github.ts`).
- Throw `Error` with clear messages.
- For not-found routes, call `notFound()`.
- Avoid swallowing errors; log when it helps debugging.

## Performance

- Avoid unnecessary client components or client state.
- Prefer server-side fetching and render data directly in RSCs.
- Use Tanstack Query only for interactive client state.
