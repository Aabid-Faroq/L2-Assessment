import { Employee } from '../employees/employee.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    role: string;
    employeeId: string;
    employee: Employee;
    createdAt: Date;
    updatedAt: Date;
}
