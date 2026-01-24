# Agent Instructions for ghrelease

## Tech Stack

- Stack: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Shadcn UI
- Tooling: pnpm, Biome (lint + format), Tanstack Query
- Module system: ESM (`"type": "module"` in package.json)
- Node: >= 20.9.0, pnpm: >= 9.0.0

## Project Structure

- Routes/layouts: `app/`
- Reusable components: `components/`
- Shadcn UI primitives: `components/ui/`
- Library/utilities: `lib/`
- Static assets: `public/`

## Guidelines

- FOLLOW any [RULES](.agent/rules/) and [WORKFLOWS](.agent/workflows/) provided in the repository
- ASK FOR CLARIFICATION if requirements are ambiguous before proceeding
- Use available tools to gather context as needed
- Write clean, well-documented code IN ENGLISH
- Validate changes with tests
