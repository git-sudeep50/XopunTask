import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  async checkUser(email: string) {
    return await this.prisma.user.findUnique({ where: { uid: email } });
  }

  async verifyOtpAndCreateUser(verifyOtpDto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { uid: verifyOtpDto.email },
    });
    if (user) return { message: `User already exists` };
    const otp = await this.redisService.getOTP(verifyOtpDto.email);
    console.log('OTP  ', otp);
    if (otp !== verifyOtpDto.otp) return { message: `Invalid otp` };
    const hashedPassword = await bcrypt.hash(verifyOtpDto.password, 10);
    await this.prisma.user.create({
      data: {
        uid: verifyOtpDto.email,
        uname: verifyOtpDto.userName,
        password: hashedPassword,
      },
    });
    return { verified: true, message: 'User created and logged in successfully' };
  }

  async validateUser({email,password}:LoginDto){
    const user = await this.prisma.user.findUnique({where: {uid: email}});
    if(!user) return null;
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid) return null;
    return user;
  }

  async login(user: LoginDto) {
    const payload = {  email: user.email,iat: Math.floor(Date.now() / 1000)};
    const token = this.jwtService.sign(payload);
    return token;
  }
}
