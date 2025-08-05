import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../employees/employee.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  type: string; // e.g., 'quarterly', 'annual'

  @Column()
  status: string; // e.g., 'not_started', 'in_progress', 'completed'

  @Column({ type: 'int' })
  progress: number;

  @Column({ type: 'int' })
  weightage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
