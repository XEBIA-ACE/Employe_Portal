/**
 * Department model used for organizing employees and reporting structures.
 */
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  parentDepartmentId?: string;
  headCount: number;
  budget?: number;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentCreateRequest {
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
  location?: string;
}

export type DepartmentUpdateRequest = Partial<DepartmentCreateRequest>;
