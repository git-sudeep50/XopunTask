import { Optional } from '@nestjs/common';
import { IsEmail, IsString, Length } from 'class-validator';
export class CreateOtpDto {
    @IsEmail()
    email: string;
}