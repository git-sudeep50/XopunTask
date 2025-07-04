import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): {message: string} {
    return this.appService.getHello();
  }

  @Post()
  postHello(): string {
    return this.appService.postHello();
  }
}
