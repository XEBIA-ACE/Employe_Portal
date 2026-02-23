export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  employeeCount?: number;
  budget?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  title: string;
  code: string;
  departmentId: string;
  departmentName?: string;
  level: number;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  budget?: number;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {
  isActive?: boolean;
}
