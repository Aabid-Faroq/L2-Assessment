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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./review.entity");
const review_cycle_entity_1 = require("./review-cycle.entity");
const employees_service_1 = require("../employees/employees.service");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    reviewCyclesRepository;
    employeesService;
    constructor(reviewsRepository, reviewCyclesRepository, employeesService) {
        this.reviewsRepository = reviewsRepository;
        this.reviewCyclesRepository = reviewCyclesRepository;
        this.employeesService = employeesService;
    }
    async findAll(user) {
        if (user.role === 'hr') {
            return this.reviewsRepository.find({ relations: ['reviewee', 'reviewer'] });
        }
        if (user.role === 'manager') {
            const team = await this.employeesService.findAll(user, {});
            console.log(team);
            const teamIds = team.map(e => e.id);
            return this.reviewsRepository.find({
                where: { reviewee_id: (0, typeorm_2.In)(teamIds) },
                relations: ['reviewee', 'reviewer'],
            });
        }
        return this.reviewsRepository.find({
            where: { reviewee_id: user.employeeId },
            relations: ['reviewee', 'reviewer'],
        });
    }
    findAllCycles() {
        return this.reviewCyclesRepository.find();
    }
    async findOneCycle(id) {
        const cycle = await this.reviewCyclesRepository.findOne({ where: { id } });
        if (!cycle) {
            throw new Error('Review cycle not found');
        }
        const reviews = await this.reviewsRepository.find({
            where: { cycle_id: id },
            relations: ['reviewee', 'reviewer']
        });
        return { cycle, reviews };
    }
    create(createReviewDto, reviewerId) {
        const review = this.reviewsRepository.create({
            ...createReviewDto,
            reviewer_id: reviewerId,
            status: 'completed',
        });
        return this.reviewsRepository.save(review);
    }
    createCycle(createReviewCycleDto) {
        const cycle = this.reviewCyclesRepository.create({
            name: createReviewCycleDto.name,
            start_date: new Date(createReviewCycleDto.startDate),
            end_date: new Date(createReviewCycleDto.endDate),
            status: 'active',
        });
        return this.reviewCyclesRepository.save(cycle);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(review_cycle_entity_1.ReviewCycle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        employees_service_1.EmployeesService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map