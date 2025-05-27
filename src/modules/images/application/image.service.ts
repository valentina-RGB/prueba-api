import { Injectable } from '@nestjs/common';
import { ImageServiceInterface } from '../domain/image.service.interface';
import { UploadImageUseCase } from './use-cases/upload-image.use-case';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ImageService implements ImageServiceInterface {
  constructor(
    private readonly uploadUseCase: UploadImageUseCase,
    
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return this.uploadUseCase.execute({ file });
  }

}