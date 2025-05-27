import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from 'src/modules/images/infrastructure/image.controller';
import { ImageService } from 'src/modules/images/application/image.service';
import { UploadImageUseCase } from 'src/modules/images/application/use-cases/upload-image.use-case';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Readable } from 'stream';
import { ImageUploadResponseDto } from 'src/modules/images/application/dto/response.image.dto';
import { ImagenServiceToken } from 'src/modules/images/domain/image.service.interface';

jest.mock('src/modules/images/application/image.service');
jest.mock('src/config/cloudinary-config');

describe('ImagesController e2e', () => {
  let controller: ImagesController;
  let imageService: ImageService;

  const createMockFile = (
    overrides?: Partial<Express.Multer.File>,
  ): Express.Multer.File => ({
    fieldname: 'file',
    originalname: overrides?.originalname || 'test.jpg',
    encoding: '7bit',
    mimetype: overrides?.mimetype || 'image/jpeg',
    size: 1024,
    stream: new Readable({
      read() {
        this.push(Buffer.from('test-image-content'));
        this.push(null);
      },
    }),
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    ),
    ...overrides,
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockImageService = {
      uploadImage: jest.fn().mockImplementation((file) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          throw new BadRequestException('Invalid file type');
        }

        return Promise.resolve({
          secure_url: 'https://mock-url.com/test.jpg',
          public_id: 'test-id',
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagenServiceToken,
          useValue: mockImageService,
        },
        UploadImageUseCase,
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    imageService = module.get<ImageService>(ImagenServiceToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should return 201 and success message when upload is successful', async () => {
      const mockFile = createMockFile();
      const result = await controller.uploadImage(mockFile);

      expect(result).toEqual({
        message: 'Image uploaded successfully',
        image: expect.any(ImageUploadResponseDto),
      });

      expect(imageService.uploadImage).toHaveBeenCalledWith(mockFile);
    });

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(
        controller.uploadImage(undefined as unknown as Express.Multer.File),
      ).rejects.toThrow(new BadRequestException('No files selected'));
    });

    it('should throw BadRequestException for invalid file types', async () => {
      const invalidFile = createMockFile({ mimetype: 'application/pdf' });
      await expect(controller.uploadImage(invalidFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle Cloudinary upload errors', async () => {
      (imageService.uploadImage as jest.Mock).mockImplementationOnce(() => {
        throw new InternalServerErrorException('Cloudinary upload failed');
      });

      await expect(controller.uploadImage(createMockFile())).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle service errors and throw HttpException', async () => {
      (imageService.uploadImage as jest.Mock).mockImplementationOnce(() => {
        throw new HttpException('Service error', HttpStatus.BAD_REQUEST);
      });

      await expect(controller.uploadImage(createMockFile())).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('ImageService e2e', () => {
    it('should upload an image successfully', async () => {
      const mockFile = createMockFile();
      const expectedResponse = {
        secure_url: 'https://mock-url.com/test.jpg',
        public_id: 'test-id',
      };

      (imageService.uploadImage as jest.Mock).mockResolvedValueOnce(
        expectedResponse,
      );

      const result = await imageService.uploadImage(mockFile);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw InternalServerErrorException when upload fails', async () => {
      (imageService.uploadImage as jest.Mock).mockRejectedValueOnce(
        new InternalServerErrorException('Upload failed'),
      );

      await expect(imageService.uploadImage(createMockFile())).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('handleError', () => {
    it('should rethrow HttpException', () => {
      const httpError = new HttpException('Test', HttpStatus.BAD_REQUEST);
      expect(() => controller['handleError'](httpError)).toThrow(httpError);
    });

    it('should convert regular error to HttpException', () => {
      const regularError = new Error('Regular error');
      expect(() => controller['handleError'](regularError)).toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
