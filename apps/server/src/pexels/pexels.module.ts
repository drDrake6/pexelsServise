import { Module } from '@nestjs/common';
import { PexelsService } from './pexels.service';
import { PexelsController } from './pexels.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-yet';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore.redisStore({
          url: configService.get(configService.get<string>('redis.url')!),
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PexelsController],
  providers: [PexelsService],
})
export class PexelsModule {}
