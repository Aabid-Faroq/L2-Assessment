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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessment = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../employees/employee.entity");
const skill_entity_1 = require("./skill.entity");
let SkillAssessment = class SkillAssessment {
    id;
    employeeId;
    employee;
    skillId;
    skill;
    selfRating;
    managerRating;
    createdAt;
    updatedAt;
};
exports.SkillAssessment = SkillAssessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SkillAssessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SkillAssessment.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employeeId' }),
    __metadata("design:type", employee_entity_1.Employee)
], SkillAssessment.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SkillAssessment.prototype, "skillId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => skill_entity_1.Skill),
    (0, typeorm_1.JoinColumn)({ name: 'skillId' }),
    __metadata("design:type", skill_entity_1.Skill)
], SkillAssessment.prototype, "skill", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SkillAssessment.prototype, "selfRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SkillAssessment.prototype, "managerRating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SkillAssessment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SkillAssessment.prototype, "updatedAt", void 0);
exports.SkillAssessment = SkillAssessment = __decorate([
    (0, typeorm_1.Entity)('skill_assessments')
], SkillAssessment);
//# sourceMappingURL=skill-assessment.entity.js.map