/**
 * Standardised API response envelope models.
 * Every REST response from the backend follows these shapes.
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
  message?: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
}

/** Generic select option used for dropdowns. */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}
