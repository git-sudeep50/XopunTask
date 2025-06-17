import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {message: string} {
    return {message: "Hello Sakil"};
  }

  postHello(): string {
    console.log('postHello');
    return 'postHello';
  }
}
