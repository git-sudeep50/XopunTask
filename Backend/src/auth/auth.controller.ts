import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { CreateOtpDto } from './dto/otp-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Response } from 'express';

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

  @Post('login')
  async login(@Body() loginDto:LoginDto,@Res({ passthrough: true }) response: Response,){
    const user = await this.authService.validateUser(loginDto);
    if(!user) return {message: `User does not exist or password is incorrect`};
    const token = await this.authService.login(loginDto);
    console.log("TOKEN",token);

    response.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, 
  });

    return {message: `User logged in successfully`};
  }

}
