import { OpenOrCloseBranchUseCase } from 'src/modules/stores/application/use-cases/branches/open-or-close-branch.use-case';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { IBranchesRepository } from 'src/modules/stores/domain/repositories/branches.repository.interface';
import { IBranches } from 'src/modules/stores/domain/models/branches.interface';

describe('OpenOrCloseBranchUseCase', () => {
  let useCase: OpenOrCloseBranchUseCase;
  let mockBranchRepository: jest.Mocked<IBranchesRepository>;

  const mockStore = {
    id: 1,
    name: 'Tienda Test',
    type_document: 'NIT',
    number_document: '765455559-3',
    logo: 'logo.png',
    phone_number: '987654321',
    email: 'example@gmail.com',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fakeBranch: IBranches = {
    id: 1,
    store: mockStore,
    name: 'Sucursal Centro',
    phone_number: '123456789',
    latitude: 0,
    longitude: 0,
    address: 'Calle Falsa 123',
    average_rating: 4.5,
    status: 'APPROVED',
    is_open: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockBranchRepository = {
      findById: jest.fn(),
      openOrCloseBranch: jest.fn(),
    } as any;

    useCase = new OpenOrCloseBranchUseCase(mockBranchRepository);
  });

  it('debería lanzar NotFoundException si la sucursal no existe', async () => {
    mockBranchRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 1, status: true })).rejects.toThrow(NotFoundException);
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
  });

  it('debería lanzar ConflictException si la sucursal ya está en ese estado', async () => {
    mockBranchRepository.findById.mockResolvedValue({ ...fakeBranch, is_open: false });

    await expect(useCase.execute({ id: 1, status: false })).rejects.toThrow(ConflictException);
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
  });

  it('debería actualizar correctamente el estado de is_open', async () => {
    mockBranchRepository.findById.mockResolvedValue({ ...fakeBranch, is_open: false });
    mockBranchRepository.openOrCloseBranch.mockImplementation(async (branch) => branch);

    const result = await useCase.execute({ id: 1, status: true });

    expect(result.is_open).toBe(true);
    expect(mockBranchRepository.findById).toHaveBeenCalledWith(1);
    expect(mockBranchRepository.openOrCloseBranch).toHaveBeenCalledWith({
      ...fakeBranch,
      is_open: true,
    });
  });
});
