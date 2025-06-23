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

export class CreateSubtaskDto {
    @IsString()
    subtaskName: string;

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

    @IsEmail()
    ownerId: string;

    @IsString()
    taskId: string;

    @IsString()
    @IsOptional()
    priority: Priority;

    @IsString()
    @IsOptional()
    status: Status;
}