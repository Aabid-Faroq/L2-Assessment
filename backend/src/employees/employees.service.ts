import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../users/user.entity'; // Assuming user object from JWT will have this shape

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async findAll(user: any, query: { managerId?: string }): Promise<Employee[]> {
    if (user.role === 'hr') {
      return this.employeesRepository.find({ relations: ['manager', 'directReports'] });
    }
    if (user.role === 'manager') {
      // If a managerId is provided in the query, use it. Otherwise, use the manager's own employeeId.
      const managerToFilterBy = query.managerId || user.employeeId;
      return this.employeesRepository.find({ 
        where: { managerId: managerToFilterBy }, 
        relations: ['manager', 'directReports'] 
      });
    }
    // Employees should only see their own profile in a list view
    return this.employeesRepository.find({ where: { id: user.employeeId } });
  }

  async findOne(id: string, user: any): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ 
      where: { id }, 
      relations: ['manager', 'directReports']
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    // Authorization check
    const isOwnProfile = user.employeeId === id;
    const isTheirManager = employee.managerId === user.employeeId;
    const isTheirDirectReport = (await this.employeesRepository.findOne({where: {id: user.employeeId, managerId: id}})) !== null;


    if (user.role === 'hr' || isOwnProfile || isTheirManager || isTheirDirectReport) {
        return employee;
    }
    
    throw new ForbiddenException(`You do not have permission to view this profile.`);
  }

  create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepository.create(createEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeesRepository.preload({
      id: id,
      ...updateEmployeeDto,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
  }
}
