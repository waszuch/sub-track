# SubTrack

Personal subscription tracker with authentication and database persistence. Built with Next.js 15, TypeScript, tRPC, Drizzle ORM, BetterAuth, and shadcn/ui.

## Features

Add, edit, and delete subscriptions (name, price, currency, category, payment date)

Visual cost analytics with pie charts by category

Multi-currency support (USD, EUR, GBP, PLN)

User authentication (email/password)

Database persistence with Postgres

Dark/light mode toggle

Import/export data as JSON

Form validation with TanStack Form and Zod

Smooth animations and transitions

Fully responsive design


## Development

```bash
pnpm dev
```

Open http://localhost:3000

## Build

```bash
pnpm build
pnpm start
```

## Testing

### Unit Tests (Vitest)

Run unit tests for components, hooks, and utilities:

```bash
# Run all unit tests
pnpm test

# Run tests in UI mode
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests (Playwright)

Run end-to-end tests that simulate real user interactions:

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests in UI mode (recommended for development)
pnpm test:e2e:ui

# Run tests with visible browser
pnpm test:e2e:headed

# Debug tests
pnpm test:e2e:debug
```

**Note:** E2E tests require a test user account. Set up credentials:
- Email: `test@example.com`
- Password: `Test123!@#`

See [tests/e2e/README.md](tests/e2e/README.md) for more details.

## Tech Stack

Next.js 15 (App Router)

TypeScript

tRPC with TanStack Query

Drizzle ORM

BetterAuth

Postgres (Supabase)

TanStack Form

Zod

Tailwind CSS

shadcn/ui

Recharts

Framer Motion

Lucide Icons

next-themes

## Testing Tools

Vitest (Unit Testing)

@testing-library/react

@testing-library/jest-dom

Playwright (E2E Testing)
