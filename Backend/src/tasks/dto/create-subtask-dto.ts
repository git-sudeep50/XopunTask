import { Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";

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
    priority: string;

    @IsString()
    @IsOptional()
    status: string;
}