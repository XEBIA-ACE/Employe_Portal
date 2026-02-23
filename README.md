# Employee Portal

A production-ready **Angular 16** single-page application for managing your organisation's workforce. Features a responsive shell with sidebar navigation, full employee CRUD, a live dashboard, role-based access control, and JWT authentication support.

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
6. [Docker Setup](#docker-setup)
7. [Environment Configuration](#environment-configuration)
8. [API Reference](#api-reference)
9. [Running Tests](#running-tests)
10. [Code Quality](#code-quality)
11. [Design Decisions](#design-decisions)

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | Summary statistics: headcount, new hires, department & type breakdown |
| **Employee List** | Paginated table with search, filter (department, status), and sortable columns |
| **Employee Detail** | Tabbed detail view — employment info, contact, skills |
| **Add / Edit Employee** | Reactive form with full validation |
| **Authentication** | JWT login flow with automatic token refresh and `rememberMe` |
| **RBAC** | `AuthGuard` + `RoleGuard` + `*appHasRole` directive for template-level visibility |
| **Notifications** | Global toast system (`success`, `error`, `warning`, `info`) |
| **CSV Export** | Download the current employee list as CSV |
| **Responsive** | Works on desktop and tablet; sidebar collapses on smaller screens |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Angular App Shell                    │
│  ┌───────────────┐  ┌──────────────────────────────┐    │
│  │   Sidebar Nav  │  │       Router Outlet           │    │
│  │  (RBAC-aware)  │  │  ┌───────┐ ┌────────────┐   │    │
│  └───────────────┘  │  │  Auth  │ │  Dashboard  │   │    │
│  ┌───────────────┐  │  ├───────┤ ├────────────┤   │    │
│  │ Header + Toast │  │  │  Emp. │ │  Profile   │   │    │
│  └───────────────┘  │  │  CRUD  │ │            │   │    │
│                     │  └───────┘ └────────────┘   │    │
│                     └──────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  Core Layer                                              │
│  Services: AuthService, EmployeeService, DeptService,   │
│            NotificationService                          │
│  Guards:  AuthGuard, RoleGuard                          │
│  Interceptors: AuthInterceptor, ErrorInterceptor,       │
│                LoggingInterceptor                       │
├─────────────────────────────────────────────────────────┤
│  Shared Layer                                            │
│  Components: Header, Sidebar, Spinner, Notification      │
│  Directives: HasRoleDirective                           │
│  Pipes:      ReplacePipe, FullNamePipe                  │
└─────────────────────────────────────────────────────────┘
```

**Module loading strategy:** All feature modules are **lazy-loaded** — they are not bundled into the main chunk, which keeps initial load times fast.

---

## Project Structure

```
employee-portal/
├── src/
│   ├── app/
│   │   ├── core/                  # Singleton services, guards, interceptors
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/            # TypeScript interfaces
│   │   │   └── services/
│   │   ├── features/              # Lazy-loaded feature modules
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   └── profile/
│   │   └── shared/                # Reusable UI building blocks
│   │       ├── components/
│   │       ├── directives/
│   │       └── pipes/
│   ├── environments/              # Environment configs
│   └── styles.scss                # Global design tokens + utility classes
├── mock-data/
│   └── db.json                    # json-server mock data
├── Dockerfile                     # Multi-stage build
├── docker-compose.yml             # Dev + prod compose profiles
└── nginx.conf                     # Production nginx config
```

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18 LTS |
| npm | 9 |
| Angular CLI | 16 |
| Docker *(optional)* | 20 |

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd employee-portal
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your API URL and settings
```

### 3. Start the dev server

```bash
ng serve
# → http://localhost:4200
```

### 4. (Optional) Start the mock API

The included `db.json` works with [json-server](https://github.com/typicode/json-server):

```bash
npx json-server --watch mock-data/db.json --port 3000
```

Update `src/environments/environment.ts`:

```ts
apiBaseUrl: 'http://localhost:3000'
```

Default credentials (for the mock API — implement real auth on your backend):
- **Email:** `admin@example.com`
- **Password:** any value

---

## Docker Setup

### Development (hot-reload)

```bash
docker-compose --profile dev up
# → Angular dev server: http://localhost:4200
# → Mock API:           http://localhost:3000
```

### Production build

```bash
docker-compose --profile prod up --build
# → nginx serving compiled app: http://localhost:8080
```

### Build image only

```bash
docker build -t employee-portal:latest .
docker run -p 8080:80 employee-portal:latest
```

---

## Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `API_BASE_URL` | `http://localhost:3000/api/v1` | Backend REST API base URL |
| `API_TIMEOUT` | `30000` | HTTP request timeout (ms) |
| `LOG_LEVEL` | `debug` | `debug` logs HTTP traffic; `error` is silent |
| `ENABLE_ANALYTICS` | `false` | Toggle analytics integration |

Production builds swap `environment.ts` for `environment.prod.ts` automatically via Angular's `fileReplacements`.

---

## API Reference

The service layer expects the following REST API contract from your backend:

### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | Login — returns `{ user, tokens }` |
| `POST` | `/auth/logout` | Invalidate refresh token |
| `POST` | `/auth/refresh` | Exchange refresh token for new access token |
| `POST` | `/auth/change-password` | Change current user password |

### Employees

| Method | Path | Description |
|---|---|---|
| `GET` | `/employees` | List (supports `search`, `departmentId`, `employmentStatus`, `page`, `pageSize`, `sortBy`, `sortDirection`) |
| `POST` | `/employees` | Create employee |
| `GET` | `/employees/summary` | Dashboard statistics |
| `GET` | `/employees/export/csv` | Download CSV |
| `GET` | `/employees/:id` | Get employee |
| `PATCH` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |
| `POST` | `/employees/:id/avatar` | Upload avatar photo |

### Departments

| Method | Path | Description |
|---|---|---|
| `GET` | `/departments` | List departments |
| `POST` | `/departments` | Create department |
| `GET` | `/departments/:id` | Get department |
| `PATCH` | `/departments/:id` | Update department |
| `DELETE` | `/departments/:id` | Delete department |

#### Response Envelope

All responses follow this shape:

```json
{
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Paginated list responses:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 120,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Running Tests

```bash
# Run all unit tests (single run)
npm test

# Run with code coverage report
npm run test:ci

# Watch mode (re-runs on file changes)
ng test --watch
```

Test files follow the Angular convention of co-located `*.spec.ts` files. Coverage reports are output to `/coverage`.

---

## Code Quality

```bash
# ESLint
npm run lint

# Fix auto-fixable lint issues
ng lint --fix
```

TypeScript strict mode is enabled (`strict: true` in `tsconfig.json`), which enforces null checks, implicit returns, and more.

---

## Design Decisions

### Lazy Loading
All feature modules are lazy-loaded via the router to minimise the initial bundle. The core and shared modules are eagerly loaded once since they are needed immediately.

### CoreModule Guard
`CoreModule` throws an error if imported more than once (via `@Optional() @SkipSelf()`), preventing accidental duplicate service registration.

### Interceptor Chain
Interceptors are registered in order: **Logging → Auth → Error**. This ensures every request is logged before the JWT is attached, and errors are caught after the auth retry logic runs.

### Token Refresh
`AuthInterceptor` implements the "refresh lock" pattern — concurrent 401 responses queue behind a single refresh request rather than each triggering their own refresh.

### CSS Architecture
Global styles in `styles.scss` define CSS custom properties (design tokens) for colours, spacing, typography, shadows, and transitions. Component styles use these tokens, making theme changes a single-file edit.
