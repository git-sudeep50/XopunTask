import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis({
      host: 'localhost', 
      port: 6379,
    });
  }

  onModuleDestroy() {
    this.redis.quit();
  }

  async setOTP(key: string, value: string, ttl: number): Promise<'OK'> {
    return await this.redis.set(key, value, 'EX', ttl); 
  }

  async getOTP(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async deleteOTP(key: string): Promise<number> {
    return await this.redis.del(key);
  }
}
