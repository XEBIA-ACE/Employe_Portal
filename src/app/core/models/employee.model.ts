export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: Address;
  departmentId: string;
  departmentName?: string;
  positionId: string;
  positionTitle?: string;
  managerId?: string;
  managerName?: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  startDate: Date;
  endDate?: Date;
  salary?: number;
  avatarUrl?: string;
  emergencyContact?: EmergencyContact;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  departmentId: string;
  positionId: string;
  managerId?: string;
  employmentType: EmploymentType;
  startDate: Date;
  salary?: number;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  employmentStatus?: EmploymentStatus;
  address?: Address;
  emergencyContact?: EmergencyContact;
  skills?: string[];
}

export interface EmployeeFilter {
  search?: string;
  departmentId?: string;
  employmentStatus?: EmploymentStatus;
  employmentType?: EmploymentType;
  managerId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
}
