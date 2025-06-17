import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateOtpDto } from './dto/otp-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('generate-otp')
  async generateOtp(@Body() createOtpDto: CreateOtpDto) {
    const user = await this.authService.checkUser(createOtpDto.email);
    if(user) return {message: `User already exists`};
    await this.otpService.generateOtp(createOtpDto);
    return {message: `Otp sent successfully`};
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const res = await this.authService.verifyOtpAndCreateUser(verifyOtpDto);
    return res;
  }

}
