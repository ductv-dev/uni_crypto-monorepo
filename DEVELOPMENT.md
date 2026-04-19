# Development Guide - Uni Crypto

Detailed technical guide for developing and maintaining the Uni Crypto monorepo.

## 🛠️ Local Development Setup

### Step 1: Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd uni_crypto-monorepo

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Step 2: Access Applications

- **Client App**: http://localhost:3000
- **Admin App**: http://localhost:3001
- **API**: http://localhost:8080 (future)

## 📁 Project Structure Deep Dive

### App Structure

Each Next.js app follows this structure:

```
apps/client/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── user/              # Protected routes group
│   │   ├── home/
│   │   ├── my-wallet/
│   │   ├── account/
│   │   └── setting/
│   ├── api/               # API routes
│   │   └── auth/
│   │       ├── login/
│   │       └── logout/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/
│   ├── custom/
│   └── theme-provider.tsx
├── container/             # Page containers (business logic)
│   ├── auth/
│   ├── home/
│   └── ...
├── lib/                   # Utilities & hooks
│   ├── api/               # API client
│   ├── hooks/             # Custom React hooks
│   ├── utils/
│   └── data/              # Mock data
├── store/                 # Zustand state management
├── types/                 # TypeScript types
├── middleware.ts          # (optional) Route middleware
├── proxy.ts               # Route protection logic
└── next.config.mjs
```

## 🔐 Authentication Implementation

### Authentication Architecture

```
┌─────────────────────────────────────────────────┐
│ Browser                                         │
├─────────────────────────────────────────────────┤
│ 1. User enters email/password                   │
│ 2. useLogin hook validates with Zod            │
│ 3. POST /api/auth/login                        │
│ 4. API validates & returns user + cookies      │
│ 5. Update Zustand store with user              │
│ 6. Redirect to /user/home                      │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│ Protected Routes via proxy.ts                   │
├─────────────────────────────────────────────────┤
│ - Check access_token cookie                     │
│ - If missing: redirect to /login?next=/path    │
│ - If present: allow access                      │
└─────────────────────────────────────────────────┘
```

### Authentication Files

**Client App:**

- `/app/api/auth/login/route.ts` - Login endpoint
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/lib/api/api.ts` - API client functions
- `/lib/hooks/use-login.ts` - Login mutation hook
- `/lib/hooks/use-logout.ts` - Logout mutation hook
- `/store/user-store.ts` - User state management
- `/proxy.ts` - Route protection middleware

**Admin App:**

- `/app/api/auth/login/route.ts` - Login endpoint
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/lib/api/api.ts` - API client functions
- `/hooks/auth/use-login.ts` - Login mutation hook
- `/proxy.ts` - Route protection middleware
- `/store/admin-store.ts` - Admin state management

### Protected Routes

**Client:**

```typescript
// Protected (require auth_token cookie)
/user/*
/add-wallet
/create-wallet
/token

// Public (no auth required)
/
/wellcome

// Auth routes (redirect if already logged in)
/login
/register
```

**Admin:**

```typescript
// Protected (require access_token cookie)
/dashboard
/()/users
/()/transactions/*
/()/kyc/*
/()/settings/*

// Public (no auth required)
/wellcome

// Auth routes (redirect if already logged in)
/login
/register
```

## 🎣 Custom Hooks Pattern

### Creating Custom Hooks

Example: `use-login.ts`

```typescript
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export const useLogin = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data) => {
      // Call API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: (data) => {
      // Handle success
      router.push("/user/home")
    },
    onError: (error) => {
      // Handle error
      toast.error(error.message)
    },
  })
}
```

**Usage in Component:**

```typescript
const { mutate: login, isPending } = useLogin()

const onSubmit = (data) => {
  login(data)
}
```

## 📊 State Management with Zustand

### User Store Structure

```typescript
type UserStore = {
  // State
  user: TUser

  // Actions
  setUser: (user: TUser) => void
  setName: (name: string) => void
  clearUser: () => void
}

// Usage in components
const user = useUser((state) => state.user)
const setUser = useUser((state) => state.setUser)
```

### Store Best Practices

1. Keep store focused (one concern per store)
2. Use selectors to avoid unnecessary re-renders
3. Clear state on logout
4. Don't store API responses directly (use React Query)

## 🎯 Form Handling

### With React Hook Form + Zod

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@workspace/shared/schemas"

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

## 🔄 Data Fetching with React Query

### Query Example

