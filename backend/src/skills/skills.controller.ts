import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkillsService } from './skills.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUser } from 'src/auth/auth-user.interface';

@ApiBearerAuth()
@ApiTags('Skills')
@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get skill assessments for the current user' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.skillsService.findAllForUser(user);
  }
}
