import { Test, TestingModule } from '@nestjs/testing';
import { PexelsService as PexelsService } from './pexels.service';
import { PexelsModule } from './pexels.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import * as redisStore from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import PexelsRequestDto from '../dto/pexels.request.dto';
import PexelsResponseDto from '../dto/pexels.response.dto';

describe('ImageService', () => {
  let imageService: PexelsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PexelsModule,
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
      controllers: [],
      providers: [PexelsService],
    }).compile();

    imageService = app.get<PexelsService>(PexelsService);
  });

  describe('findImage id', () => {
    const result: number = 4259140;
    const pexelsRequest: PexelsRequestDto = new PexelsRequestDto({
      quary: 'people',
      page: 1,
      from: 0,
      amount: 1,
    });
    it('should return "id"', async () => {
      expect((await imageService.findImage(pexelsRequest)).getImage(0).id).toBe(
        result,
      );
    });
    it('should throw error', async () => {
      await expect(async () => {
        (await imageService.findImage(pexelsRequest)).getPrevPage();
      }).rejects.toThrow(
        "PexelsResponseDto::getPrevPage: prev page doesn't exists",
      );
    });

    it('should throw error', async () => {
      await expect(async () => {
        (await imageService.findImage(pexelsRequest)).getImage(-1);
      }).rejects.toThrow('PexelsResponseDto::getImage: index out of range');
    });

    it('should throw error', async () => {
      await expect(async () => {
        (await imageService.findImage(pexelsRequest)).getImage(1);
      }).rejects.toThrow('PexelsResponseDto::getImage: index out of range');
    });

    const badDto: PexelsResponseDto = new PexelsResponseDto();

    it('should throw error', () => {
      expect(() => {
        badDto.getNextPage();
      }).toThrow("PexelsResponseDto::getNextPage: next page doesn't exists");
    });

    it('should throw error', () => {
      expect(() => {
        badDto.getNextPage();
      }).toThrow("PexelsResponseDto::getNextPage: next page doesn't exists");
    });

    it('should throw error', () => {
      expect(() => {
        badDto.getImage(0);
      }).toThrow('PexelsResponseDto::getImage: there are no images');
    });

    it('should throw error', () => {
      expect(() => {
        badDto.setTotalResults(-10);
      }).toThrow(
        'PexelsResponseDto::setTotalResults: total value can not be negative',
      );
    });

    it('should throw error', () => {
      expect(() => {
        badDto.setPrevPage(-10);
      }).toThrow(
        'PexelsResponseDto::setPrevPage: prev value can not be negative',
      );
    });

    it('should throw error', () => {
      expect(() => {
        badDto.setNextPage(-10);
      }).toThrow(
        'PexelsResponseDto::setNextPage: next value can not be negative',
      );
    });
  });

  describe('findImage Url, next page', () => {
    const result: string =
      'https://www.pexels.com/photo/crowd-of-people-inside-white-building-1770808/';
    const pexelsRequest: PexelsRequestDto = new PexelsRequestDto({
      quary: 'people',
      page: 2,
      from: 79,
      amount: 1,
    });
    it('should return "url"', async () => {
      expect(
        (await imageService.findImage(pexelsRequest)).getImage(0).url,
      ).toBe(result);
    });
    it('should return "3"', async () => {
      expect((await imageService.findImage(pexelsRequest)).getNextPage()).toBe(
        3,
      );
    });
  });

  describe('findImage Origrnal, prev page', () => {
    const result: string =
      'https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg';
    const pexelsRequest: PexelsRequestDto = new PexelsRequestDto({
      quary: 'people',
      page: 2,
      from: 5,
      amount: 3,
    });
    it('should return "Origrnal"', async () => {
      expect(
        (await imageService.findImage(pexelsRequest)).getImage(1).src.original,
      ).toBe(result);
    });
    it('should return "1"', async () => {
      expect((await imageService.findImage(pexelsRequest)).getPrevPage()).toBe(
        1,
      );
    });
  });

  describe('findImage query can not be empty', () => {
    const error: string =
      'PexelsRequestDto::setQuary: "quary" can not be empty';

    it('should throw error', () => {
      expect(() => {
        new PexelsRequestDto({
          quary: '',
          page: 2,
          from: 0,
          amount: 1,
        });
      }).toThrow(error);
    });
  });

  describe('findImage page out of range', () => {
    const error: string = `PexelsRequestDto::setPage: "page" must be in 1-${PexelsRequestDto.MAX_IMAGES_COUNT}`;

    it('should throw error', () => {
      expect(() => {
        new PexelsRequestDto({
          quary: 'people',
          page: 100,
          from: 0,
          amount: 1,
        });
      }).toThrow(error);
    });
  });

  describe('findImage from out of range', () => {
    const error: string = `PexelsRequestDto::setFrom: "from" must be in 1-${
      PexelsRequestDto.MAX_IMAGES_COUNT - 1
    }`;

    it('should throw error', () => {
      expect(() => {
        new PexelsRequestDto({
          quary: 'people',
          page: 2,
          from: 80,
          amount: 1,
        });
      }).toThrow(error);
    });
  });

  describe('findImage from out of range', () => {
    const error: string = `PexelsRequestDto::setAmount: from + amount can not be greater then 1-${PexelsRequestDto.MAX_IMAGES_COUNT}`;
    it('should throw error', () => {
      expect(() => {
        new PexelsRequestDto({
          quary: 'people',
          page: 2,
          from: 79,
          amount: 5,
        });
      }).toThrow(error);
    });
  });

  describe('findImage amount out of range', () => {
    const error: string =
      'PexelsRequestDto::setAmount: amount must be positive';
    it('should throw error', () => {
      expect(() => {
        new PexelsRequestDto({
          quary: 'people',
          page: 2,
          from: 79,
          amount: -5,
        });
      }).toThrow(error);
    });
  });
});
