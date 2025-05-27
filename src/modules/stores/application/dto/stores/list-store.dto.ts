import { ApiProperty } from "@nestjs/swagger";
import { StoreRenponseDto } from "./store-response.dto";


export class ListStoreDto {
  @ApiProperty({ type: [StoreRenponseDto], description: 'List of store' })
  stores: StoreRenponseDto[];
  constructor(store: any[]) {
    this.stores = store.map((store) => new StoreRenponseDto(store));
  }
}
