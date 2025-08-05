import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { ReviewCycle } from './review-cycle.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewCycleDto } from './dto/create-review-cycle.dto';
import { EmployeesService } from '../employees/employees.service';
export declare class ReviewsService {
    private reviewsRepository;
    private reviewCyclesRepository;
    private employeesService;
    constructor(reviewsRepository: Repository<Review>, reviewCyclesRepository: Repository<ReviewCycle>, employeesService: EmployeesService);
    findAll(user: any): Promise<Review[]>;
    findAllCycles(): Promise<ReviewCycle[]>;
    findOneCycle(id: string): Promise<{
        cycle: ReviewCycle;
        reviews: Review[];
    }>;
    create(createReviewDto: CreateReviewDto, reviewerId: string): Promise<Review>;
    createCycle(createReviewCycleDto: CreateReviewCycleDto): Promise<ReviewCycle>;
}
