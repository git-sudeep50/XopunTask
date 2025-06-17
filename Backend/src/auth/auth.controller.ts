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
    console.log(verifyOtpDto);
    return {message: verifyOtpDto}
  }


  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
