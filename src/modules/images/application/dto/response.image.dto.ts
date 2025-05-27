import { UploadApiResponse } from 'cloudinary';

export class ImageUploadResponseDto {
  url: string;
  publicId: string;

  constructor(result: any) {
    this.url=result.secure_url;
    this.publicId=result.public_id;
  }
}
