# Agent Instructions for ghrelease

## Project Overview

**ghrelease** is a GitHub Release Viewer - a Next.js web application that provides a better UX for reading and discovering release notes of any GitHub public repository. It's a small-to-medium sized project with ~28 TypeScript/TSX source files and ~46 total files (excluding dependencies).

**Tech Stack:**
- Next.js 16.0.0 (App Router) + React 19.2
- TypeScript 5
- Tailwind CSS 4 with Shadcn UI components
- Tanstack Query for data fetching
- Biome for linting/formatting

**Runtime Requirements:**
- Node.js >= 20.9.0 (tested with 20, 22)
- pnpm >= 9.0.0

## Critical Build & Validation Workflow

### ALWAYS Follow This Order:

1. **Install dependencies** (if not already done or when package.json changes):
   ```bash
   pnpm install --frozen-lockfile
   ```
   - Uses `pnpm-lock.yaml` - never modify this manually
   - Run time: ~10-30 seconds depending on cache

2. **Lint your changes**:
   ```bash
   pnpm lint
   ```
   - Runs Biome only (`biome check .`)
   - Run time: ~20ms (Biome is very fast)
   - Must pass with no errors before building

3. **Auto-fix linting issues** (if needed):
   ```bash
   pnpm lint:fix
   ```
   - Runs `biome check --write .`
   - Use this for formatting and auto-fixable issues

4. **Build the project**:
   ```bash
   pnpm build
   ```
   - Compiles TypeScript, lints, type-checks, and generates optimized production build
   - Output directory: `.next/`
   - Run time: ~7-20 seconds (20s on first clean build, 7s on incremental)
   - Expected warning about `metadataBase` - this is harmless
   - Build MUST succeed with no errors

5. **Test the build** (optional but recommended for significant changes):
   ```bash
   pnpm start
   ```
   - Starts production server on http://localhost:3000
   - Requires successful `pnpm build` first
   - Test by visiting the URL in a browser or using curl

### Development Workflow:

```bash
pnpm dev
```
- Starts development server with Turbopack (default in Next.js 16)
- Runs on http://localhost:3000 (or next available port)
- Ready in ~2 seconds

### Environment Variables:

Optional `.env.local` file (copy from `.env.example`):
- `NEXT_PUBLIC_BASE_URL`: Base URL for the app (default: http://localhost:3000)
- `GITHUB_TOKEN`: Optional GitHub token to increase API rate limits

The app works without environment variables for local development.

## Continuous Integration

The CI workflow (`.github/workflows/ci.yml`) runs on every push to `main` and all PRs:

1. Tests against Node.js 20 and 22 (matrix build)
2. Installs dependencies with `pnpm install --frozen-lockfile`
3. Runs `pnpm lint`
4. Runs `pnpm build`
5. Performs smoke test: starts server with `pnpm start`, waits up to 30s, curls http://localhost:3000

**To replicate CI locally**, run these commands in order:
```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

Your changes MUST pass all three steps without errors to be mergeable.

## Project Architecture & File Layout

### Directory Structure:

```
/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout with metadata, fonts, providers
│   ├── globals.css              # Tailwind CSS with custom theme variables
│   ├── types.ts                 # Shared TypeScript types
│   ├── fonts/                   # Local font files
│   └── (main)/                  # Main route group
│       ├── layout.tsx           # Layout with Navbar and Footer
│       ├── page.tsx             # Homepage with search
│       └── [username]/[repo]/   # Dynamic repo viewer routes
│           ├── page.tsx         # Release notes page
│           └── error.tsx        # Error boundary
│
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components (9 files)
│   ├── icons/                   # Custom icon components
│   └── *.tsx                    # Other components (e.g., RepoCard, ReleaseList)
│
├── lib/                         # Utility libraries
│   ├── github.ts                # GitHub API client (searchRepos, getTags, getRelease, getRepo)
│   ├── queryClient.ts           # Tanstack Query configuration
│   ├── utils.ts                 # Utility functions (cn, debounce, error checks, etc.)
│   └── const.ts                 # Constants (APP_NAME, etc.)
│
├── public/                      # Static assets (og-image.png, etc.)
│
└── Configuration files:
    ├── package.json             # Scripts, dependencies, engines
    ├── tsconfig.json            # TypeScript config with path aliases (@/*)
    ├── next.config.ts           # Next.js config
    ├── biome.json               # Biome linter/formatter config
    ├── components.json          # Shadcn UI configuration
    ├── postcss.config.mjs       # PostCSS with Tailwind plugin
    └── .env.example             # Environment variable template
```

### Key Architectural Patterns:

1. **Next.js App Router**: Uses React Server Components by default
   - `app/(main)/[username]/[repo]/page.tsx` is a dynamic route for repo pages
   - Server-side data fetching with `async` components
   - Client components marked with `'use client'` directive

2. **Data Fetching**:
   - Server: Direct GitHub API calls in `lib/github.ts`
   - Client: Tanstack Query for caching/state management
   - GitHub API has 60 req/hour limit without token, 5000 with token

3. **Styling**:
   - Tailwind CSS 4 with `@import` syntax in globals.css
   - Shadcn UI components in `components/ui/`
   - Theme variables in CSS with `next-themes` for dark mode

4. **Type Safety**:
   - Path aliases: `@/*` maps to project root
   - Shared types in `app/types.ts` and component-specific types in respective files

### Making Changes:

**For UI components**: Look in `components/` or `components/ui/`
**For pages/routes**: Check `app/(main)/` directory structure
**For API logic**: Modify `lib/github.ts`
**For styling**: Edit component-level Tailwind classes or `app/globals.css`
**For configuration**: Appropriate config file in root

### Common Gotchas:

1. **Build warnings**: The `metadataBase` warning is expected - ignore it
2. **Port conflicts**: Dev server auto-selects next available port if 3000 is taken
3. **Turbopack by default**: No need for `--turbopack` flag in Next.js 16
4. **Frozen lockfile**: Never use `pnpm add` or `pnpm install` without regenerating lockfile
5. **Client vs Server**: Remember to add `'use client'` for hooks, browser APIs, event handlers

## Validation Checklist

Before submitting changes, verify:
- [ ] `pnpm install --frozen-lockfile` succeeds (if deps changed)
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm build` completes successfully
- [ ] Changes tested in development mode (`pnpm dev`)
- [ ] TypeScript types are correct (build checks this)
- [ ] No console errors in browser DevTools

## Testing

**No formal test suite exists.** Validation is done through:
1. Linting (Biome only)
2. Type checking (TypeScript via build)
3. Build success
4. Smoke test (server starts and responds)

When making changes, manually test affected functionality in the browser.

## Trust These Instructions

These instructions have been validated by running actual commands in the repository. If you encounter issues:
1. First, re-read these instructions carefully
2. Check that you followed the exact order specified
3. Verify you're using correct Node.js and pnpm versions
4. Only search the codebase if information here is incomplete or proven incorrect

The most common mistake is running commands out of order - always run `pnpm install`, then `pnpm lint`, then `pnpm build`.
