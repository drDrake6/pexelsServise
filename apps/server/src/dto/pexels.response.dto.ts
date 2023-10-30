export default class PexelsResponseDto {
  private images: Array<PexelsImage> = [];
  private total_results: number;
  private prev_page?: number;
  private next_page?: number;

  public addImage(pexelsImage: PexelsImage): void {
    if (pexelsImage == null)
      throw new Error(
        'PexelsResponseDto::addImage: "pexelsImage" can not be null',
      );
    this.images.push(pexelsImage);
  }

  public getImage(index: number): PexelsImage {
    if (this.images.length == 0)
      throw new Error('PexelsResponseDto::getImage: there are no images');
    if (index == null)
      throw new Error('PexelsResponseDto::getImage: "index" can not be null');
    if (index < 0 || index >= this.images.length)
      throw new Error('PexelsResponseDto::getImage: index out of range');
    return this.images[index];
  }

  public getArrayImages(): Array<PexelsImage> {
    return this.images.slice();
  }

  public setTotalResults(total: number): void {
    if (total == null)
      throw new Error(
        'PexelsResponseDto::setTotalResults: "total" can not be null',
      );
    if (total < 0)
      throw new Error(
        'PexelsResponseDto::setTotalResults: total value can not be negative',
      );
    this.total_results = total;
  }

  public getTotalResults(): number {
    return this.total_results;
  }

  public setPrevPage(prev: number): void {
    if (prev == null)
      throw new Error('PexelsResponseDto::setPrevPage: "prev" can not be null');
    if (prev < 0)
      throw new Error(
        'PexelsResponseDto::setPrevPage: prev value can not be negative',
      );
    this.prev_page = prev;
  }

  public getPrevPage(): number {
    if (this.prev_page == undefined)
      throw new Error(
        "PexelsResponseDto::getPrevPage: prev page doesn't exists",
      );
    return this.prev_page;
  }

  public setNextPage(next: number): void {
    if (next == null)
      throw new Error('PexelsResponseDto::setNextPage: "next" can not be null');
    if (next < 0)
      throw new Error(
        'PexelsResponseDto::setNextPage: next value can not be negative',
      );
    this.next_page = next;
  }

  public getNextPage(): number {
    if (this.next_page == undefined)
      throw new Error(
        "PexelsResponseDto::getNextPage: next page doesn't exists",
      );
    return this.next_page;
  }
}

export class PexelsImage {
  constructor(raw: any) {
    if (raw.id != undefined) this.id = raw.id;
    if (raw.width != null) this.width = raw.width;
    if (raw.height != null) this.height = raw.height;
    if (raw.url != null) this.url = raw.url;
    if (raw.alt != null) this.alt = raw.alt;
    if (raw.src != null) {
      this.src = new ImageSrc(raw.src);
    }
  }
  public id: number;
  public width: number;
  public height: number;
  public url: string;
  public src: ImageSrc;
  public alt: string;
}

export class ImageSrc {
  constructor(raw: any) {
    if (raw.original != null) this.original = raw.original;
    if (raw.large2x != null) this.large2x = raw.large2x;
    if (raw.large != null) this.large = raw.large;
    if (raw.medium != null) this.medium = raw.medium;
    if (raw.small != null) this.small = raw.small;
    if (raw.portrait != null) this.portrait = raw.portrait;
    if (raw.landscape != null) this.landscape = raw.landscape;
    if (raw.tiny != null) this.tiny = raw.tiny;
  }
  public original: string;
  public large2x: string;
  public large: string;
  public medium: string;
  public small: string;
  public portrait: string;
  public landscape: string;
  public tiny: string;
}
