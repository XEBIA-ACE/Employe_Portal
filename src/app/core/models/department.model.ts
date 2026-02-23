/**
 * Department entity
 */
export interface Department {
  id: string;
  name: string;
  code: string;               // Short code (e.g. ENG, HR, FIN)
  description?: string;
  managerId?: string;
  managerName?: string;       // Populated by join
  parentDepartmentId?: string;
  employeeCount?: number;     // Computed field
  budget?: number;
  currency?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a department
 */
export type CreateDepartmentDto = Omit<Department,
  'id' | 'managerName' | 'employeeCount' | 'createdAt' | 'updatedAt'
>;

/**
 * Payload for updating a department
 */
export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
