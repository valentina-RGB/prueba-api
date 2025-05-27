import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { IUploadImageDTO } from '../../domain/dto/imagen.interface.dto';
import { cloudinaryInstance } from 'src/config/cloudinary-config';

@Injectable()
export class UploadImageUseCase implements IUseCase<IUploadImageDTO, UploadApiResponse> {
  private readonly validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  async execute(input: IUploadImageDTO): Promise<UploadApiResponse> {

    if (!this.validMimeTypes.includes(input.file.mimetype)) {
      throw new BadRequestException('Invalid image type. Please upload a JPEG, PNG, or GIF.');
    }
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinaryInstance.uploader.upload_stream(
        {
          folder: 'images-coffee',
          public_id: `${input.file.originalname || 'file'}`,
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) {
            return reject(new InternalServerErrorException(`Cloudinary error: ${error.message}`)); 
          }
          if (!result) {
            return reject(new InternalServerErrorException('Upload result is undefined.'));;
          }
          resolve(result);
        }
      );
      uploadStream.end(input.file.buffer);
    });
  }
}