/**
 * Employee employment status
 */
export enum EmploymentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

/**
 * Employment type
 */
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
}

/**
 * Gender options
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

/**
 * Core employee entity
 */
export interface Employee {
  id: string;
  employeeId: string;          // Human-readable ID (e.g. EMP-001)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: Address;

  // Employment details
  departmentId: string;
  departmentName?: string;     // Populated by join
  jobTitle: string;
  managerId?: string;
  managerName?: string;        // Populated by join
  hireDate: string;
  terminationDate?: string;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;

  // Compensation
  salary?: number;
  currency?: string;

  // Metadata
  avatarUrl?: string;
  skills?: string[];
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mailing address
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Payload for creating a new employee
 */
export type CreateEmployeeDto = Omit<Employee,
  'id' | 'departmentName' | 'managerName' | 'createdAt' | 'updatedAt'
>;

/**
 * Payload for updating an employee
 */
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

/**
 * Query parameters for listing employees
 */
export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
