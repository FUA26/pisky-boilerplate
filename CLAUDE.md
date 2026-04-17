# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Next.js 16 + React 19 SaaS starter template built as a Turborepo monorepo with shadcn/ui components. The project is designed for developers who want to skip boilerplate and ship features quickly with patterns that scale.

**Tech Stack:**
- Next.js 16 with App Router and React Server Components
- React 19
- Turborepo for monorepo management
- shadcn/ui component library
- Tailwind CSS v4
- TypeScript (strict mode)
- pnpm workspace

## Development Commands

### Root-level commands (run from repository root)
```bash
pnpm dev          # Start all dev servers in parallel
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm format       # Format all code with Prettier
pnpm typecheck    # Type check all packages
```

### Web app-specific commands (run from apps/web/)
```bash
pnpm dev          # Start Next.js dev server with Turbopack
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format TypeScript/TSX files
pnpm typecheck    # TypeScript type checking (no emit)
```

## Monorepo Architecture

### Workspace Structure
```
zilpo/
├── apps/
│   └── web/                    # Main Next.js application
├── packages/
│   ├── ui/                     # Shared UI component library (@workspace/ui)
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
```

### Package Management
- Uses **pnpm** with workspace protocol
- Workspace packages use `workspace:*` dependency references
- Internal imports use `@workspace/*` aliases

### Turborepo Configuration
- Tasks are configured with dependency graphs (e.g., `build` depends on `^build`)
- Dev tasks run with cache disabled and are persistent
- Build outputs are cached for faster subsequent builds

## Component Architecture

### Adding Components
Components are added via the shadcn CLI and placed in the shared UI package:
```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```
This installs components to `packages/ui/src/components/`.

### Importing Components
Use the workspace alias in your app:
```tsx
import { Button } from "@workspace/ui/components/button";
```

### Component Location
- **Shared components**: `packages/ui/src/components/` - reusable across apps
- **App-specific components**: `apps/web/components/` - specific to the web app

### shadcn/ui Configuration
- **Style**: `radix-nova`
- **Base color**: `neutral`
- **Icon library**: `lucide-react`
- **RSC**: Enabled (React Server Components)
- **CSS variables**: Enabled for theming
- **Aliases** (configured in `apps/web/components.json`):
  - `@/components` → app components
  - `@/hooks` → app hooks
  - `@/lib` → app lib
  - `@workspace/ui/lib/utils` → utilities
  - `@workspace/ui/components` → UI components

## Next.js Configuration

### Transpilation
The `@workspace/ui` package is transpiled by Next.js (configured in `apps/web/next.config.mjs`):
```javascript
transpilePackages: ["@workspace/ui"]
```

### App Router
Uses Next.js App Router (not Pages Router). All routes are in `apps/web/app/`.

### Theme System
Uses `next-themes` for dark/light mode theming. The theme provider wraps the app and supports system preference detection with manual override.

## Styling

### Tailwind CSS v4
- Uses PostCSS integration (`@tailwindcss/postcss`)
- Global styles are in `packages/ui/src/styles/globals.css`
- Tailwind config is auto-imported (no separate config file)

### CSS Variables
Theme-aware styling uses CSS variables for colors, spacing, and other design tokens. This enables runtime theme switching.

## TypeScript

### Configuration
- Strict mode enabled
- Path aliases are configured in each app's `tsconfig.json`
- Extends shared workspace configs from `@workspace/typescript-config`

### Type Safety
All packages run `tsc --noEmit` for type checking. Run `pnpm typecheck` from the root to check all packages.

## Code Quality

### ESLint
- Uses shared workspace configuration
- Run `pnpm lint` to check all packages

### Prettier
- Configured with `prettier-plugin-tailwindcss` for class sorting
- Run `pnpm format` to format all code

## Engine Requirements
- Node.js >= 20
- pnpm >= 9.15.9
