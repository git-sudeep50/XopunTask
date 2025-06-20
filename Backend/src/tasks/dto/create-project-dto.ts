import {IsString, IsEmail,IsDate,IsOptional} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateProjectDto {
    @IsString()
    title: string;
    @IsString()
    description: string;
    @IsEmail()
    userId:string
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startDate: Date;
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate: Date;
}