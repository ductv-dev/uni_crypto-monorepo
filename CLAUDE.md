# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo containing a cryptocurrency wallet application with a web frontend, admin dashboard, and NestJS backend API. The repository uses **pnpm workspaces** for package management and **Turbo** for build orchestration.

### Monorepo Structure

```
├── apps/
│   ├── client/          Next.js app for end-user wallet interface
│   ├── admin/           Next.js app for admin dashboard
│   └── api/             NestJS backend API (Node.js)
├── packages/
│   ├── ui/              @workspace/ui - shadcn/ui component library
│   ├── shared/          Shared types and validation schemas (Zod)
│   ├── eslint-config/   Shared ESLint configuration
│   └── typescript-config/
```

## Common Commands

### Installation & Setup

```bash
pnpm install              # Install all dependencies
```

### Development

```bash
pnpm dev                  # Start all apps in dev mode (Turbo watches all)
pnpm dev --filter=client  # Start only the client app
pnpm dev --filter=admin   # Start only the admin dashboard
pnpm dev --filter=api     # Start only the API (NestJS)
```

### Building

```bash
pnpm build                # Build all workspaces
pnpm build --filter=client
```

### Linting & Formatting

```bash
pnpm lint                 # Lint all workspaces
pnpm format               # Format all code with Prettier
pnpm typecheck            # Run TypeScript type checks
```

### Testing

The API (NestJS) uses Jest:

```bash
pnpm test --filter=api             # Run all tests
pnpm test:watch --filter=api       # Watch mode
pnpm test:cov --filter=api         # Coverage report
pnpm test:e2e --filter=api         # End-to-end tests
```

## Architecture

### Frontend Apps (Next.js)

Both **client** and **admin** are Next.js 16 applications using the app directory. Key differences:

- **client**: Lightweight Charts for market data visualization, React Query for data fetching
- **admin**: Recharts for dashboards, Radix UI components, react-hook-form with Zod validation

Both apps:

- Import UI components from `@workspace/ui`
- Import types and validation schemas from the `shared` package
- Use Tailwind CSS 4 with custom configuration
- Enable dark mode via next-themes

### Backend API (NestJS)

The API runs on port **8080** (configurable via `PORT` env var) with CORS enabled. Modular structure:

- Controllers, services, and modules organized by feature
- Jest for unit and e2e tests

### Shared Package

The `shared` package exports two main categories:

1. **Types** (`shared/src/types/`): TypeScript interfaces for User, Transaction, Wallet, Token, Nav
2. **Schemas** (`shared/src/schemas/`): Zod validation schemas for Register and Login forms

Import with: `import { UserType } from "shared"` or `import { loginSchema } from "shared"`

### UI Package (@workspace/ui)

shadcn/ui component library with exports configured in `package.json`:

- `./components/*` - React components
- `./hooks/*` - Custom React hooks
- `./lib/*` - Utility functions
- `./globals.css` - Global styles

Import with: `import { Button } from "@workspace/ui/components/button"`

## Code Style & Standards

- **Prettier**: 2 spaces, no semicolons, single quotes off, tailwindcss plugin enabled
- **ESLint**: TypeScript recommended rules + Turbo plugin (warns on undeclared env vars)
- **Linting is warning-only** via eslint-plugin-only-warn (failures won't block builds)
- **Git hooks**: Husky + lint-staged automatically format and lint staged files on commit

## Key Technologies

- **React 19**, **Next.js 16** (with Turbopack)
- **Tailwind CSS 4** with PostCSS
- **TypeScript 5.9.3**
- **Zod** for schema validation across frontend and backend
- **zustand** for client state management (root level dependency)
- **React Hook Form** for form handling in both frontend apps
- **Recharts** (admin) and **Lightweight Charts** (client) for visualizations
- **NestJS 11** for backend with Express

## Environment Variables

- API port: `PORT` (defaults to 8080)
- Apps and packages may require additional env vars—check individual `.env.example` or `next.config` files

## Performance Notes

- Turbo is configured to cache outputs from `build`, `lint`, `format`, and `typecheck` tasks
- Dev tasks (`dev`) are not cached and run persistently
- The `build` task depends on dependencies being built first (`^build`)

## Authentication System

Both **client** and **admin** apps implement httpOnly cookie-based authentication:

### How It Works

1. User submits email/password via login form
2. Frontend validates with Zod schema
3. POST to `/api/auth/login` (Next.js API route)
4. Backend validates and returns user data + sets httpOnly cookies
5. `useLogin` hook stores user in Zustand
6. User redirected to authenticated page
7. Logout clears cookies and store, redirects to login

### Protected Routes (via `proxy.ts`)

**Client:**

- `/user/*` - All user dashboard pages
- `/add-wallet`, `/create-wallet`, `/token` - Wallet/trading pages

**Admin:**

- `/dashboard` - Main dashboard
- All management pages (`/users`, `/transactions`, `/kyc`, etc.)

### Default Credentials

- **Client**: user@gmail.com / 12345678
- **Admin**: admin@gmail.com / 12345678

### Key Files

**Client:**

- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint
- `lib/api/api.ts` - API client (login, logout, getMe)
- `lib/hooks/use-login.ts` - Login mutation hook
- `lib/hooks/use-logout.ts` - Logout mutation hook
- `store/user-store.ts` - User state (Zustand)
- `proxy.ts` - Route protection middleware
- `container/auth/login.tsx` - Login page component

**Admin:**

- Same structure as client, but for admin routes

## Workflow Notes

1. Always run tasks from the **root** using `pnpm <task>` and `--filter=<app>` to scope
2. Changes to the **shared** package require rebuilding dependent apps
3. Changes to **@workspace/ui** components require rebuild of apps that use them
4. Use `pnpm format` before committing—Husky hooks will auto-format anyway
5. Protected routes are enforced by `proxy.ts` middleware—check route config when adding new protected pages
6. User state persists in Zustand store but is lost on page refresh (stored in httpOnly cookies server-side)
