import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('review_cycles')
export class ReviewCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;

  @Column()
  status: string; // 'active', 'closed'
}
