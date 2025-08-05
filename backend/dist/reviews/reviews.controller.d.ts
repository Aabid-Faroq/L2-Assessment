import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewCycleDto } from './dto/create-review-cycle.dto';
import { AuthUser } from '../auth/auth-user.interface';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(user: AuthUser): Promise<import("./review.entity").Review[]>;
    create(createReviewDto: CreateReviewDto, user: AuthUser): Promise<import("./review.entity").Review>;
    findAllCycles(): Promise<import("./review-cycle.entity").ReviewCycle[]>;
    findOneCycle(id: string): Promise<{
        cycle: import("./review-cycle.entity").ReviewCycle;
        reviews: import("./review.entity").Review[];
    }>;
    createCycle(createReviewCycleDto: CreateReviewCycleDto): Promise<import("./review-cycle.entity").ReviewCycle>;
}
