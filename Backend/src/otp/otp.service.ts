import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from 'src/auth/dto/otp-auth.dto';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    private redisService: RedisService,
    private mailService: MailService,
  ) {}
  async generateOtp(createOtpDto: CreateOtpDto) {
    const newOtp = randomInt(100000,999999).toString();
    await this.redisService.setOTP(createOtpDto.email, newOtp, 300);
    const otp = await this.redisService.getOTP(createOtpDto.email);
    const data = {
      to: createOtpDto.email,
      subject: 'OTP for Registration',
      text: `Your OTP is ${otp}. This OTP will exppire in 5 minutes`,
    }
    await this.mailService.sendMail(data);
    return { message: `Otp sent successfully ${otp}` };
  }
}
