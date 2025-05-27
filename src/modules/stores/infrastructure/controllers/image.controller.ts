import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IStoreServiceToken,
  IStoreService,
} from '../../domain/store.services.interfaces';
import { GetImageBranchIdDto } from '../../application/dto/images/get-image-branch-id.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { CreateMultipleImagesDto } from '../../application/dto/images/create-image.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.ADMIN_BRANCH, Role.ADMIN_STORE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new images' })
  @ApiResponse({ status: 201, description: 'Images created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() imageData: CreateMultipleImagesDto) {
    try {
      const image = await this.storeService.createImages(imageData);
      return image;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get images by branch ID' })
  @ApiResponse({
    status: 200,
    description: 'Images by branch ID fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getImagesByBranchId(@Param('branchId') branchId: number) {
    try {
      const images = await this.storeService.GetImageByBranchId(branchId);
      if (!images || images.length === 0) {
        return [];
      }
      return new GetImageBranchIdDto(images).toResponse();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteImage(@Param('id') id: number) {
    try {
      const response = await this.storeService.deleteImage(id);
      if (response) {
        return {
          message: 'Image deleted successfully',
        };
      }
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
