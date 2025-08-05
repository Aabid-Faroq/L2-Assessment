import { Employee } from '../employees/employee.entity';
import { ReviewCycle } from './review-cycle.entity';
export declare class Review {
    id: string;
    cycle: ReviewCycle;
    cycle_id: string;
    reviewee: Employee;
    reviewee_id: string;
    reviewer: Employee;
    reviewer_id: string;
    rating: number;
    feedback: string;
    type: string;
    status: string;
}
