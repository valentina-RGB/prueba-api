import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { IRecommendationCreateDto } from "src/modules/stores/domain/dto/recommendation.interface.dto";

export class CreateRecommendationDto implements IRecommendationCreateDto{
    @ApiProperty({ example: 1, description: 'message for the recommendation' })
    @IsString()
    @IsNotEmpty()
    @Length(5,150)
    message: string;

    @ApiProperty({ example: 1, description: 'branch id' })
    @IsNumber()
    @IsNotEmpty()
    branch_id: number;
}