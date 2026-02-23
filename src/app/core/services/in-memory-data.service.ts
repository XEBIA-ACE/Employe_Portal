import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable, of } from 'rxjs';
import { EmploymentStatus, EmploymentType, Gender } from '../models/employee.model';

/**
 * In-memory database for development/prototyping.
 * Simulates a REST API without a real backend.
 * Replace with real API calls for production.
 */
@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb(): object {
    const departments = [
      {
        id: 'dept-1',
        name: 'Engineering',
        code: 'ENG',
        description: 'Software development and infrastructure',
        managerId: 'emp-2',
        managerName: 'Jane Smith',
        employeeCount: 12,
        budget: 2000000,
        currency: 'USD',
        location: 'New York, NY',
        isActive: true,
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'dept-2',
        name: 'Human Resources',
        code: 'HR',
        description: 'People operations and talent management',
        managerId: 'emp-3',
        managerName: 'Bob Johnson',
        employeeCount: 5,
        budget: 500000,
        currency: 'USD',
        location: 'New York, NY',
        isActive: true,
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'dept-3',
        name: 'Finance',
        code: 'FIN',
        description: 'Financial planning and accounting',
        managerId: 'emp-4',
        managerName: 'Alice Brown',
        employeeCount: 7,
        budget: 800000,
        currency: 'USD',
        location: 'Chicago, IL',
        isActive: true,
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'dept-4',
        name: 'Marketing',
        code: 'MKT',
        description: 'Brand management and growth',
        managerId: 'emp-5',
        managerName: 'Charlie Davis',
        employeeCount: 8,
        budget: 1000000,
        currency: 'USD',
        location: 'San Francisco, CA',
        isActive: true,
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'dept-5',
        name: 'Operations',
        code: 'OPS',
        description: 'Business operations and process management',
        managerId: null,
        managerName: null,
        employeeCount: 6,
        budget: 600000,
        currency: 'USD',
        location: 'Austin, TX',
        isActive: true,
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const employees = [
      {
        id: 'emp-1',
        employeeId: 'EMP-001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 100-0001',
        dateOfBirth: '1985-04-15',
        gender: Gender.MALE,
        address: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
        departmentId: 'dept-1',
        departmentName: 'Engineering',
        jobTitle: 'Software Engineer',
        managerId: 'emp-2',
        managerName: 'Jane Smith',
        hireDate: '2019-03-10',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 120000,
        currency: 'USD',
        skills: ['TypeScript', 'Angular', 'Node.js', 'SQL'],
        bio: 'Full-stack developer with 8+ years of experience.',
        createdAt: '2019-03-10T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-2',
        employeeId: 'EMP-002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1 (555) 100-0002',
        dateOfBirth: '1982-07-22',
        gender: Gender.FEMALE,
        address: { street: '456 Oak Ave', city: 'New York', state: 'NY', zipCode: '10002', country: 'USA' },
        departmentId: 'dept-1',
        departmentName: 'Engineering',
        jobTitle: 'Engineering Manager',
        managerId: null,
        hireDate: '2017-06-01',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 160000,
        currency: 'USD',
        skills: ['Leadership', 'Agile', 'Python', 'AWS'],
        bio: 'Engineering leader with 15+ years of experience building distributed systems.',
        createdAt: '2017-06-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-3',
        employeeId: 'EMP-003',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@company.com',
        phone: '+1 (555) 100-0003',
        dateOfBirth: '1988-11-08',
        gender: Gender.MALE,
        address: { street: '789 Pine Rd', city: 'New York', state: 'NY', zipCode: '10003', country: 'USA' },
        departmentId: 'dept-2',
        departmentName: 'Human Resources',
        jobTitle: 'HR Manager',
        managerId: null,
        hireDate: '2018-09-15',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 95000,
        currency: 'USD',
        skills: ['Recruiting', 'HRIS', 'Compliance', 'Training'],
        bio: 'HR professional passionate about building great cultures.',
        createdAt: '2018-09-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-4',
        employeeId: 'EMP-004',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@company.com',
        phone: '+1 (555) 100-0004',
        dateOfBirth: '1990-02-28',
        gender: Gender.FEMALE,
        address: { street: '321 Elm St', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' },
        departmentId: 'dept-3',
        departmentName: 'Finance',
        jobTitle: 'Finance Director',
        managerId: null,
        hireDate: '2016-01-20',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 140000,
        currency: 'USD',
        skills: ['Financial Modeling', 'Excel', 'SAP', 'FP&A'],
        bio: 'CPA with expertise in corporate finance and strategic planning.',
        createdAt: '2016-01-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-5',
        employeeId: 'EMP-005',
        firstName: 'Charlie',
        lastName: 'Davis',
        email: 'charlie.davis@company.com',
        phone: '+1 (555) 100-0005',
        dateOfBirth: '1987-09-14',
        gender: Gender.MALE,
        address: { street: '654 Market St', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' },
        departmentId: 'dept-4',
        departmentName: 'Marketing',
        jobTitle: 'Marketing Director',
        managerId: null,
        hireDate: '2019-07-01',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 130000,
        currency: 'USD',
        skills: ['SEO', 'Content Marketing', 'Analytics', 'Branding'],
        bio: 'Growth marketer focused on data-driven strategies.',
        createdAt: '2019-07-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-6',
        employeeId: 'EMP-006',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@company.com',
        phone: '+1 (555) 100-0006',
        dateOfBirth: '1993-05-30',
        gender: Gender.FEMALE,
        address: { street: '987 Broadway', city: 'New York', state: 'NY', zipCode: '10004', country: 'USA' },
        departmentId: 'dept-1',
        departmentName: 'Engineering',
        jobTitle: 'Frontend Developer',
        managerId: 'emp-2',
        managerName: 'Jane Smith',
        hireDate: '2021-04-05',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 105000,
        currency: 'USD',
        skills: ['React', 'TypeScript', 'CSS', 'Testing'],
        bio: 'UI/UX focused frontend developer.',
        createdAt: '2021-04-05T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-7',
        employeeId: 'EMP-007',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@company.com',
        phone: '+1 (555) 100-0007',
        dateOfBirth: '1991-08-18',
        gender: Gender.MALE,
        address: { street: '147 Tech Dr', city: 'San Jose', state: 'CA', zipCode: '95101', country: 'USA' },
        departmentId: 'dept-1',
        departmentName: 'Engineering',
        jobTitle: 'DevOps Engineer',
        managerId: 'emp-2',
        managerName: 'Jane Smith',
        hireDate: '2020-11-15',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 115000,
        currency: 'USD',
        skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
        bio: 'Infrastructure automation specialist.',
        createdAt: '2020-11-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-8',
        employeeId: 'EMP-008',
        firstName: 'Sarah',
        lastName: 'Martinez',
        email: 'sarah.martinez@company.com',
        phone: '+1 (555) 100-0008',
        dateOfBirth: '1995-01-25',
        gender: Gender.FEMALE,
        address: { street: '258 Lake Shore Dr', city: 'Chicago', state: 'IL', zipCode: '60611', country: 'USA' },
        departmentId: 'dept-2',
        departmentName: 'Human Resources',
        jobTitle: 'HR Specialist',
        managerId: 'emp-3',
        managerName: 'Bob Johnson',
        hireDate: '2022-08-20',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 72000,
        currency: 'USD',
        skills: ['Onboarding', 'Benefits Administration', 'Employee Relations'],
        bio: 'Dedicated HR specialist focused on employee experience.',
        createdAt: '2022-08-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-9',
        employeeId: 'EMP-009',
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.lee@company.com',
        phone: '+1 (555) 100-0009',
        dateOfBirth: '1992-12-03',
        gender: Gender.MALE,
        departmentId: 'dept-1',
        departmentName: 'Engineering',
        jobTitle: 'Backend Developer',
        managerId: 'emp-2',
        managerName: 'Jane Smith',
        hireDate: '2023-02-13',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 110000,
        currency: 'USD',
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices'],
        bio: 'Backend engineer specializing in scalable systems.',
        createdAt: '2023-02-13T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'emp-10',
        employeeId: 'EMP-010',
        firstName: 'Olivia',
        lastName: 'Taylor',
        email: 'olivia.taylor@company.com',
        phone: '+1 (555) 100-0010',
        dateOfBirth: '1997-06-17',
        gender: Gender.FEMALE,
        departmentId: 'dept-4',
        departmentName: 'Marketing',
        jobTitle: 'Content Strategist',
        managerId: 'emp-5',
        managerName: 'Charlie Davis',
        hireDate: '2023-06-01',
        employmentStatus: EmploymentStatus.ACTIVE,
        employmentType: EmploymentType.FULL_TIME,
        salary: 75000,
        currency: 'USD',
        skills: ['Copywriting', 'SEO', 'Social Media', 'Content Planning'],
        bio: 'Creative content strategist with a passion for storytelling.',
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Mock auth tokens (in a real app these would be JWT signed by a server)
    const auth = [
      {
        id: 1,
        email: 'admin@company.com',
        password: 'Admin@123',
        token: 'mock.admin.token',
        user: {
          id: 'emp-2',
          email: 'admin@company.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'admin',
          createdAt: new Date().toISOString(),
        }
      },
      {
        id: 2,
        email: 'hr@company.com',
        password: 'Hr@123',
        token: 'mock.hr.token',
        user: {
          id: 'emp-3',
          email: 'hr@company.com',
          firstName: 'Bob',
          lastName: 'Johnson',
          role: 'hr',
          createdAt: new Date().toISOString(),
        }
      },
      {
        id: 3,
        email: 'employee@company.com',
        password: 'Employee@123',
        token: 'mock.employee.token',
        user: {
          id: 'emp-1',
          email: 'employee@company.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'employee',
          createdAt: new Date().toISOString(),
        }
      },
    ];

    return { employees, departments, auth };
  }

  /**
   * Override the POST handler for auth/login to return a mock JWT response.
   */
  post(reqInfo: RequestInfo): Observable<object> | undefined {
    if (reqInfo.collectionName === 'auth' && reqInfo.id === 'login') {
      return this.handleLogin(reqInfo);
    }
    return undefined; // Let the default handler deal with it
  }

  private handleLogin(reqInfo: RequestInfo): Observable<object> {
    const body = reqInfo.utils.getJsonBody(reqInfo.req) as { email: string; password: string };
    const db = reqInfo.utils.createResponse$(() => {
      const users = this.createDb() as { auth: Array<{ email: string; password: string; user: object }> };
      const match = users.auth.find(
        u => u.email === body.email && u.password === body.password
      );

      if (match) {
        return {
          status: 200,
          body: {
            accessToken: btoa(JSON.stringify({ sub: match.email, role: (match.user as any).role, exp: Date.now() / 1000 + 3600 })),
            refreshToken: btoa(JSON.stringify({ sub: match.email })),
            expiresIn: 3600,
            user: match.user,
          }
        };
      }

      return {
        status: 401,
        body: { success: false, message: 'Invalid email or password' }
      };
    });

    return db;
  }
}
