import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate } from 'class-validator';

enum ProjectStatus {
  ASSIGNED = 'ASSIGNED',
  PROGRESS = 'PROGRESS',
  COMPLETED = 'COMPLETED',
  EXCEEDED = 'EXCEEDED',
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  pname?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate: Date;

  @IsOptional()
  @IsString()
  status: ProjectStatus;

  // Add more optional fields as needed
}
