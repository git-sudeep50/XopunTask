import { Optional } from '@nestjs/common';
import {
  IsAlphanumeric,
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class VerifyOtpDto {
  @IsEmail()
  email: string;
  @IsNumberString()
  @Length(6, 6, { message: 'OTP must be a 6-digit number' })
  otp: string;
  @IsString()
  userName: string;
  @Matches(/^[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain only letters, numbers, and allowed special characters (@$!%*?&)',
  })
  password: string;
}
