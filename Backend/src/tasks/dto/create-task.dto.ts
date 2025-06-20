import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";

enum Priority{
    URGENT = 'URGENT',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

enum Status{
    ASSIGNED = 'ASSIGNED',
    PROGRESS = 'PROGRESS',
    COMPLETED = 'COMPLETED',
    EXCEEDED = 'EXCEEDED'
}

export class CreateTaskDto {
    @IsString()
    taskName: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    dueDate: Date;

    @IsString()
    projectId: string;

    @IsEmail()
    ownerId: string;

    @IsString()
    @IsOptional()
    status: Status;

    @IsString()
    @IsOptional()
    priority: Priority
}

