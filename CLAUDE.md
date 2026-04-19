# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack hotel management system with Express.js backend, React 19 frontend, MySQL database, and Docker containerization. Supports two user roles:
- **Admin**: Manage rooms, bookings, payments, complaints, and analytics
- **Customer (Visitor)**: Browse rooms, make bookings, manage payments, submit complaints

## Development Commands

### Docker (Recommended for Development)
```bash
# Start all services (MySQL on port 3307, backend on 5000, frontend on 3000, nginx on 80)
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Stop all services
docker-compose down

# Rebuild after Dockerfile changes
docker-compose up --build

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Backend (Express.js)
```bash
cd backend
npm install
npm run dev        # Development with nodemon (port 5000)
npm start          # Production server
```

### Frontend (React + TanStack Router)
```bash
cd frontend
pnpm install       # Use pnpm, not npm
pnpm dev          # Vite dev server (port 3000)
pnpm build         # Production build
pnpm preview       # Preview production build
pnpm test          # Run tests with Vitest
```

### Database
- **MySQL 8.0** runs on port **3307** (host) / 3306 (container)
- Schema file: `backend/schema.sql`
- Connection configured in `backend/.env`
- **IMPORTANT**: When database schema changes are needed, modify `backend/schema.sql` and inform the user. Do not directly modify the database.

## Architecture

### Backend: Express.js Modular Monolith

**Structure**: `backend/src/`
```
├── index.js                 # Server entry point, mounts all route modules
├── database/
│   ├── connection.js       # MySQL connection pool (mysql2/promise)
│   └── init.js             # Database initialization (currently disabled)
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   ├── error.js            # Centralized error handling
│   └── validation.js       # Request validation with express-validator
├── utils/
│   └── auth.js             # JWT sign/verify, bcrypt hash/compare
└── modules/                # Feature-based modules (MVC pattern)
    ├── user/               # Authentication & user management
    ├── room/               # Room inventory
    ├── booking/            # Reservation management
    ├── invoice/            # Billing & invoices
    ├── payment/            # Payment processing
    └── hall/               # Hall/event management
```

**Module Pattern**: Each module follows MVC structure:
- `controllers/` - Handle HTTP requests/responses
- `services/` - Business logic and database operations
- `routes/` - Express router definitions
- `middleware/` - Module-specific middleware (optional)

**Database Access**:
- Connection pool from `database/connection.js`
- Use `query(sql, params)` for parameterized queries
- Import: `const { query } = require('../../database/connection')`

**Authentication Flow**:
1. User registers/logs in via `api/users/register` or `api/users/login`
2. Backend generates JWT (7-day expiration, signed with JWT_SECRET)
3. Frontend stores token in localStorage (`auth_token`)
4. Protected routes require `Authorization: Bearer <token>` header
5. `authMiddleware` verifies token and attaches `req.user`

**API Response Format**:
```javascript
// Success
{ success: true, data: {...}, message: "..." }

// Error
{ success: false, message: "Error description" }
```

**Environment Variables** (`backend/.env`):
```
PORT=5000
NODE_ENV=development
DB_HOST=cse221_db          # Use 'cse221_db' in Docker, 'localhost' otherwise
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=mydb
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
```

### Frontend: React 19 + TanStack Router

**Structure**: `frontend/src/`
```
├── routes/                 # File-based routing with TanStack Router
│   ├── __root.tsx          # Root layout (AuthProvider, Header, Footer)
│   ├── index.tsx           # Public home page
│   ├── auth/               # Public auth routes
│   ├── customer/           # Visitor-only routes
│   └── admin/              # Admin-only routes
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── auth/               # Login/register forms
│   ├── admin/              # Admin-specific components
│   ├── customer/           # Customer-specific components
│   ├── layout/             # Header, Footer, Sidebar
│   └── shared/             # Cross-cutting components (ProtectedRoute, etc.)
├── services/               # API service layer (mock data currently)
├── stores/                 # State management
│   └── auth.store.tsx      # Auth context provider
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── types/                  # TypeScript definitions
```

**Routing**:
- File-based routing: Create file in `src/routes/`, TanStack Router auto-generates route
- Dynamic routes use `$param` syntax: `bookings.$id.tsx`
- Nested routes through directory structure
- Code splitting automatic

**Authentication**:
- `AuthProvider` in `__root.tsx` wraps entire app
- State: `user`, `token`, `isAuthenticated`
- Persists to localStorage: `auth_token`, `auth_user`
- `useAuth()` hook provides auth state and methods
- Auto-redirect on 401 errors from API

**Protected Routes**:
```tsx
<ProtectedRoute requireAdmin>
  <AdminOnlyContent />
</ProtectedRoute>
```

**Path Aliases** (configured in `tsconfig.json`):
- `#/*` → `./src/*` (primary)
- `@/*` → `./src/*` (secondary)

Example: `import { useAuth } from '#/hooks/useAuth'`

**Form Handling**:
- React Hook Form + Zod validation
- Controlled components with `react-hook-form` resolvers

### Docker Architecture

