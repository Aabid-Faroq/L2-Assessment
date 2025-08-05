import { Repository } from 'typeorm';
import { SkillAssessment } from './skill-assessment.entity';
import { AuthUser } from 'src/auth/auth-user.interface';
export declare class SkillsService {
    private skillAssessmentsRepository;
    constructor(skillAssessmentsRepository: Repository<SkillAssessment>);
    findAllForUser(user: AuthUser): Promise<SkillAssessment[]>;
}
