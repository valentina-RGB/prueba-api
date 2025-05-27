import { StampResponseDto } from '../stamp/stamp-response.dto';

export class GetPageStampsResponseDto {
  pageId: number;
  stamps: StampResponseDto[];

  constructor(pageStampsEntities: any[]) {
    this.pageId = pageStampsEntities[0].page.id;
    this.stamps = pageStampsEntities.map(
      (pageStamp) => new StampResponseDto(pageStamp.stamp),
    );
  }
}
