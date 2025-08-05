import { IsString, IsEmail, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsDateString()
  @IsOptional()
  dob: Date;

  @IsString()
  department: string;

  @IsString()
  designation: string;

  @IsDateString()
  joiningDate: Date;

  @IsString()
  @IsIn(['active', 'inactive'])
  status: string;

  @IsString()
  @IsOptional()
  managerId: string;
}
