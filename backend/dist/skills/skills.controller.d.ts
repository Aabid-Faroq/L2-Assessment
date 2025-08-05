import { SkillsService } from './skills.service';
import { AuthUser } from 'src/auth/auth-user.interface';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    findAll(user: AuthUser): Promise<import("./skill-assessment.entity").SkillAssessment[]>;
}
