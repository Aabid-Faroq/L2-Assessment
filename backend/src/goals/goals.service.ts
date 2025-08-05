import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { AuthUser } from 'src/auth/auth-user.interface';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalsRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto, user: AuthUser): Promise<Goal> {
    // TODO: Add authorization logic to ensure only HR or a manager can create goals
    const goal = this.goalsRepository.create({
      ...createGoalDto,
      status: 'not_started',
      progress: 0,
      weightage: 0, // Default weightage
    });
    return this.goalsRepository.save(goal);
  }

  async findAllForUser(user: AuthUser): Promise<Goal[]> {
    // This will need to be expanded with manager/HR logic later
    return this.goalsRepository.find({
      where: { employeeId: user.employeeId },
      relations: ['employee'],
    });
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, user: AuthUser): Promise<Goal> {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (!goal) {
      throw new Error('Goal not found');
    }
    // Authorization: only the employee themselves can update the progress
    if (goal.employeeId !== user.employeeId) {
      throw new UnauthorizedException('You can only update your own goals.');
    }
    
    Object.assign(goal, updateGoalDto);
    return this.goalsRepository.save(goal);
  }
}
