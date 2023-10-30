import { Controller, Get } from '@nestjs/common';
import { PexelsService } from './pexels.service';
import PexelsResponseDto from 'src/dto/pexels.response.dto';
import PexelsRequestDto from '../dto/pexels.request.dto';

@Controller('image')
export class PexelsController {
  constructor(private readonly imageService: PexelsService) {}
  @Get()
  async getImage(): Promise<PexelsResponseDto | undefined> {
    const pexelsRequest: PexelsRequestDto = new PexelsRequestDto({
      quary: 'people',
      page: 2,
      from: 0,
      amount: 15,
    });
    return this.imageService.findImage(pexelsRequest)!;
  }
}
