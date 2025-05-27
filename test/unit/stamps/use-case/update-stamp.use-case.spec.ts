import { UpdateStampDto } from 'src/modules/albums/application/dto/stamp/update-stamp.dto';
import { UpdateStampUseCase } from 'src/modules/albums/application/use-cases/stamp/update-stamp.use-case';
import { IStampRepository } from 'src/modules/albums/domain/repositories/stamp.repository.interface';

describe('UpdateStampUseCase', () => {
  let useCase: UpdateStampUseCase;
  let stampRepository: jest.Mocked<IStampRepository>;

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

  const mockBranch = {
    id: 1,
    name: 'Sucursal Nueva',
    address: 'Calle 123',
    status: 'APPROVED',
    latitude: 0,
    longitude: 0,
    average_rating: 0,
    phone_number: '000',
    is_open: true,
    store: mockStore,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    stampRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<IStampRepository>;

    useCase = new UpdateStampUseCase(stampRepository);
  });

  it('should update a stamp successfully', async () => {
    const stampId = 1;
    const updateData: UpdateStampDto = {
      branch: mockBranch,
      logo: mockBranch.store.logo,
      name: 'Updated Stamp',
      description: 'Updated description',
      coffeecoins_value: 10,
      status: true,
    };

    const existingStamp = {
      id: stampId,
      branch: mockBranch,
      logo: mockBranch.store.logo,
      name: 'Old Stamp',
      description: 'Old description',
      coffeecoins_value: 10,
      status: true,
    };

    const updatedStamp = {
      ...existingStamp,
      ...updateData,
    };

    stampRepository.findById.mockResolvedValue(existingStamp);
    stampRepository.update.mockResolvedValue(updatedStamp);

    const result = await useCase.execute({ id: stampId, data: updateData });

    expect(stampRepository.findById).toHaveBeenCalledWith(stampId);
    expect(stampRepository.update).toHaveBeenCalledWith(stampId, updateData);
    expect(result).toEqual(updatedStamp);
  });

  it('should throw an error if stamp is not found', async () => {
    const stampId = 999;
    const updateData: UpdateStampDto = {
      name: 'Any Name',
      description: 'Any Description',
    };

    stampRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: stampId, data: updateData }),
    ).rejects.toThrow('Stamp not found');

    expect(stampRepository.findById).toHaveBeenCalledWith(stampId);
    expect(stampRepository.update).not.toHaveBeenCalled();
  });
});
