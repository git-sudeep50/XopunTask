import { Optional } from '@nestjs/common';
import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';
export class VerifyOtpDto {
    @IsEmail()
    email: string;
    @IsNumberString()
    @Length(6, 6, { message: 'OTP must be a 6-digit number' })
    otp:string
}