```typescript
import { useQuery } from "@tanstack/react-query"

export const useTokens = () => {
  return useQuery({
    queryKey: ["tokens"],
    queryFn: () => fetch("/api/tokens").then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Mutation Example

```typescript
export const useCreateWallet = () => {
  return useMutation({
    mutationFn: (data) =>
      fetch("/api/wallets", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      // Refetch wallet list
      queryClient.invalidateQueries(["wallets"])
    },
  })
}
```

## 🎨 Component Organization

### Component Structure

```
components/
├── layout/              # Layout components
│   ├── nav-bar-desktop.tsx
│   └── nav-bar-mobile.tsx
├── custom/              # Domain-specific components
│   ├── cards/
│   ├── charts/
│   └── forms/
└── theme-provider.tsx   # Providers

container/              # Page containers (business logic)
├── auth/
├── home/
└── token/
```

### Component Pattern

**Container (Smart):**

```typescript
export const Home = () => {
  const { data, isLoading } = useTokens()

  return (
    <>
      {isLoading ? <Skeleton /> : <TokenList tokens={data} />}
    </>
  )
}
```

**Presentation (Dumb):**

```typescript
interface TokenListProps {
  tokens: TToken[]
}

export const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
  return (
    <div className="grid gap-4">
      {tokens.map(token => (
        <TokenCard key={token.id} token={token} />
      ))}
    </div>
  )
}
```

## 📦 Adding Dependencies

### Add to Specific Workspace

```bash
# Add to client app
pnpm add axios --filter=client

# Add dev dependency
pnpm add -D @types/node --filter=client

# Add to root
pnpm add -w turbo
```

### Adding UI Components

```bash
# Add new shadcn component
cd apps/client
pnpm dlx shadcn-ui@latest add dialog
```

## 🧪 Testing Strategy

### Unit Tests (Jest)

```typescript
// Button.test.tsx
import { render, screen } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```typescript
// login.spec.ts
import { test, expect } from "@playwright/test"

test("user can login", async ({ page }) => {
  await page.goto("/login")
  await page.fill("input[type=email]", "user@gmail.com")
  await page.fill("input[type=password]", "12345678")
  await page.click("button[type=submit]")
  await expect(page).toHaveURL("/user/home")
})
```

## 🔍 Debugging

### Browser DevTools

```typescript
// Log to console
console.log("user:", user)

// Conditional breakpoint
debugger
```

### React DevTools

- Install React DevTools browser extension
- Inspect component tree
- View props and state

### Network Inspection

1. Open DevTools → Network tab
2. Perform action (login, submit form)
3. Check request/response
4. Verify headers and cookies

## 📈 Performance Optimization

### Code Splitting

```typescript
// Dynamic import
const HeavyComponent = dynamic(
  () => import("./HeavyComponent"),
  { loading: () => <Skeleton /> }
)
```

### Image Optimization

```typescript
import Image from "next/image"

<Image
  src="/user-avatar.png"
  width={64}
  height={64}
  alt="User avatar"
/>
```

### Memoization

```typescript
const UserCard = memo(({ user }: { user: TUser }) => (
  <div>{user.name}</div>
))
```

## 🚨 Error Handling

### API Error Handling

```typescript
const { mutate, error } = useMutation({
  mutationFn: api.login,
  onError: (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Invalid credentials
    } else if (error.response?.status === 500) {
      // Server error
    }
  },
})
```

### Error Boundary

```typescript
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 🎯 Common Tasks

### Add a New Page

1. Create folder in `/app`: `mkdir app/new-page`
2. Create `page.tsx`: `app/new-page/page.tsx`
3. Add layout if needed: `app/new-page/layout.tsx`
4. Add navigation link

### Add Authentication to Route

Routes are protected by `/proxy.ts`. Add to `PROTECTED_ROUTES`:

```typescript
const PROTECTED_ROUTES = new Set(["/user", "/new-protected-route"])
```

### Create API Route

1. Create file: `app/api/my-endpoint/route.ts`
2. Export handler: `export async function POST(req: Request) {...}`
3. Call from client: `fetch("/api/my-endpoint", {...})`

## 📚 Useful Commands

```bash
# Development
pnpm dev                           # Start all apps
pnpm dev --filter=client          # Start only client

# Building
pnpm build                        # Build all
pnpm build --filter=client        # Build specific

# Code Quality
pnpm lint                         # Lint all
pnpm format                       # Format all
pnpm typecheck                    # Type check all

# Cleaning
pnpm clean                        # Remove build artifacts
rm -rf node_modules               # Remove node_modules
```

## 🔗 Useful Links

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Happy coding! 🚀**
