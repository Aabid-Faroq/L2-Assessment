import { Controller, Post, Body, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUser } from 'src/auth/auth-user.interface';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiBearerAuth()
@ApiTags('Goals')
@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  create(@Body() createGoalDto: CreateGoalDto, @CurrentUser() user: AuthUser) {
    return this.goalsService.create(createGoalDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get goals for the current user' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.goalsService.findAllForUser(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @CurrentUser() user: AuthUser) {
    return this.goalsService.update(id, updateGoalDto, user);
  }
}
