export interface AuthUser {
    sub: string;
    email: string;
    role: 'hr' | 'manager' | 'employee';
    employeeId: string;
    iat: number;
    exp: number;
  }
  