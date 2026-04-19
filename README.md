# Uni Crypto - Cryptocurrency Wallet Application

A modern, full-stack cryptocurrency wallet application with admin dashboard built with Next.js, React, and NestJS. This monorepo contains both user-facing and admin applications with shared type definitions and UI components.

## 🏗️ Architecture Overview

### Monorepo Structure

```
uni_crypto-monorepo/
├── apps/
│   ├── client/          Next.js 16 - User wallet application
│   ├── admin/           Next.js 16 - Admin dashboard
│   └── api/             NestJS 11 - Backend API (future)
├── packages/
│   ├── ui/              @workspace/ui - shadcn/ui component library
│   ├── shared/          Shared types & Zod schemas
│   ├── eslint-config/   Shared ESLint rules
│   └── typescript-config/
└── pnpm-workspace.yaml
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.x
- **pnpm**: 9.15.9+

### Installation

```bash
# Install dependencies across all workspaces
pnpm install

# Install a new package (example)
pnpm add axios -w
```

## 📦 Development Commands

### Run All Apps in Development Mode

```bash
# Start all apps simultaneously (Turbo watches for changes)
pnpm dev

# Start only specific app
pnpm dev --filter=client
pnpm dev --filter=admin
pnpm dev --filter=api
```

### Build All Apps

```bash
# Build all workspaces
pnpm build

# Build specific app
pnpm build --filter=client
pnpm build --filter=admin
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Format code with Prettier
pnpm format

# Run TypeScript type checking
pnpm typecheck
```

### Testing

```bash
# Run API tests
pnpm test --filter=api

# Watch mode
pnpm test:watch --filter=api

# Coverage
pnpm test:cov --filter=api

