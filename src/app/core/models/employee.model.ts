/**
 * Employee domain models
 */

export type EmployeeStatus = 'active' | 'inactive' | 'on-leave' | 'terminated';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Employee {
  id: string;
  employeeId: string; // Human-readable ID (e.g., EMP-001)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  avatarUrl?: string;

  // Employment details
  jobTitle: string;
  departmentId: string;
  department?: Department;
  managerId?: string;
  manager?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'email'>;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: string;
  terminationDate?: string;
  salary?: number;
  currency?: string;

  // Contact
  address?: Address;
  emergencyContact?: EmergencyContact;

  // System fields
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeListItem {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  departmentId: string;
  status: EmployeeStatus;
  employmentType: EmploymentType;
  hireDate: string;
  avatarUrl?: string;
}

/** Form model for creating / updating an employee */
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  jobTitle: string;
  departmentId: string;
  managerId?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  hireDate: string;
  salary?: number;
  currency?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

export interface EmployeeFilter {
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
  employmentType?: EmploymentType;
  managerId?: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  newThisMonth: number;
  byDepartment: Array<{ department: string; count: number }>;
  byEmploymentType: Array<{ type: EmploymentType; count: number }>;
}
