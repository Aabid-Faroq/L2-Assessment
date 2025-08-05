import { Employee } from '../employees/employee.entity';
export declare class Goal {
    id: string;
    employeeId: string;
    employee: Employee;
    title: string;
    description: string;
    type: string;
    status: string;
    progress: number;
    weightage: number;
    createdAt: Date;
    updatedAt: Date;
}
