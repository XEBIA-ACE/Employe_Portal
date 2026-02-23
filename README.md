# Employee Portal

A production-ready Angular 17 HR management application featuring employee management, attendance tracking, leave management, and department organization.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Security](#security)

---

## Features

| Module | Capabilities |
|---|---|
| **Authentication** | JWT login/logout, token refresh, remember-me, role-based access |
| **Dashboard** | Headcount stats, attendance overview, quick-action shortcuts |
| **Employees** | Full CRUD, multi-step form, profile view with leave balances |
| **Departments** | Department management, position catalog |
| **Attendance** | Check-in/out, daily records, status tracking, date filters |
| **Leave** | Leave requests, approval workflow, balance tracking |
| **RBAC** | Roles: `admin`, `hr_manager`, `manager`, `employee` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 (Standalone Components, Signals) |
| UI Library | Angular Material 17 |
| HTTP | Angular HttpClient with functional interceptors |
| State | Angular Signals (`signal`, `computed`) |
| Forms | Angular Reactive Forms with multi-step Stepper |
| Styling | SCSS with Angular Material theming |
| Build | Angular CLI / esbuild |
| Server | Nginx (production), Angular DevServer (development) |
| Containerization | Docker multi-stage + docker-compose |

---

## Architecture

```
src/app/
├── core/                    # Singleton services, models, guards, interceptors
│   ├── guards/              # authGuard, roleGuard, noAuthGuard
│   ├── interceptors/        # auth (JWT), error (global), logging (HTTP)
│   ├── models/              # TypeScript interfaces for all domain entities
│   └── services/            # AuthService, EmployeeService, DashboardService, …
│
├── features/                # Feature modules (lazy-loaded routes)
│   ├── auth/                # Login page
│   ├── dashboard/           # Stats overview
│   ├── employees/           # List, detail, form (multi-step stepper)
│   ├── departments/         # Department card grid + inline form
│   ├── attendance/          # Attendance records + check-in/out
│   └── leave/               # Leave requests + approval workflow
│
└── shared/                  # Reusable UI components, pipes
    ├── components/
    │   ├── layout/          # MainLayout, Navbar, Sidebar
    │   ├── data-table/      # Generic paginated & sortable table
    │   ├── confirm-dialog/  # Reusable confirmation modal
    │   ├── page-header/     # Breadcrumbs + title + action slot
    │   └── stat-card/       # KPI metric card
    └── pipes/               # InitialsPipe, EmploymentStatusPipe
```

### Key Design Decisions

- **Standalone Components** – No NgModule overhead; each component declares its own imports.
- **Signals** – Reactive state without RxJS boilerplate for component-local state.
- **Functional interceptors** – Modern Angular 15+ pattern for HTTP middleware.
- **Lazy loading** – Every feature route is lazy-loaded via `loadComponent` / `loadChildren`.
- **Clean Architecture** – Strict separation: `core` services never import from `features`; `features` never import from each other.

---

## Project Structure

```
employee-portal/
├── src/
│   ├── app/
│   │   ├── app.component.ts         # Shell root component
│   │   ├── app.config.ts            # ApplicationConfig (providers)
│   │   ├── app.routes.ts            # Top-level route tree
│   │   ├── core/                    # (see Architecture)
│   │   ├── features/
│   │   └── shared/
│   ├── environments/
│   │   ├── environment.ts           # Development config
│   │   ├── environment.prod.ts      # Production config
│   │   └── environment.staging.ts   # Staging config
│   ├── styles/
│   │   └── styles.scss              # Global styles & Material overrides
│   ├── index.html
│   └── main.ts
├── .env.example
├── .gitignore
├── angular.json
├── docker-compose.yml
├── Dockerfile
├── karma.conf.js
├── nginx.conf
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 9+

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your API URL and settings
```

### 3. Start development server

```bash
npm start
# App available at http://localhost:4200
```

### 4. Build for production

```bash
npm run build:prod
# Output in dist/employee-portal/browser/
```

---

## Docker Setup

### Production (Nginx-served build)

```bash
# Build and start all services
docker-compose up --build

# Access the app
open http://localhost:4200
```

### Development (with hot reload)

```bash
# Start dev server container (Angular CLI dev server + hot reload)
docker-compose --profile dev up frontend-dev

# Access the app
open http://localhost:4200
```

### Services

| Service | Port | Description |
|---|---|---|
| `frontend` | 4200 | Angular app (Nginx, production build) |
| `backend` | 3000 | Backend API (replace with your service) |
| `postgres` | 5432 | PostgreSQL database |
| `frontend-dev` | 4200 | Angular dev server (profile: `dev`) |

---

## Environment Configuration

Edit `src/environments/environment.ts` (dev) or set via Docker environment variables:

| Variable | Default | Description |
|---|---|---|
| `apiUrl` | `http://localhost:3000/api/v1` | Backend API base URL |
| `logLevel` | `debug` (dev) / `error` (prod) | Logging verbosity |
| `tokenKey` | `ep_access_token` | localStorage key for JWT |
| `sessionTimeout` | `3600000` | Session timeout in ms |
| `pagination.defaultPageSize` | `10` | Default table page size |

---

## API Reference

The frontend expects a REST API at `apiUrl`. All endpoints follow this contract:

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate user → returns `{ data: AuthUser }` |
| `POST` | `/auth/logout` | Invalidate tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/change-password` | Change current user password |

### Employees

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees` | Paginated list (filter: search, departmentId, status) |
| `POST` | `/employees` | Create employee |
| `GET` | `/employees/:id` | Get employee by ID |
| `PATCH` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |
| `POST` | `/employees/:id/avatar` | Upload avatar (multipart) |

### Departments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/departments` | List departments |
| `POST` | `/departments` | Create department |
| `PATCH` | `/departments/:id` | Update department |
| `DELETE` | `/departments/:id` | Delete department |
| `GET` | `/positions` | List positions (filter: departmentId) |

### Attendance

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/attendance` | List records (filter: employeeId, status, dates) |
| `GET` | `/attendance/today/:employeeId` | Get today's record |
| `POST` | `/attendance/check-in` | Record check-in |
| `PATCH` | `/attendance/check-out` | Record check-out |
| `GET` | `/attendance/summary/:employeeId` | Monthly summary |

### Leave

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/leaves` | List leave requests (filter: status, type, employee) |
| `POST` | `/leaves` | Submit leave request |
| `GET` | `/leaves/:id` | Get leave request |
| `PATCH` | `/leaves/:id/status` | Approve / reject |
| `PATCH` | `/leaves/:id/cancel` | Cancel request |
| `GET` | `/leaves/balance/:employeeId` | Get leave balances |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/stats` | Aggregated KPI stats |
| `GET` | `/dashboard/headcount-trend` | Headcount over time |
| `GET` | `/dashboard/department-distribution` | Employees per department |

### Response Envelope

```typescript
// Single item
{ "data": { ... }, "message": "optional" }

// Paginated list
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "pageSize": 10, "totalPages": 10 }
}

