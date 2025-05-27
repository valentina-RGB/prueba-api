import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { IcreateEventClientDto } from "src/modules/events/domain/dto/events-clients.interface.dto";

export class CreateEventClientDto implements IcreateEventClientDto {
    @ApiProperty({
        example: 1,
        description: 'ID of the event',
    })
    @IsNumber()
    @IsNotEmpty()
    event_id: number;
   
}