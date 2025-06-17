import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { OtpService } from './otp/otp.service';
import { RedisService } from './redis/redis.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [TasksModule, AuthModule, PrismaModule, MailModule],
  controllers: [AppController],
  providers: [AppService, OtpService, RedisService],
})
export class AppModule {}
