# Employee Portal

A comprehensive, production-ready Employee Portal built with Angular 17 and Angular Material. This application provides HR management capabilities including employee management, department management, and role-based access control.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication & Roles](#authentication--roles)
- [Docker Setup](#docker-setup)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

---

## Features

- **Authentication**: JWT-based login/logout with role-based access control
- **Dashboard**: Real-time stats, charts, and quick insights
- **Employee Management**: Full CRUD for employees with search, filter, and pagination
- **Department Management**: Manage organizational departments and team structure
- **Profile Management**: View and edit own user profile
- **Responsive Design**: Mobile-first, fully responsive UI
- **Observability**: Structured logging, HTTP request/response logging
- **In-Memory API**: Development mode uses `angular-in-memory-web-api` for rapid prototyping

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 17.x | Core framework |
| Angular Material | 17.x | UI components |
| RxJS | 7.x | Reactive state management |
| TypeScript | 5.4.x | Type safety |
| Angular CDK | 17.x | Accessibility & layout |
| jwt-decode | 4.x | JWT token parsing |
| angular-in-memory-web-api | 0.17.x | Mock API for development |

---

## Architecture

The application follows **Clean Architecture** with clear layer separation:

```
src/app/
├── core/             # Singleton services, guards, interceptors, models
│   ├── guards/       # Route guards (auth, role)
│   ├── interceptors/ # HTTP interceptors (auth, error, loading)
│   ├── models/       # Domain models/interfaces
│   └── services/     # Business logic services
├── features/         # Feature modules (lazy-loaded)
│   ├── auth/         # Authentication (login, forgot password)
│   ├── dashboard/    # Dashboard with stats
│   ├── departments/  # Department CRUD
│   ├── employees/    # Employee CRUD
│   ├── layout/       # App shell (sidebar, header)
│   └── profile/      # User profile
└── shared/           # Reusable components, pipes, directives
    ├── components/   # Shared UI components
    ├── directives/   # Custom directives
    └── pipes/        # Custom pipes
```

**Design Principles Applied:**
- **SOLID**: Each service has single responsibility, features are open for extension
- **DI**: Angular's DI container manages all service dependencies
- **Lazy Loading**: Each feature module is code-split and loaded on demand
- **Reactive**: RxJS observables/BehaviorSubjects for async data flows

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 17.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd employee-portal

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`.

### Default Credentials (Development Mode)

| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | Admin@123 |
| HR Manager | hr@company.com | Hr@123 |
| Employee | employee@company.com | Employee@123 |

---

## Available Scripts

```bash
npm start              # Start dev server (port 4200)
npm run build          # Build for development
npm run build:prod     # Build for production (optimized)
npm test               # Run unit tests (headless)
npm run test:watch     # Run unit tests in watch mode
npm run test:coverage  # Generate code coverage report
npm run lint           # Run ESLint
npm run analyze        # Analyze production bundle size
```

---

## Project Structure

```
employee-portal/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── api-response.model.ts
│   │   │   │   ├── department.model.ts
│   │   │   │   ├── employee.model.ts
│   │   │   │   └── user.model.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── department.service.ts
│   │   │   │   ├── employee.service.ts
│   │   │   │   ├── loading.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   └── core.module.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── departments/
│   │   │   ├── employees/
│   │   │   ├── layout/
│   │   │   └── profile/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── shared.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── angular.json
├── package.json
└── tsconfig.json
```

---

## API Documentation

The app connects to a REST API. In development, `angular-in-memory-web-api` simulates all endpoints.

### Base URL
- Development: `http://localhost:4200/api` (intercepted by in-memory API)
- Production: Configured via `environment.prod.ts`

### Endpoints

#### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user, returns JWT |
| POST | `/api/auth/logout` | Invalidate session |
| POST | `/api/auth/refresh` | Refresh JWT token |

#### Employees
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List all employees (paginated) |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

#### Departments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/departments` | List all departments |
| GET | `/api/departments/:id` | Get department by ID |
| POST | `/api/departments` | Create new department |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Authentication & Roles

The app implements Role-Based Access Control (RBAC) with three roles:

| Role | Permissions |
|---|---|
| **Admin** | Full access to all features |
| **HR** | Manage employees and departments, view reports |
| **Employee** | View own profile only |

### Route Guards
- `AuthGuard`: Redirects unauthenticated users to `/auth/login`
- `RoleGuard`: Restricts routes based on user role

---

## Docker Setup

### Development

```bash
# Build and start dev container
docker-compose up employee-portal-dev
```

### Production

```bash
# Build and start production nginx container
docker-compose --profile production up employee-portal-prod

# Or build directly
docker build -t employee-portal:prod .
docker run -p 8080:80 employee-portal:prod
```

---

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report (output to /coverage)
npm run test:coverage
```

Test files are co-located with their source files using the `.spec.ts` pattern.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|---|---|---|
| `API_BASE_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `ENABLE_MOCK_API` | Use in-memory mock API | `true` |
| `JWT_SECRET` | JWT signing secret | - |
| `LOG_LEVEL` | Logging verbosity | `debug` |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.
