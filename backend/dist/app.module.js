"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const employees_module_1 = require("./employees/employees.module");
const reviews_module_1 = require("./reviews/reviews.module");
const goals_module_1 = require("./goals/goals.module");
const skills_module_1 = require("./skills/skills.module");
const user_entity_1 = require("./users/user.entity");
const employee_entity_1 = require("./employees/employee.entity");
const review_entity_1 = require("./reviews/review.entity");
const review_cycle_entity_1 = require("./reviews/review-cycle.entity");
const goal_entity_1 = require("./goals/goal.entity");
const skill_entity_1 = require("./skills/skill.entity");
const skill_assessment_entity_1 = require("./skills/skill-assessment.entity");
const reports_module_1 = require("./reports/reports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    entities: [user_entity_1.User, employee_entity_1.Employee, review_entity_1.Review, review_cycle_entity_1.ReviewCycle, goal_entity_1.Goal, skill_entity_1.Skill, skill_assessment_entity_1.SkillAssessment],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            employees_module_1.EmployeesModule,
            reviews_module_1.ReviewsModule,
            goals_module_1.GoalsModule,
            skills_module_1.SkillsModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map