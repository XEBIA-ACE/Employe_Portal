# Employee Portal

A production-ready **Angular 17** single-page application for managing your organisation's workforce.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Authentication & Authorisation](#authentication--authorisation)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)

---

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | KPI cards, department breakdown, headcount analytics |
| **Employee Management** | Full CRUD: list, search, filter, create, edit, delete |
| **Role-based Access** | Admin / HR Manager / Manager / Employee roles |
| **Profile & Security** | Personal info editing, password change |
| **Reports** | Workforce analytics with CSV/Excel export |
| **Responsive Design** | Mobile-first layout using Angular Material |
| **JWT Authentication** | Token refresh flow, route guards, interceptors |
| **Structured Logging** | Environment-aware log levels, extensible to remote targets |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Angular SPA                        │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth Guard  │  │ Auth Intcptr │  │ Error Intcptr │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬────────┘  │
│         │                │                  │           │
│  ┌──────▼──────────────────────────────────▼────────┐  │
│  │                   Core Services                   │  │
│  │  AuthService · EmployeeService · LoggerService    │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                              │
│  ┌────────────────────────▼────────────────────────┐    │
│  │               Feature Modules (Lazy)             │    │
│  │  Dashboard · Employees · Profile · Reports       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
          │
          ▼ HTTP (JWT Bearer)
┌─────────────────────┐
│   Backend REST API  │
│  /api/v1/employees  │
│  /api/v1/auth       │
│  /api/v1/departments│
└─────────────────────┘
```

**Key design decisions:**
- **Standalone components** — No NgModule boilerplate; uses Angular 17's standalone API throughout.
- **Angular Signals** — Reactive auth state via `signal()` / `computed()`.
- **Functional interceptors** — `authInterceptor` and `errorInterceptor` using `HttpInterceptorFn`.
- **Lazy loading** — Every feature route uses dynamic `import()` for optimal bundle splitting.
- **Clean Architecture** — `core/` (domain logic) → `features/` (UI) → `shared/` (reusable UI).

---

## Project Structure

```
employee-portal/
├── src/
│   ├── app/
│   │   ├── app.component.*         Root shell (sidenav layout)
│   │   ├── app.config.ts           ApplicationConfig (providers)
│   │   ├── app.routes.ts           Top-level route definitions
│   │   ├── core/
│   │   │   ├── guards/             authGuard, guestGuard
│   │   │   ├── interceptors/       authInterceptor, errorInterceptor
│   │   │   ├── models/             TypeScript interfaces (Employee, User, …)
│   │   │   └── services/           AuthService, EmployeeService, LoggerService, …
│   │   ├── features/
│   │   │   ├── auth/               Login & Register pages
│   │   │   ├── dashboard/          Analytics overview
│   │   │   ├── employees/          List · Detail · Form (stepper)
│   │   │   ├── profile/            User profile & password
│   │   │   └── reports/            Workforce analytics + export
│   │   └── shared/
│   │       ├── components/         Header, Sidebar, Spinner, ConfirmDialog
│   │       └── pipes/              TruncatePipe
│   ├── environments/               environment.ts · environment.prod.ts
│   ├── styles.scss                 Global styles & design tokens
│   └── index.html
├── mock-api/
│   └── db.json                     json-server mock data
├── Dockerfile                      Multi-stage production build
├── Dockerfile.dev                  Development build
├── docker-compose.yml
├── nginx.conf                      SPA-friendly nginx config
├── proxy.conf.json                 Dev proxy: /api → localhost:3000
└── angular.json
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Angular CLI | ≥ 17 |
| Docker (optional) | ≥ 24 |

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd employee-portal

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env

# 4. Start the mock API (in a separate terminal)
npx json-server --watch mock-api/db.json --port 3000

# 5. Start the Angular dev server
npm start
# → http://localhost:4200
```

The dev server proxies all `/api/*` requests to `http://localhost:3000` via `proxy.conf.json`.

---

## Docker Setup

### Development (with live-reload)

```bash
docker-compose up frontend backend
# Frontend → http://localhost:4200
# Mock API → http://localhost:3000
```

### Production preview

```bash
docker-compose --profile prod up frontend-prod
# → http://localhost:8080
```

### Build image manually

```bash
docker build -t employee-portal:latest .
docker run -p 8080:80 employee-portal:latest
```

---

## Environment Configuration

Copy `.env.example` to `.env` and adjust the values:

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend base URL | `http://localhost:3000/api/v1` |
| `API_TIMEOUT` | HTTP timeout (ms) | `30000` |
| `LOG_LEVEL` | `debug\|info\|warn\|error` | `debug` (dev) / `error` (prod) |
| `FEATURE_DARK_MODE` | Enable dark mode toggle | `true` |

The Angular environment files (`src/environments/`) are the canonical source at build time. Update those files to change environment-specific values baked into the bundle.

---

## API Reference

> The app expects a REST API at `{apiBaseUrl}`. The following endpoints are consumed:

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | Returns `{ accessToken, refreshToken, user }` |
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/refresh` | Exchange refresh token for new access token |
| `POST` | `/auth/change-password` | Change password (authenticated) |
| `PUT`  | `/auth/profile` | Update profile name / avatar |

### Employees

| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/employees` | Paginated employee list (supports `page`, `pageSize`, `search`, `status`, `departmentId`, `sortBy`, `sortOrder`) |
| `GET`    | `/employees/:id` | Single employee detail |
| `POST`   | `/employees` | Create employee |
| `PUT`    | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |
| `GET`    | `/employees/stats` | Aggregated workforce statistics |
| `POST`   | `/employees/:id/avatar` | Upload avatar photo |
| `GET`    | `/employees/export` | Export employees (`?format=csv\|xlsx`) |

### Departments

| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/departments` | All departments |
| `GET`    | `/departments/:id` | Single department |
| `POST`   | `/departments` | Create department |
| `PUT`    | `/departments/:id` | Update department |
| `DELETE` | `/departments/:id` | Delete department |

**Standard response envelope:**

```json
{
  "data": { ... },
  "success": true,
  "message": "Optional message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Paginated response:**

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 248,
    "totalPages": 25,
    "hasNext": true,
    "hasPrevious": false
  },
  "success": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Authentication & Authorisation

### JWT Flow

1. User logs in → receives `accessToken` + `refreshToken`
2. `authInterceptor` attaches `Authorization: Bearer <token>` to all API requests
3. On 401 response, interceptor automatically calls `/auth/refresh`, then retries
4. On refresh failure, user is redirected to `/auth/login`

Tokens are stored in `localStorage` under the keys `ep_access_token`, `ep_refresh_token`, and `ep_user`.

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| `admin` | Full access (all operations) |
| `hr-manager` | Read/write/delete employees; manage departments; view reports |
| `manager` | Read/write employees in their team; view reports |
| `employee` | View own profile only |

Routes are protected by `authGuard` and `guestGuard`. Role checks use `data: { roles: [...] }` on route definitions and `AuthService.hasRole()` in templates.

---

## Testing

```bash
# Run unit tests (watch mode)
npm test

# Run once with coverage report
npm run test:ci

# Coverage report is written to ./coverage/
```

Test files follow the convention `*.spec.ts` co-located with the source file they test.

---

## Building for Production

```bash
npm run build:prod
# Output → dist/employee-portal/
```

The production build includes:
- Tree-shaking & Ahead-of-Time (AOT) compilation
- Differential loading (ES2022 target)
- Content-hashed filenames for cache busting
- Source maps disabled
- Minimised bundles

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

Please follow the [Angular commit message convention](https://www.conventionalcommits.org/).

---

## Licence

MIT © Employee Portal Contributors
