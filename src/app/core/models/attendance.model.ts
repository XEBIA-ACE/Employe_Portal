export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday';

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: AttendanceStatus;
  workHours?: number;
  overtimeHours?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceSummary {
  employeeId: string;
  month: number;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leaveDays: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
}

export interface CheckInRequest {
  employeeId: string;
  checkIn: Date;
  notes?: string;
}

export interface CheckOutRequest {
  attendanceId: string;
  checkOut: Date;
  notes?: string;
}

export interface AttendanceFilter {
  employeeId?: string;
  departmentId?: string;
  status?: AttendanceStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
