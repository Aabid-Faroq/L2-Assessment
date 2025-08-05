import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Review } from './review.entity';
import { ReviewCycle } from './review-cycle.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewCycleDto } from './dto/create-review-cycle.dto';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewCycle)
    private reviewCyclesRepository: Repository<ReviewCycle>,
    private employeesService: EmployeesService,
  ) {}

  async findAll(user: any): Promise<Review[]> {
    if (user.role === 'hr') {
      return this.reviewsRepository.find({ relations: ['reviewee', 'reviewer'] });
    }
    
    if (user.role === 'manager') {
      const team = await this.employeesService.findAll(user, {});
      console.log(team);
      const teamIds = team.map(e => e.id);
      return this.reviewsRepository.find({ 
        where: { reviewee_id: In(teamIds) },
        relations: ['reviewee', 'reviewer'],
      });
    }

    // Employee
    return this.reviewsRepository.find({
      where: { reviewee_id: user.employeeId },
      relations: ['reviewee', 'reviewer'],
    });
  }

  findAllCycles(): Promise<ReviewCycle[]> {
    return this.reviewCyclesRepository.find();
  }
  
  async findOneCycle(id: string): Promise<{ cycle: ReviewCycle, reviews: Review[] }> {
    const cycle = await this.reviewCyclesRepository.findOne({ where: { id } });
    if (!cycle) {
        throw new Error('Review cycle not found');
    }
    const reviews = await this.reviewsRepository.find({
        where: { cycle_id: id },
        relations: ['reviewee', 'reviewer']
    });
    return { cycle, reviews };
  }

  create(createReviewDto: CreateReviewDto, reviewerId: string): Promise<Review> {
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      reviewer_id: reviewerId,
      status: 'completed',
    });
    return this.reviewsRepository.save(review);
  }

  createCycle(createReviewCycleDto: CreateReviewCycleDto): Promise<ReviewCycle> {
    const cycle = this.reviewCyclesRepository.create({
      name: createReviewCycleDto.name,
      start_date: new Date(createReviewCycleDto.startDate),
      end_date: new Date(createReviewCycleDto.endDate),
      status: 'active',
    });
    return this.reviewCyclesRepository.save(cycle);
  }
}
