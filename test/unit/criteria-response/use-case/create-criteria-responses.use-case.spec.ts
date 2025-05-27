import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  ICriteriaResponseRepository,
  ICriteriaResponseRepositoryToken,
} from 'src/modules/stores/domain/repositories/criteria-response.repository.interface';
import { CreateCriteriaResponseDto } from 'src/modules/stores/application/dto/criteria-response/create-criteria-response.dto';
import { CreateCriteriaResponsesUseCase } from 'src/modules/stores/application/use-cases/criteria-response/create-criteria-responses.use-case';
import { GetCriteriaUseCase } from 'src/modules/stores/application/use-cases/criteria/get-criteria-by-id.use-case';

describe('CreateCriteriaResponsesUseCase', () => {
  let useCase: CreateCriteriaResponsesUseCase;
  let criteriaResponseRepoMock: jest.Mocked<ICriteriaResponseRepository>;
  let getCriteriaUseCaseMock: { execute: jest.Mock };

  const testDate = new Date('2025-04-10T21:29:55.588Z');
  const responseDate = new Date('2025-04-10T21:29:55.633Z');

  const mockStore = {
    id: 1,
    name: 'Test Store',
    type_document: 'NIT',
    number_document: '900123456',
    logo: 'test-logo.png',
    phone_number: '3011234567',
    email: 'store@example.com',
    status: 'APPROVED',
  };

  const branchMock = {
    id: 2,
    store: mockStore,
    name: 'Duplicate Branch',
    phone_number: '3001234567',
    latitude: 10.12345,
    longitude: -75.6789,
    address: '123 Main Street',
    average_rating: 4.5,
    is_open: true,
    status: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCriteria1 = {
    id: 1,
    name: 'Criteria 1',
    description: 'Description 1',
    active: true,
    requires_image: true,
    createdAt: testDate,
    updatedAt: testDate,
  };

  const mockCriteria2 = {
    id: 2,
    name: 'Criteria 2',
    description: 'Description 2',
    active: true,
    requires_image: false,
    createdAt: testDate,
    updatedAt: testDate,
  };

  const mockApproval = {
    id: 1,
    branch: branchMock,
    status: 'PENDING',
    approval_date: testDate,
    updatedAt: testDate,
    criteria_responses: [],
    approved_by: null,
  };

  beforeEach(async () => {
    criteriaResponseRepoMock = {
      createMany: jest.fn(),
    };
    getCriteriaUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCriteriaResponsesUseCase,
        {
          provide: ICriteriaResponseRepositoryToken,
          useValue: criteriaResponseRepoMock,
        },
        {
          provide: GetCriteriaUseCase,
          useValue: getCriteriaUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateCriteriaResponsesUseCase>(
      CreateCriteriaResponsesUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create multiple criteria responses successfully', async () => {
      const criteriaResponseData = [
        {
          criteriaId: 1,
          response_text: 'Response 1',
          image_url: 'http://example.com/image1.jpg',
          status: 'PENDING',
        },
        {
          criteriaId: 2,
          response_text: 'Response 2',
          image_url: '',
          status: 'PENDING',
        },
      ];

      const expectedResponses = [
        {
          id: 1,
          criteria: mockCriteria1,
          approval: mockApproval,
          response_text: 'Response 1',
          image_url: 'http://example.com/image1.jpg',
          status: true,
          createdAt: testDate,
          updatedAt: testDate,
        },
        {
          id: 1,
          criteria: mockCriteria2,
          approval: mockApproval,
          response_text: 'Response 2',
          image_url: '',
          status: true,
          createdAt: testDate,
          updatedAt: testDate,
        },
      ];

      getCriteriaUseCaseMock.execute
        .mockResolvedValueOnce(mockCriteria1)
        .mockResolvedValueOnce(mockCriteria2);

      criteriaResponseRepoMock.createMany.mockResolvedValue(expectedResponses);

      const result = await useCase.execute({
        criteriaResponseData,
        approval: mockApproval,
      });

      expect(getCriteriaUseCaseMock.execute).toHaveBeenCalledTimes(2);
      expect(getCriteriaUseCaseMock.execute).toHaveBeenNthCalledWith(1, 1);
      expect(getCriteriaUseCaseMock.execute).toHaveBeenNthCalledWith(2, 2);

      expect(result).toEqual(expectedResponses);
    });

    it('should throw NotFoundException when a criteria is not found', async () => {
      const criteriaResponseData: CreateCriteriaResponseDto[] = [
        {
          criteriaId: 1,
          response_text: 'Response 1',
          image_url: 'http://example.com/image1.jpg',
        },
        {
          criteriaId: 999,
          response_text: 'Response 2',
          image_url: '',
        },
      ];

      getCriteriaUseCaseMock.execute
        .mockResolvedValueOnce(mockCriteria1)
        .mockResolvedValueOnce(null);

      await expect(
        useCase.execute({
          criteriaResponseData,
          approval: mockApproval,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(getCriteriaUseCaseMock.execute).toHaveBeenCalledTimes(2);
      expect(getCriteriaUseCaseMock.execute).toHaveBeenNthCalledWith(1, 1);
      expect(getCriteriaUseCaseMock.execute).toHaveBeenNthCalledWith(2, 999);

      expect(criteriaResponseRepoMock.createMany).not.toHaveBeenCalled();
    });

    it('should handle empty criteria response data array', async () => {
      const criteriaResponseData: CreateCriteriaResponseDto[] = [];

      criteriaResponseRepoMock.createMany.mockResolvedValue([]);

      const result = await useCase.execute({
        criteriaResponseData,
        approval: mockApproval,
      });

      expect(getCriteriaUseCaseMock.execute).not.toHaveBeenCalled();
      expect(criteriaResponseRepoMock.createMany).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });
  });
});
