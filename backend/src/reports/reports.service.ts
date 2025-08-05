import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../goals/goal.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Goal)
    private goalsRepository: Repository<Goal>,
  ) {}

  async getGoalCompletionByDepartment(): Promise<any[]> {
    const data = await this.goalsRepository
        .createQueryBuilder('goal')
        .leftJoinAndSelect('goal.employee', 'employee')
        .select('employee.department', 'name')
        .addSelect(`
            CAST(SUM(CASE WHEN goal.status = 'completed' THEN 1 ELSE 0 END) AS REAL) / COUNT(goal.id) * 100
        `, 'rate')
        .groupBy('employee.department')
        .getRawMany();
    
    return data;
  }
}
