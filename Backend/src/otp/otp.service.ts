import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from 'src/auth/dto/otp-auth.dto';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    private redisService: RedisService,
    private mailService: MailService,
  ) {}
  async generateOtp(createOtpDto: CreateOtpDto) {
    await this.redisService.setOTP(createOtpDto.email, '568985', 300);
    const otp = await this.redisService.getOTP(createOtpDto.email);
    const data = {
      to: createOtpDto.email,
      subject: 'OTP for Registration',
      text: `Your otp is ${otp}`,
    }
    await this.mailService.sendMail(data);
    return { message: `Otp sent successfully ${otp}` };
  }
}
