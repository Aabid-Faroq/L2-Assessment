import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGoalDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  progress?: number;
}
