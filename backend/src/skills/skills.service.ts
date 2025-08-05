import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillAssessment } from './skill-assessment.entity';
import { AuthUser } from 'src/auth/auth-user.interface';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillAssessment)
    private skillAssessmentsRepository: Repository<SkillAssessment>,
  ) {}

  findAllForUser(user: AuthUser): Promise<SkillAssessment[]> {
    return this.skillAssessmentsRepository.find({
      where: { employeeId: user.employeeId },
      relations: ['skill', 'employee'],
    });
  }
}
