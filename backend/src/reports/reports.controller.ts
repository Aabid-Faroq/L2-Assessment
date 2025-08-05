import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiBearerAuth()
@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('goal-completion')
  @ApiOperation({ summary: 'Get goal completion rate by department' })
  getGoalCompletion() {
    return this.reportsService.getGoalCompletionByDepartment();
  }
}
