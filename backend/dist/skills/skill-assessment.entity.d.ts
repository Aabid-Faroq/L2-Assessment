import { Employee } from '../employees/employee.entity';
import { Skill } from './skill.entity';
export declare class SkillAssessment {
    id: string;
    employeeId: string;
    employee: Employee;
    skillId: string;
    skill: Skill;
    selfRating: number;
    managerRating: number;
    createdAt: Date;
    updatedAt: Date;
}
