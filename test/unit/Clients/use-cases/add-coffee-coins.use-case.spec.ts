import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { AddCoffeeCoinsToClientUseCase } from 'src/modules/users/application/use-cases/clients/add-coffee-coins.use-case';
import { IClient } from 'src/modules/users/domain/models/client.interface';
import {
  IClientRepository,
} from 'src/modules/users/domain/repositories/client.repository.interface';

describe('AddCoffeeCoinsToClientUseCase', () => {
  let useCase: AddCoffeeCoinsToClientUseCase;
  let clientRepository: jest.Mocked<IClientRepository>;

    const mockPerson = {
      id: 1,
      user: {
        id: 1,
        email: 'test@example.com',
        role:  { id: 1, name: 'CLIENT', status: true },
        status: true,
      },
      type_document: 'CC',
      number_document: '123456',
      full_name: 'John Doe',
      phone_number: '3001234567',
    };

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
      addCoffeeCoins: jest.fn(),
    } as unknown as jest.Mocked<IClientRepository>;

    useCase = new AddCoffeeCoinsToClientUseCase(clientRepository);
  });

  it('should add coffee coins when client exists and quantity > 0', async () => {
    const data = { id: 1, quantity: 10 };
    const client = { id: 1, person: mockPerson, coffee_coins: 5 } as any;

    clientRepository.findById.mockResolvedValueOnce(client);
    clientRepository.addCoffeeCoins.mockResolvedValueOnce({
      ...client,
      coffee_coins: 15,
    });

    const result = await useCase.execute(data);

    expect(clientRepository.findById).toHaveBeenCalledWith(1);
    expect(clientRepository.addCoffeeCoins).toHaveBeenCalledWith({
      ...client,
      coffee_coins: 15,
    });
    expect(result.coffee_coins).toBe(15);
  });

  it('should throw BadRequestException if quantity <= 0', async () => {
    const data = { id: 1, quantity: 0 };
    const client = { id: 1, person: mockPerson, coffee_coins: 5 } as any;

    clientRepository.findById.mockResolvedValueOnce(client);

    await expect(useCase.execute(data)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if client does not exist', async () => {
    const data = { id: 1, quantity: 10 };

    clientRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(data)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if update fails', async () => {
    const data = { id: 1, quantity: 10 };
    const client = { id: 1, person: mockPerson, coffee_coins: 5 } as any;

    clientRepository.findById.mockResolvedValueOnce(client);
    clientRepository.addCoffeeCoins.mockResolvedValueOnce(null as unknown as IClient);

    await expect(useCase.execute(data)).rejects.toThrow(ConflictException);
  });
});
