export default class PexelsRequestDto {
  constructor({
    quary,
    page,
    from,
    amount,
  }: {
    quary: string;
    page: number;
    from: number;
    amount: number;
  }) {
    this.setQuary(quary);
    this.setPage(page);
    this.setFromAndAmount(from, amount);
  }
  private quary: string;
  private page: number;
  private from: number;
  private amount: number;
  public static readonly MAX_IMAGES_COUNT: number = 80;
  public static readonly MIN_IMAGES_COUNT: number = 1;

  public setQuary(quary: string): void {
    if (quary == null)
      throw new Error('PexelsRequestDto::setQuary: "quary" can not be null');
    if (quary.length == 0)
      throw new Error('PexelsRequestDto::setQuary: "quary" can not be empty');

    this.quary = quary;
  }

  public getQuary(): string {
    return this.quary;
  }

  public setPage(page: number): void {
    if (page == null)
      throw new Error('PexelsRequestDto::setPage: "page" can not be null');
    if (
      page < PexelsRequestDto.MIN_IMAGES_COUNT ||
      page >= PexelsRequestDto.MAX_IMAGES_COUNT
    )
      throw new Error(
        `PexelsRequestDto::setPage: "page" must be in ${PexelsRequestDto.MIN_IMAGES_COUNT}-${PexelsRequestDto.MAX_IMAGES_COUNT}`,
      );

    this.page = page;
  }

  public getPage(): number {
    return this.page;
  }

  private setFrom(from: number): void {
    if (from == null)
      throw new Error('PexelsRequestDto::setFrom: "from" can not be null');
    if (from < 0 || from >= PexelsRequestDto.MAX_IMAGES_COUNT)
      throw new Error(
        `PexelsRequestDto::setFrom: "from" must be in ${
          PexelsRequestDto.MIN_IMAGES_COUNT
        }-${PexelsRequestDto.MAX_IMAGES_COUNT - 1}`,
      );

    this.from = from;
  }

  public getFrom(): number {
    return this.from;
  }

  private setAmount(amount: number): void {
    if (amount == null)
      throw new Error('PexelsRequestDto::setAmount: amount can not be null');
    if (amount <= 0)
      throw new Error('PexelsRequestDto::setAmount: amount must be positive');
    if (
      this.from + amount < PexelsRequestDto.MIN_IMAGES_COUNT ||
      this.from + amount > PexelsRequestDto.MAX_IMAGES_COUNT
    )
      throw new Error(
        `PexelsRequestDto::setAmount: from + amount can not be greater then ${PexelsRequestDto.MIN_IMAGES_COUNT}-${PexelsRequestDto.MAX_IMAGES_COUNT}`,
      );

    this.amount = amount;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setFromAndAmount(from: number, amount: number) {
    this.setFrom(from);
    this.setAmount(amount);
  }
}
