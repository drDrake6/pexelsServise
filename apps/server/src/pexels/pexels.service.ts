import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import PexelsResponseDto, { PexelsImage } from '../dto/pexels.response.dto';
import PexelsRequestDto from '../dto/pexels.request.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PexelsService {
  private cacheManager: Cache;
  private readonly auth_token: string;
  private static readonly BASE_URL: string = 'https://api.pexels.com/v1/search';

  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    configService: ConfigService,
  ) {
    this.cacheManager = cacheManager;
    this.auth_token = configService.get<string>('auth_token')!;
  }

  private async sendRequest(quary: string, page: number): Promise<Response> {
    return await fetch(
      PexelsService.BASE_URL +
        `?query=${quary}&page=${page}&per_page=${PexelsRequestDto.MAX_IMAGES_COUNT}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: this.auth_token, //'a7A5NN0NDGt24x2HdyTRyFeSLNoxCyvRr70BOk1isi7CMLLouucenEQT',
        }),
      },
    );
  }

  public async findImage(
    pexelsRequest: PexelsRequestDto,
  ): Promise<PexelsResponseDto> {
    let res: any;
    const key: string = `${pexelsRequest.getQuary()}_${pexelsRequest.getPage()}`;
    const casheRes: string = (await this.cacheManager.get(key))!;
    if (casheRes != null) {
      console.log('from cache'); //debug
      res = JSON.parse(casheRes);
    } else {
      const response: Response = await this.sendRequest(
        pexelsRequest.getQuary(),
        pexelsRequest.getPage(),
      );
      if (response.ok) {
        console.log('from api'); //debug
        res = await response.json();
        this.cacheManager.set(key, JSON.stringify(res));
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    }

    const pexelDto: PexelsResponseDto = new PexelsResponseDto();
    pexelDto.setTotalResults(res.total_results);
    if (res.prev_page != undefined)
      pexelDto.setPrevPage(
        Number.parseInt(new URL(res.prev_page).searchParams.get('page')!),
      );
    if (res.next_page != undefined)
      pexelDto.setNextPage(
        Number.parseInt(new URL(res.next_page).searchParams.get('page')!),
      );
    for (
      let i: number = pexelsRequest.getFrom();
      i < pexelsRequest.getFrom() + pexelsRequest.getAmount();
      ++i
    ) {
      pexelDto.addImage(new PexelsImage(res.photos[i]));
    }

    return pexelDto;

    //const body: Uint8Array | undefined = (await response.body?.getReader().read())?.value;
    //return body != undefined ? new TextDecoder().decode(body) : "";
  }
}
