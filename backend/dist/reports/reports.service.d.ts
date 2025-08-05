import { Repository } from 'typeorm';
import { Goal } from '../goals/goal.entity';
export declare class ReportsService {
    private goalsRepository;
    constructor(goalsRepository: Repository<Goal>);
    getGoalCompletionByDepartment(): Promise<any[]>;
}
