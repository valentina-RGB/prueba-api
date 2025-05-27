import { ApiProperty } from "@nestjs/swagger";
import { StampResponseDto } from "./stamp-response.dto";

export class ListStampsDto {
  @ApiProperty({ type: [StampResponseDto], description: 'List of stamps' })
  stamps: StampResponseDto[]; 

  constructor(stamps: any[]) {
    this.stamps = stamps.map((stamp) => new StampResponseDto(stamp)); 
  }
}
