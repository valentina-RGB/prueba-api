import { UploadApiResponse } from 'cloudinary';

export interface ImageServiceInterface {
  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>;
}

export const ImagenServiceToken = Symbol('ImageServiceInterface');
