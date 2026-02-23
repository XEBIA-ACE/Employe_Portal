/**
 * Standard paginated API response envelope
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Standard single-item API response envelope
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Pagination metadata
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  newHiresThisMonth: number;
  totalDepartments: number;
  employeesByDepartment: DepartmentStat[];
  recentHires: RecentHire[];
  employmentTypeBreakdown: EmploymentTypeStat[];
}

export interface DepartmentStat {
  departmentName: string;
  count: number;
  percentage: number;
}

export interface RecentHire {
  id: string;
  name: string;
  jobTitle: string;
  departmentName: string;
  hireDate: string;
  avatarUrl?: string;
}

export interface EmploymentTypeStat {
  type: string;
  count: number;
  percentage: number;
}
