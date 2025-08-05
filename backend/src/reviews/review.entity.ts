import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { ReviewCycle } from './review-cycle.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ReviewCycle)
  cycle: ReviewCycle;

  @Column()
  cycle_id: string;

  @ManyToOne(() => Employee)
  reviewee: Employee;
  
  @Column()
  reviewee_id: string;

  @ManyToOne(() => Employee)
  reviewer: Employee;

  @Column()
  reviewer_id: string;

  @Column('int')
  rating: number;

  @Column('text')
  feedback: string;
  
  @Column()
  type: string; // 'self', 'manager', 'peer', 'direct_report'

  @Column()
  status: string; // 'pending', 'completed'
}
