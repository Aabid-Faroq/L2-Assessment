import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column()
  department: string;

  @Column()
  designation: string;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column()
  status: string; // 'active' or 'inactive'

  @ManyToOne(() => Employee, employee => employee.directReports, { nullable: true })
  manager: Employee;

  @Column({ nullable: true })
  managerId: string;

  @OneToMany(() => Employee, employee => employee.manager)
  directReports: Employee[];
  
  @OneToMany(() => User, user => user.employee)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
