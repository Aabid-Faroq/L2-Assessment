import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GoalsModule } from './goals/goals.module';
import { SkillsModule } from './skills/skills.module';
import { User } from './users/user.entity';
import { Employee } from './employees/employee.entity';
import { Review } from './reviews/review.entity';
import { ReviewCycle } from './reviews/review-cycle.entity';
import { Goal } from './goals/goal.entity';
import { Skill } from './skills/skill.entity';
import { SkillAssessment } from './skills/skill-assessment.entity';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Employee, Review, ReviewCycle, Goal, Skill, SkillAssessment],
        synchronize: true, // Should be false in production
      }),
    }),
    AuthModule,
    UsersModule,
    EmployeesModule,
    ReviewsModule,
    GoalsModule,
    SkillsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
