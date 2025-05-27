import { Test, TestingModule } from '@nestjs/testing';
import { UploadImageUseCase } from 'src/modules/images/application/use-cases/upload-image.use-case';
import { IUploadImageDTO } from 'src/modules/images/domain/dto/imagen.interface.dto';
import { UploadApiResponse, UploadApiErrorResponse, UploadApiOptions, UploadResponseCallback } from 'cloudinary';
import { Readable } from 'stream';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary', () => {
  const mockUploadStream = {
    end: jest.fn(),
    on: jest.fn(),
    write: jest.fn(),
  };

  return {
    v2: {
      config: jest.fn(),
      uploader: {
        upload_stream: jest.fn((options: UploadApiOptions, callback: UploadResponseCallback) => {
          callback(undefined, mockUploadApiResponse);
          return mockUploadStream;
        }),
      },
    },
  };
});

const mockUploadApiResponse: UploadApiResponse = {
  public_id: 'images-coffee/test-image',
  secure_url: 'https://res.cloudinary.com/demo/image/upload/v12345/test-image.jpg',
  bytes: 1024,
  width: 800,
  height: 600,
  format: 'jpg',
  resource_type: 'image',
  created_at: new Date().toISOString(),
  tags: [],
  type: 'upload',
  etag: 'mock-etag',
  placeholder: false,
  url: 'https://res.cloudinary.com/demo/image/upload/v12345/test-image.jpg',
  access_mode: 'public',
  original_filename: 'test-image.jpg',
  version: 12345,
  signature: 'mock-signature',
  api_key: 'mock-api-key',
  asset_id: 'mock-asset-id',
  pages: 1,
  moderation: [],
  context: [],
  metadata: {},
  access_control: [],
};

describe('UploadImageUseCase', () => {
  let uploadImageUseCase: UploadImageUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadImageUseCase],
    }).compile();

    uploadImageUseCase = module.get<UploadImageUseCase>(UploadImageUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload an image successfully', async () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test-image.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test-image-content'),
      stream: new Readable({
        read() {
          this.push(Buffer.from('test-image-content'));
          this.push(null);
        }
      }),
      destination: '',
      filename: '',
      path: '',
    };

    const result = await uploadImageUseCase.execute({ file: mockFile });

    expect(result).toEqual(mockUploadApiResponse);
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      {
        folder: 'images-coffee',
        public_id: 'test-image.jpg',
      },
      expect.any(Function)
    );
  });

  it('should throw BadRequestException for invalid image type', async () => {
    const mockFile = createMockFile({ mimetype: 'text/plain' });

    await expect(uploadImageUseCase.execute({ file: mockFile }))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException for Cloudinary upload error', async () => {
    const mockFile = createMockFile();

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementationOnce(
      (options: UploadApiOptions, callback: (error?: UploadApiErrorResponse, result?: UploadApiResponse) => void) => {
        callback(
          { message: 'Upload failed', name: 'CloudinaryError', http_code: 500 } as UploadApiErrorResponse,
          undefined,
        );

        return {
          end: jest.fn(),
          on: jest.fn(),
          write: jest.fn(),
        };
      },
    );

    await expect(uploadImageUseCase.execute({ file: mockFile }))
      .rejects
      .toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when upload result is undefined', async () => {
    const mockFile = createMockFile();
  
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementationOnce(
      (options: UploadApiOptions, callback: (error?: UploadApiErrorResponse, result?: UploadApiResponse) => void) => {
        callback(undefined, undefined); 
        return {
          end: jest.fn(),
          on: jest.fn(),
          write: jest.fn(),
        };
      },
    );
  
    await expect(uploadImageUseCase.execute({ file: mockFile }))
      .rejects
      .toThrow(InternalServerErrorException);
  });
  

  it('should use default value for public_id when originalname is undefined', async () => {
    const mockFile = createMockFile({ originalname: undefined }); 
  
    const result = await uploadImageUseCase.execute({ file: mockFile });
  
    expect(result).toEqual(mockUploadApiResponse);
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      {
        folder: 'images-coffee',
        public_id: 'file', 
      },
      expect.any(Function)
    );
  });
  
});

function createMockFile(overrides?: Partial<Express.Multer.File>): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test-image-content'),
    stream: new Readable({
      read() {
        this.push(Buffer.from('test-image-content'));
        this.push(null);
      },
    }),
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  };
}
