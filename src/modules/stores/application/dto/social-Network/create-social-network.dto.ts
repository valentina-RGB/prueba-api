import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ISocialNetworkCreateDto } from 'src/modules/stores/domain/dto/social-network.interface.dto';

export class CreateSocialNetworkDto implements ISocialNetworkCreateDto {
  @ApiProperty({
    example: 'WhatsApp',
    description: 'Name of the social Network',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'The name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The name must not exceed 50 characters.' })
  name: string;
}
