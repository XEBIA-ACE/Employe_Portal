/**
 * User / Authentication domain models
 */

export type UserRole = 'admin' | 'hr-manager' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employeeId?: string; // Link to employee record
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Permissions mapped to roles — used by guards and directives */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  'hr-manager': [
    'employees:read',
    'employees:write',
    'employees:delete',
    'departments:read',
    'departments:write',
    'reports:read',
  ],
  manager: [
    'employees:read',
    'employees:write',
    'departments:read',
    'reports:read',
  ],
  employee: ['profile:read', 'profile:write'],
};
