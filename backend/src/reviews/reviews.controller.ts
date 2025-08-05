import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewCycleDto } from './dto/create-review-cycle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth-user.interface';
import { Param } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of reviews based on role' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.reviewsService.findAll(user);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a new review' })
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: AuthUser) {
    return this.reviewsService.create(createReviewDto, user.employeeId);
  }

  @Get('/cycles')
  @ApiOperation({ summary: 'Get all review cycles' })
  findAllCycles() {
    return this.reviewsService.findAllCycles();
  }

  @Get('/cycles/:id')
  @ApiOperation({ summary: 'Get a single review cycle and its reviews' })
  findOneCycle(@Param('id') id: string) {
    return this.reviewsService.findOneCycle(id);
  }

  @Post('/cycles')
  @Roles('hr')
  @ApiOperation({ summary: 'Create a new review cycle' })
  createCycle(@Body() createReviewCycleDto: CreateReviewCycleDto) {
    return this.reviewsService.createCycle(createReviewCycleDto);
  }
}
