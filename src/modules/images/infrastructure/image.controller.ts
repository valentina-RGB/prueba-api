import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  ImageServiceInterface,
  ImagenServiceToken,
} from '../domain/image.service.interface';
import { UploadImageDto } from '../application/dto/upload-image.dto';
import { ImageUploadResponseDto } from '../application/dto/response.image.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';


@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    @Inject(ImagenServiceToken)
    private readonly imageService: ImageServiceInterface,
  ) {}

  @Public()
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload an image',
    description: 'Endpoint to upload images to Cloudinary storage',
  })
  @ApiBody({
    description: 'Image file (JPG, PNG, GIF) up to 10MB',
    type: UploadImageDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        url: 'https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg',
        publicId: 'sample.jpg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - No file provided or invalid file type',
    schema: {
      example: {
        statusCode: 400,
        message: 'No file uploaded',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No files selected');
    }
    try {
      const result = await this.imageService.uploadImage(file);

      return {
        message:'Image uploaded successfully',
        image: new ImageUploadResponseDto(result)
      };
    } catch (error) {
      this.handleError(error)
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