**Services** (all named with `cse221_` prefix):
- `cse221_db` - MySQL 8.0, container: `cse221_mysql_db`
- `cse221_backend` - Express.js API, container: `cse221_backend_api`
- `cse221_frontend` - React Vite app, container: `cse221_frontend_app`
- `cse221_nginx` - Reverse proxy, container: `cse221_nginx_proxy`

**Networking**:
- All services on `app_network` (bridge network)
- Nginx proxies: `/` → frontend, `/api` → backend
- Hot reload: Volume mounts for `backend/src` and `frontend/src`

**Development Features**:
- Health checks on MySQL before backend starts
- Volume mounts for live code reloading
- MySQL data persisted in Docker volume
- Custom MySQL port 3307 to avoid conflicts

## Database Schema

**Tables** (see `backend/schema.sql` for full definitions):
- `USER` - User authentication and basic info (user_id PK, email UNIQUE, role)
- `VISITOR` - Extended visitor information (1:1 with USER via USER_user_id)
- `ROOM` - Room inventory (room_id PK, price, type)
- `RESERVATION` - Bookings (reservvaion_id PK, note: typo preserved from schema)
- `INVOICE` - Billing records (invoce_id PK, note: typo preserved from schema)
- `COMPLAINS` - Customer feedback (complain_id PK)
- `PAYMENT` - Payment transactions (payment_id PK, references INVOICE)

**Key Relationships**:
- USER ← VISITOR (1:1)
- VISITOR → COMPLAINS (1:N)
- VISITOR → RESERVATION (1:N)
- ROOM → RESERVATION (1:N)
- RESERVATION → INVOICE (1:1)
- INVOICE → PAYMENT (1:N)

**Schema Change Process**:
1. Modify `backend/schema.sql`
2. Inform user of required changes
3. User applies changes manually to database
4. Do NOT directly modify database

## Color Scheme & Design System

**Primary Colors**:
- Primary Red/Pink: `#ce0031` (primary actions, buttons, highlights)
- Secondary: `#000` (secondary actions, accents)
- Background Pink: `#fef7f8` (light backgrounds)
- Accent Pink: `#f27b89` (hover states, gradients)

**Gradients**:
- Primary: `from-[#ce0031] to-[#f27b89]`
- Secondary: `from-[#000] to-[#f27b89]`

**Neutral Colors**:
- Text: `slate-900` (headings), `slate-600` (body)
- Borders: `slate-200`
- White backgrounds for cards and content

**UI Components**:
- Use shadcn/ui primitives from `src/components/ui/`
- Radix UI for accessibility
- Tailwind CSS v4 for styling

## Key Patterns & Conventions

### Backend
1. **Error Handling**: All routes use try-catch, pass to `errorHandler` middleware
2. **Validation**: Use `express-validator` in `middleware/validation.js`
3. **Security**: Helmet, CORS, bcrypt for passwords, parameterized queries
4. **Auth**: Use `authMiddleware` for protected routes
5. **Response Format**: Consistent `{ success, data/message }` structure

### Frontend
1. **Route Protection**: Wrap in `<ProtectedRoute>` with `requireAdmin` if needed
2. **Navigation**: Use `Link` from `@tanstack/react-router`
3. **API Calls**: Service functions in `src/services/`
4. **Form Validation**: React Hook Form + Zod schemas
5. **Type Safety**: TypeScript types in `src/types/`

### Demo Credentials
- Admin: `admin@hotel.com` / `admin123`
- Visitor: `visitor@hotel.com` / `visitor123`

## Common Tasks

### Adding New Backend Module
1. Create module directory: `backend/src/modules/[module]/`
2. Add `controllers/`, `services/`, `routes/` subdirectories
3. Export router from `routes/[module]Routes.js`
4. Mount in `backend/src/index.js`: `app.use('/api/[module]', [module]Routes)`

### Adding New Frontend Route
1. Create file in `src/routes/` (e.g., `admin/analytics.tsx`)
2. TanStack Router auto-generates route
3. For protected routes, wrap content in `<ProtectedRoute>`

### Adding Database Table
1. Modify `backend/schema.sql` with CREATE TABLE statement
2. Inform user of changes
3. User applies changes manually
4. Create corresponding backend module for CRUD operations

## Testing

### Backend
```bash
cd backend
npm test                # Run tests (if configured)
```

### Frontend
```bash
cd frontend
pnpm test              # Run Vitest tests
pnpm test:ui           # Run tests with UI
```

## Troubleshooting

**Docker Issues**:
- If nginx can't find backend/frontend: Check service names in `nginx.conf`
- If backend can't connect to DB: Verify `DB_HOST=cse221_db` in backend/.env
- If MySQL port conflicts: Port 3307 used on host to avoid conflicts

**Frontend Build Issues**:
- Delete `node_modules` and `pnpm-lock.yaml`, run `pnpm install`
- Check that pnpm is installed: `npm install -g pnpm`

**Backend Issues**:
- Verify MySQL is running and accessible
- Check environment variables in `backend/.env`
- Ensure database schema is imported