# E2E tests
pnpm test:e2e --filter=api
```

## 🎯 Applications

### Client App (`/apps/client`)

User-facing cryptocurrency wallet application.

**Key Features:**

- User authentication (login/logout)
- Wallet management (create, view, manage wallets)
- Token trading interface
- Real-time price data from Binance API
- Transaction history
- User account settings

**Tech Stack:**

- Next.js 16 with App Router (Turbopack)
- React 19 + React Hook Form
- React Query for data fetching
- Zustand for state management
- Tailwind CSS 4
- Lightweight Charts for candlestick charts

**Key Routes:**

- `/` - Welcome page
- `/login` - User login
- `/user/home` - Dashboard (protected)
- `/user/my-wallet` - Wallet management (protected)
- `/user/account` - User profile (protected)
- `/user/setting` - Settings (protected)
- `/token/[id]` - Token details

**Default Login Credentials:**

```
Email: user@gmail.com
Password: 12345678
```

### Admin App (`/apps/admin`)

Administrative dashboard for managing users, transactions, and system settings.

**Key Features:**

- User management (CRUD operations, search, filter)
- Role-based access control
- Transaction monitoring (deposits, withdrawals, trades)
- KYC management
- Fee & limit settings
- Hot wallet management
- Audit logs
- Dashboard with charts and statistics

**Tech Stack:**

- Next.js 16 with App Router
- React 19 + React Hook Form
- React Table for data tables
- Recharts for analytics
- Zustand for state management
- Tailwind CSS 4

**Key Routes:**

- `/login` - Admin login
- `/dashboard` - Main dashboard (protected)
- `/users` - User management (protected)
- `/transactions/*` - Transaction management (protected)
- `/kyc/*` - KYC management (protected)

**Default Login Credentials:**

```
Email: admin@gmail.com
Password: 12345678
```

### API App (`/apps/api`)

NestJS backend API (scaffold phase - to be completed).

## 🔐 Authentication System

### How It Works

Both client and admin apps use a **httpOnly cookie-based authentication** system with access and refresh tokens.

**Login Flow:**

1. User submits credentials (email/password)
2. Frontend validates with Zod schema
3. POST to `/api/auth/login`
4. Backend returns user data + sets httpOnly cookies
5. User stored in Zustand store
6. Redirect to authenticated page

**Protected Routes:**
The proxy middleware protects routes requiring authentication:

**Client Protected Routes:**

- `/user/*` (all user dashboard pages)
- `/add-wallet`
- `/create-wallet`
- `/token`

**Admin Protected Routes:**

- `/dashboard`
- All management pages

**Logout Flow:**

1. User clicks logout
2. Calls `/api/auth/logout`
3. Clears cookies
4. Clears Zustand store
5. Redirects to login

### API Endpoints

#### Authentication

- `POST /api/auth/login` - User login

  ```json
  {
    "email": "user@gmail.com",
    "password": "12345678"
  }
  ```

  Response: `{ success: true, user: {...} }`

- `POST /api/auth/logout` - User logout
  Response: `{ success: true, message: "Đã đăng xuất" }`

## 📦 Shared Package (`/packages/shared`)

Centralized types and validation schemas used across frontend and backend.

### Types

```typescript
// User
type TUser = {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  wallet?: TWallet[]
}

// Wallet
type TWallet = {
  id: string
  address: string
  name: string
  balance: number
}

// Transaction
type TTransaction = {
  id: string
  from: string
  to: string
  amount: number
  status: "pending" | "completed" | "failed"
  timestamp: Date
}

// Token
type TToken = {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
}
```

### Schemas

```typescript
// Login validation
LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
})

// Register validation
RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword)
```

## 🎨 UI Package (`/packages/ui`)

Reusable component library based on shadcn/ui.

**Components Include:**

- Button, Input, Card, Dialog
- Form components (Field, Label, etc.)
- Data display (Table, Pagination, Badge)
- Navigation (Breadcrumb, Sidebar)
- Charts integration
- Custom components (UserAvatar, AnimatedThemeToggler)

**Usage:**

```typescript
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/index"
```

## 🔧 Configuration

### Environment Variables

**Client App (`.env`):**

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Admin App (`.env`):**

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Build Configuration

- **Turbo**: Orchestrates builds across workspaces
- **Prettier**: Code formatting (2 spaces, no semicolons)
- **ESLint**: Code linting with TypeScript rules
- **Tailwind CSS 4**: Utility-first CSS framework

## 📊 Git Workflow

### Commit Convention

This project uses semantic commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Test additions/updates
- `chore:` - Build, dependencies, etc.

**Example:**

```bash
git commit -m "feat: add user authentication with login/logout"
```

### Pre-commit Hooks

Using Husky + lint-staged:

- Auto-format staged TypeScript/TSX files
- Auto-lint before commit
- Prevents commits with linting errors

## 🧪 Testing Strategy

### Current Status

- Unit tests: ❌ Not implemented
- Integration tests: ❌ Not implemented
- E2E tests: ❌ Not implemented

### Future Plans

- Add Jest for NestJS API tests
- Add React Testing Library for component tests
- Add Playwright/Cypress for E2E tests

## 🚧 Development Progress

### Completed ✅

- Monorepo setup with Turbo + pnpm
- Shared types and schemas
- UI component library (@workspace/ui)
- Authentication system (client & admin)
- User management dashboard (admin)
- Wallet interface (client)
- Token details page (client)
- Real-time price data (Binance API)
- Form validation with Zod

### In Progress 🔄

- NestJS API backend
- Database integration

### TODO 📋

- User registration flow
- Password reset
- Two-factor authentication
- Real API backend integration
- Payment processing
- WebSocket for real-time updates
- Mobile app
- Unit tests
- E2E tests

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

### Code Style

- Write clean, readable code
- Use TypeScript strict mode
- Avoid comments unless necessary
- Use descriptive variable/function names
- Keep components small and focused

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit with semantic messages
3. Push to remote: `git push origin feature/my-feature`
4. Create pull request with clear description
5. Wait for review and CI checks

## 📝 License

This project is private and for educational purposes.

## 👥 Team

- **Developer**: Đức (ductv-dev)
- **Contact**: vietducdtu@gmail.com

---

**Last Updated**: April 2026
