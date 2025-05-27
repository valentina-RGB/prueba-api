import { ListAttributesUseCase } from 'src/modules/stores/application/use-cases/attributes/list-attributes.use-case';
import { IAttributeRepository } from 'src/modules/stores/domain/repositories/attributes.repository.interface';
import { IAttribute } from 'src/modules/stores/domain/models/attributes.interface';

describe('ListAttributesUseCase', () => {
  let useCase: ListAttributesUseCase;
  let attributeRepository: jest.Mocked<IAttributeRepository>;

  beforeEach(() => {
    attributeRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IAttributeRepository>;

    useCase = new ListAttributesUseCase(attributeRepository);
  });

  it('should return a list of attributes', async () => {
    const mockAttributes: IAttribute[] = [
      {
        id: 1,
        name: 'wifi',
        description: 'Disponibilidad de Wi-Fi',
        status: true,
        requires_response: false,
      },
      {
        id: 2,
        name: 'pet_friendly',
        description: 'Permiten mascotas',
        requires_response: true,
        status: true,
      },
    ];

    attributeRepository.findAll.mockResolvedValue(mockAttributes);

    const result = await useCase.execute();

    expect(attributeRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockAttributes);
  });
});
