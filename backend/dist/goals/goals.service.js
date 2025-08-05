"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_entity_1 = require("./goal.entity");
let GoalsService = class GoalsService {
    goalsRepository;
    constructor(goalsRepository) {
        this.goalsRepository = goalsRepository;
    }
    async create(createGoalDto, user) {
        const goal = this.goalsRepository.create({
            ...createGoalDto,
            status: 'not_started',
            progress: 0,
            weightage: 0,
        });
        return this.goalsRepository.save(goal);
    }
    async findAllForUser(user) {
        return this.goalsRepository.find({
            where: { employeeId: user.employeeId },
            relations: ['employee'],
        });
    }
    async update(id, updateGoalDto, user) {
        const goal = await this.goalsRepository.findOne({ where: { id } });
        if (!goal) {
            throw new Error('Goal not found');
        }
        if (goal.employeeId !== user.employeeId) {
            throw new common_1.UnauthorizedException('You can only update your own goals.');
        }
        Object.assign(goal, updateGoalDto);
        return this.goalsRepository.save(goal);
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GoalsService);
//# sourceMappingURL=goals.service.js.map