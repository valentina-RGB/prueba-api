import { GetAttributeByIdUseCase } from 'src/modules/stores/application/use-cases/attributes/get-attribute-by-id.use-case';
import { IAttributeRepository } from 'src/modules/stores/domain/repositories/attributes.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('GetAttributeByIdUseCase', () => {
  let useCase: GetAttributeByIdUseCase;
  let repository: jest.Mocked<IAttributeRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IAttributeRepository>;

    useCase = new GetAttributeByIdUseCase(repository);
  });

  it('should return the attribute if found', async () => {
    const attributeId = 1;
    const mockAttribute = {
      id: attributeId,
      name: 'Attribute name',
      description: 'Attribute description',
      requires_response: true,
      status: true,
    };

    repository.findById.mockResolvedValue(mockAttribute);

    const result = await useCase.execute(attributeId);

    expect(repository.findById).toHaveBeenCalledWith(attributeId);
    expect(result).toEqual(mockAttribute);
  });

  it('should throw NotFoundException if attribute is not found', async () => {
    const attributeId = 999;

    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute(attributeId)).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.findById).toHaveBeenCalledWith(attributeId);
  });
});
