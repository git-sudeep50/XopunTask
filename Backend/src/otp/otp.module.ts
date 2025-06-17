import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from 'src/redis/redis.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  providers: [OtpService],
  exports: [OtpService],
  imports: [RedisModule,MailModule],
})
export class OtpModule {}