// Error
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": { "email": ["Must be a valid email"] },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/employees"
}
```

---

## Testing

```bash
# Run all unit tests (single pass)
npm test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test:coverage
# Coverage HTML report: coverage/employee-portal/index.html

# Run tests in CI (headless Chrome)
npm run test:ci
```

### Test Structure

```
src/app/
├── core/services/
│   ├── auth.service.spec.ts      # Authentication service tests
│   └── employee.service.spec.ts  # Employee CRUD service tests
├── features/auth/login/
│   └── login.component.spec.ts   # Login form validation & submission
└── shared/pipes/
    └── initials.pipe.spec.ts     # Pipe unit tests
```

### Testing Patterns Used

- **HttpClientTestingModule** – Mock HTTP requests without a real server
- **Jasmine spies** – Stub services in component tests
- **NoopAnimationsModule** – Disable animations in tests for speed
- **Signal testing** – Read signal values directly in assertions

---

## Security

### Authentication
- JWT Bearer token attached to every API request via `AuthInterceptor`
- Automatic token refresh on 401 (silent re-auth)
- Tokens stored in `localStorage` (replaceable with `HttpOnly` cookies for higher security)
- Route guards prevent unauthorized navigation (`authGuard`, `roleGuard`, `noAuthGuard`)

### Authorization (RBAC)

| Role | Access |
|---|---|
| `admin` | Full access to all modules + settings + department management |
| `hr_manager` | Employee CRUD, departments (view), leave approvals |
| `manager` | Team attendance/leave, direct reports |
| `employee` | Own profile, own attendance, own leave requests |

### HTTP Security Headers (Nginx)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` (restrictive default)
- `Referrer-Policy: strict-origin-when-cross-origin`

### Input Validation
- All forms use Angular Reactive Forms with `Validators`
- API errors are surfaced to users via the global `ErrorInterceptor`
- No raw HTML interpolation — Angular's template syntax escapes all values

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and add tests
3. Run `npm test` and ensure all tests pass
4. Run `npm run lint` to check for linting issues
5. Submit a pull request

---

## License

MIT
