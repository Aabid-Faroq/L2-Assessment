import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesService {
    private employeesRepository;
    constructor(employeesRepository: Repository<Employee>);
    findAll(user: any, query: {
        managerId?: string;
    }): Promise<Employee[]>;
    findOne(id: string, user: any): Promise<Employee>;
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    remove(id: string): Promise<void>;
}
