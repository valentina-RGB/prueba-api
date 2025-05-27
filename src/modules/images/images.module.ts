import { Module } from '@nestjs/common';
import { ImagesController } from './infrastructure/image.controller';
import { RouterModule } from '@nestjs/core';
import { MailerModule } from '../mailer/mailer.module';
import { ImagenServiceToken } from './domain/image.service.interface';
import { ImageService } from './application/image.service';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';

@Module({
  imports: [
    MailerModule,
    RouterModule.register([
      {
        path: 'api/v2',
        module: ImagenModule,
      },
    ]),
  ],
  controllers: [ImagesController],
  providers: [
    {
      provide: ImagenServiceToken,
      useClass: ImageService,
    },
    UploadImageUseCase,
  ],
  exports: [ImagenServiceToken],
})
export class ImagenModule {}
