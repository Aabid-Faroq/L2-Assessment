import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { AuthUser } from 'src/auth/auth-user.interface';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsService {
    private goalsRepository;
    constructor(goalsRepository: Repository<Goal>);
    create(createGoalDto: CreateGoalDto, user: AuthUser): Promise<Goal>;
    findAllForUser(user: AuthUser): Promise<Goal[]>;
    update(id: string, updateGoalDto: UpdateGoalDto, user: AuthUser): Promise<Goal>;
}
