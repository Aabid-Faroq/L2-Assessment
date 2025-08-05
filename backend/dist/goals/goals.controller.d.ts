import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { AuthUser } from 'src/auth/auth-user.interface';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    create(createGoalDto: CreateGoalDto, user: AuthUser): Promise<import("./goal.entity").Goal>;
    findAll(user: AuthUser): Promise<import("./goal.entity").Goal[]>;
    update(id: string, updateGoalDto: UpdateGoalDto, user: AuthUser): Promise<import("./goal.entity").Goal>;
}
