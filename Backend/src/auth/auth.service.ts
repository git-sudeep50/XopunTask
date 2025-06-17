import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private redisService: RedisService) {}

  async checkUser(email: string) {
    return await this.prisma.user.findUnique({ where: { uid: email } });
  }

  async verifyOtpAndCreateUser(verifyOtpDto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({ where: { uid: verifyOtpDto.email } });
    if(user) return {message: `User already exists`};
    const otp = await this.redisService.getOTP(verifyOtpDto.email);
    console.log("OTP  ",otp);
    if(otp !== verifyOtpDto.otp) return {message: `Invalid otp`};
    const hashedPassword = await bcrypt.hash(verifyOtpDto.password, 10);
    await this.prisma.user.create({ data: { uid: verifyOtpDto.email, uname: verifyOtpDto.userName, password: hashedPassword } });
    return {verified: true,message:'User created successfully'};
  }
  

  
}
