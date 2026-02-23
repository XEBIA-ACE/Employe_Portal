export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'emergency' | 'study';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approverName?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  employeeId: string;
  year: number;
  leaveType: LeaveType;
  entitled: number;
  taken: number;
  pending: number;
  remaining: number;
}

export interface CreateLeaveRequest {
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  attachmentUrl?: string;
}

export interface UpdateLeaveStatusRequest {
  leaveRequestId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface LeaveFilter {
  employeeId?: string;
  departmentId?: string;
  leaveType?: LeaveType;
  status?: LeaveStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
