# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hotel management system built with React, TanStack Router, and shadcn/ui. The application serves two user types:
- **Customers**: Browse rooms, make bookings, manage payments, submit complaints
- **Admins**: Manage rooms, bookings, payments, complaints, and view analytics

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on port 3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test
```

## Architecture

### Tech Stack
- **React 19.2.0** with TypeScript
- **TanStack Router** for file-based routing with auto code-splitting
- **shadcn/ui** (Radix UI primitives) for component library
- **Tailwind CSS v4** for styling
- **React Hook Form + Zod** for form validation
- **Vite** as build tool

### Routing Structure

Routes are file-based in `src/routes/` with TanStack Router:

```
src/routes/
├── __root.tsx              # Root layout with AuthProvider, Header, Footer
├── index.tsx               # Public home page
├── auth/
│   ├── login.tsx           # Public login
│   └── register.tsx        # Public registration
├── customer/               # Customer-only routes
│   ├── rooms.tsx           # Browse available rooms
│   ├── bookings.tsx        # View customer bookings
│   ├── bookings.new.tsx    # Create new booking
│   ├── bookings.$id.tsx    # View specific booking details
│   ├── payments.tsx        # Payment management
│   ├── complaints.tsx      # Submit/view complaints
│   └── profile.tsx         # Customer profile
└── admin/                  # Admin-only routes
    ├── dashboard.tsx       # Admin dashboard
    ├── rooms.tsx           # Manage all rooms
    ├── rooms.new.tsx       # Add new room
    ├── rooms.$id.edit.tsx  # Edit room
    ├── bookings.tsx        # View all bookings
    ├── bookings.$id.tsx    # Booking details
    ├── payments.tsx        # Payment management
    ├── complaints.tsx      # Manage complaints
    ├── complaints.$id.tsx  # Complaint details
    └── analytics.tsx       # Analytics and reports
```

Dynamic routes use `$param` syntax (e.g., `bookings.$id.tsx`).

### Authentication & Authorization

**Auth Store** (`src/stores/auth.store.tsx`):
- React Context provider (`AuthProvider`) wraps the app in `__root.tsx`
- Manages auth state: `user`, `token`, `isAuthenticated`
- Persists to localStorage (`auth_token`, `auth_user`)
- Exports `useAuth()` hook for accessing auth state

**Protected Routes**:
- `ProtectedRoute` component enforces authentication
- `requireAdmin` prop restricts routes to admin users only
- Non-authenticated users redirected to `/auth/login` with redirect param
- Non-admin users accessing admin routes redirected to `/`

**Mock Credentials** (for development):
- Admin: `admin@hotel.com` / `admin123`
- Customer: `customer@hotel.com` / `customer123`

### Component Organization

```
src/components/
├── ui/                     # shadcn/ui primitives (Button, Card, Dialog, etc.)
├── auth/                   # Login/register forms
├── admin/                  # Admin-specific components
├── customer/               # Customer-specific components
├── layout/                 # Header, Footer, Sidebar
├── shared/                 # Cross-feature components (ProtectedRoute, etc.)
└── ...
```

### Services Layer

`src/services/` contains API service modules with mock data:
- `auth.service.ts` - Authentication API calls
- `rooms.service.ts` - Room management
- `bookings.service.ts` - Booking CRUD operations
- etc.

Services return promises and mock backend responses.

### Path Aliases

Configured in `tsconfig.json` and `components.json`:
- `#/*` → `./src/*` (primary alias)
- `@/*` → `./src/*` (secondary alias)

Usage: `import { useAuth } from '#/hooks/useAuth'`

### UI/UX Guidelines

When working with UI:
- Use the **EXPRESSIVE** skill for UI design guidance
- Follow shadcn/ui patterns for consistency
- Leverage Radix UI primitives for accessibility
- Use Tailwind utility classes for styling

### Color Scheme

The application uses a modern, vibrant color palette:

**Primary Colors:**
- **Primary Red/Dark Pink**: `#ce0031` - Used for primary actions, buttons, and highlights
- **Secondary Teal**: `#000` - Used for secondary actions, accents, and complementary elements
- **Background Pink**: `#fef7f8` - Used for light backgrounds and subtle contrasts
- **Accent Pink**: `#f27b89` - Used for intermediate accents, gradients, and hover states

**Usage Guidelines:**
- Use `#ce0031` for: primary buttons, active states, important CTAs
- Use `#000` for: secondary buttons, links, info accents
- Use `#fef7f8` for: page backgrounds, card backgrounds, subtle sections
- Use `#f27b89` for: gradients, hover states, decorative elements
- Use `from-[#ce0031] to-[#f27b89]` for: primary gradients
- Use `from-[#000] to-[#f27b89]` for: secondary gradients

**Neutral Colors:**
- Text: Slate-900 for headings, Slate-600 for body
- Borders: Slate-200 for subtle borders
- White backgrounds for cards and content areas

### State Management

- **Auth state**: React Context (`AuthProvider`)
- **Form state**: React Hook Form
- **Server state**: Currently using mock services; can integrate TanStack Query for caching/refetching

### Key Patterns

1. **Route protection**: Wrap component content in `ProtectedRoute` in route files
2. **Navigation**: Use `Link` from `@tanstack/react-router` for SPA navigation
3. **Form validation**: React Hook Form + Zod schemas
4. **API calls**: Service functions in `src/services/`, use in loaders or useEffect
5. **Type safety**: TypeScript types defined in `src/types/`

## Adding New Features

1. **New route**: Create file in `src/routes/`, TanStack Router auto-generates route tree
2. **New UI component**: Check `src/components/ui/` for existing shadcn components first
3. **New service**: Add to `src/services/`, follow existing mock service patterns
4. **Protected feature**: Wrap in `ProtectedRoute`, set `requireAdmin` if admin-only
