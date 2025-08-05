import { User } from '../users/user.entity';
export declare class Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: Date;
    department: string;
    designation: string;
    joiningDate: Date;
    status: string;
    manager: Employee;
    managerId: string;
    directReports: Employee[];
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
