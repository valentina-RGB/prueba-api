import { Test, TestingModule } from '@nestjs/testing';
import { ApproveOrRejectStoreUseCase } from 'src/modules/stores/application/use-cases/stores/approve-or-reject-store.use-case';
import { StoreRepository } from 'src/modules/stores/infrastructure/repositories/store.repository';
import { IStoreRepositoryToken } from 'src/modules/stores/domain/repositories/store.repository.interface';
import { SendStoreApprovedEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-approved.use-case';
import { SendStoreRejectionEmailUseCase } from 'src/modules/mailer/application/use-cases/send-branch-rejection.use-case';
import { NotFoundException } from '@nestjs/common';

describe('ApproveOrRejectStoreUseCase', () => {
  let useCase: ApproveOrRejectStoreUseCase;
  let storeRepository: jest.Mocked<StoreRepository>;
  // let sendWelcomeEmail: jest.Mocked<SendStoreApprovedEmailUseCase>;
  // let sendRejectionEmail: jest.Mocked<SendStoreRejectionEmailUseCase>;

  const mockStore = {
    id: 1,
    name: 'Test Store',
    status: 'PENDING',
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApproveOrRejectStoreUseCase,
        {
          provide: IStoreRepositoryToken,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: SendStoreApprovedEmailUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: SendStoreRejectionEmailUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(ApproveOrRejectStoreUseCase);
    storeRepository = module.get(IStoreRepositoryToken);
    // sendWelcomeEmail = module.get(SendStoreApprovedEmailUseCase);
    // sendRejectionEmail = module.get(SendStoreRejectionEmailUseCase);
  });

  it('should approve a store', async () => {
    storeRepository.findById.mockResolvedValue({ ...mockStore });
    storeRepository.update.mockResolvedValue({
      ...mockStore,
      status: 'APPROVED',
    });
    // sendWelcomeEmail.execute.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: 1, data: true });

    expect(storeRepository.findById).toHaveBeenCalledWith(1);
    expect(storeRepository.update).toHaveBeenCalledWith(1, {
      ...mockStore,
      status: 'APPROVED',
    });
    // expect(sendWelcomeEmail.execute).toHaveBeenCalledWith({
    //   ...mockStore,
    //   status: 'APPROVED',
    // });
    expect(result).toEqual({
      ...mockStore,
      status: 'APPROVED',
    });
  });

  it('should reject a store and send rejection email', async () => {
    storeRepository.findById.mockResolvedValue({ ...mockStore });
    storeRepository.update.mockResolvedValue({
      ...mockStore,
      status: 'REJECTED',
    });
    // sendRejectionEmail.execute.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: 1,
      data: false,
      reason: 'No cumple requisitos',
    });

    expect(storeRepository.findById).toHaveBeenCalledWith(1);
    expect(storeRepository.update).toHaveBeenCalledWith(1, {
      ...mockStore,
      status: 'REJECTED',
    });
    // expect(sendRejectionEmail.execute).toHaveBeenCalledWith(
    //   { ...mockStore, status: 'REJECTED' },
    //   'No cumple requisitos',
    // );
    expect(result).toEqual({
      ...mockStore,
      status: 'REJECTED',
    });
  });

  it('should throw NotFoundException if store not found', async () => {
    storeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 99, data: true })).rejects.toThrow(
      NotFoundException,
    );
  });
});
