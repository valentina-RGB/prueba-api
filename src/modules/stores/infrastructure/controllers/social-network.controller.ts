import { Controller, Inject, Post, HttpCode, HttpStatus, Body, Get, HttpException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { CreateSocialNetworkDto } from "../../application/dto/social-Network/create-social-network.dto";
import { IStoreServiceToken, IStoreService } from "../../domain/store.services.interfaces";
import { Public } from "src/modules/auth/infrastructure/decorators/public.decorator";

@ApiTags('Stores')
@Controller('social-networks')
export class SocialNetworkController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly socialService: IStoreService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new social network' })
  @ApiResponse({ status: 201, description: 'Social network created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateSocialNetworkDto })
  async create(@Body() socialData: CreateSocialNetworkDto) {
    try {
      const social = await this.socialService.createSocialNetwork(socialData);

      return {
        message: 'Store created successfully',
        social: social,
      };
    } catch (error) {
      this.handleError(error);
    }
  }
  
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all social networks' })
  @ApiResponse({ status: 200, description: 'Social networks fetched successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const social = await this.socialService.findAllSocialNetworks();

      return {
        message: 'social networks fetched successfully',
        social: social,
      };
    } catch (error) {
      this.handleError(error);
    }
  }


private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}