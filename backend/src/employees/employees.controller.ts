import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Employee } from './employee.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth-user.interface';

@ApiBearerAuth()
@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles('hr')
  @ApiOperation({ summary: 'Create a new employee profile (HR only)' })
  @ApiResponse({ status: 201, description: 'The employee has been successfully created.', type: Employee })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles('hr', 'manager')
  @ApiOperation({ summary: 'Get all employees' })
  @ApiQuery({ name: 'manager_id', required: false, description: 'Filter employees by manager ID' })
  @ApiResponse({ status: 200, description: 'Return all employees.', type: [Employee] })
  findAll(@CurrentUser() user: AuthUser, @Query('manager_id') managerId?: string) {
    return this.employeesService.findAll(user, { managerId });
  }

  @Get(':id')
  @Roles('hr', 'manager', 'employee')
  @ApiOperation({ summary: 'Get an employee profile by ID' })
  @ApiResponse({ status: 200, description: 'Return the employee profile.', type: Employee })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.employeesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('hr')
  @ApiOperation({ summary: 'Update an employee profile (HR only)' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully updated.', type: Employee })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles('hr')
  @ApiOperation({ summary: 'Delete an employee profile (HR only)' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}

