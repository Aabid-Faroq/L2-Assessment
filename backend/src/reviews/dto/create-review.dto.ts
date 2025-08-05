import { IsString, IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  cycle_id: string;

  @IsUUID()
  reviewee_id: string;
  
  // reviewer_id will be taken from the authenticated user

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  feedback: string;

  @IsString()
  type: string;
}
