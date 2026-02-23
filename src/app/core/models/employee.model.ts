/**
 * Employee domain model — the core entity of the Employee Portal.
 */

export type EmploymentStatus = 'active' | 'on_leave' | 'terminated' | 'pending';
export type EmploymentType   = 'full_time' | 'part_time' | 'contractor' | 'intern';
export type Gender           = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Employee {
  id: string;
  employeeId: string;          // Human-readable ID, e.g. EMP-00123
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  gender?: Gender;
  dateOfBirth?: string;        // ISO 8601
  nationality?: string;

  // Employment info
  jobTitle: string;
  departmentId: string;
  departmentName: string;
  managerId?: string;
  managerName?: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  startDate: string;           // ISO 8601
  endDate?: string;
  salary?: number;
  currency?: string;
  location?: string;

  // Contact
  address?: Address;
  emergencyContact?: EmergencyContact;

  // Skills & metadata
  skills?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Used when creating a new employee. */
export interface EmployeeCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  departmentId: string;
  managerId?: string;
  employmentType: EmploymentType;
  startDate: string;
  salary?: number;
  currency?: string;
  location?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  skills?: string[];
  notes?: string;
}

export type EmployeeUpdateRequest = Partial<EmployeeCreateRequest> & {
  employmentStatus?: EmploymentStatus;
  endDate?: string;
};

/** Query params for the employee list endpoint. */
export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  managerId?: string;
  location?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Employee;
  sortDirection?: 'asc' | 'desc';
}

/** Summary stats used on the Dashboard. */
export interface EmployeeSummary {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  newHiresThisMonth: number;
  departmentBreakdown: { departmentName: string; count: number }[];
  employmentTypeBreakdown: { type: EmploymentType; count: number }[];
}
