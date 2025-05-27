import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRepository } from 'src/modules/users/infrastructure/repositories/admin.repository';
import { AdministratorEntity } from 'src/modules/users/infrastructure/entities/admin.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAdminCreateDto } from 'src/modules/users/domain/dto/admin.dto.interface';
import { IAdministrator } from 'src/modules/users/domain/models/admin.interface';
import { IPeople } from 'src/modules/users/domain/models/people.interface';

describe('AdminRepository', () => {
  let adminRepository: AdminRepository;
  let mockRepository: Repository<AdministratorEntity>;

  const mockStore = {
    id: 1,
    name: 'Las Desdichas del Café',
    type_document: 'NIT',
    number_document: '765455559-3',
    logo: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    phone_number: '3114567890',
    email: 'valensc2545@gmail.com',
    status: 'APPROVED',
  };

  const mockAdminDto: IAdminCreateDto = {
    admin_type: 'STORE',
    person: { id: 1 } as IPeople,
    entity_id: mockStore.id,
  };

  const mockAdminSystem: IAdministrator = {
    id: 1,
    admin_type: 'SYSTEM',
    person: mockAdminDto.person,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdminStore: IAdministrator = {
    id: 2,
    admin_type: 'STORE',
    person: mockAdminDto.person,
    entity_id: mockStore.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminRepository,
        {
          provide: getRepositoryToken(AdministratorEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    adminRepository = module.get(AdminRepository);
    mockRepository = module.get(getRepositoryToken(AdministratorEntity));
  });

  describe('create', () => {
    it('should create an admin successfully', async () => {
      jest
        .spyOn(mockRepository, 'create')
        .mockReturnValue(mockAdminSystem as AdministratorEntity);
      jest
        .spyOn(mockRepository, 'save')
        .mockResolvedValue(mockAdminSystem as AdministratorEntity);

      const result = await adminRepository.create(mockAdminDto);
      expect(result).toEqual(mockAdminSystem);
      expect(mockRepository.create).toHaveBeenCalledWith(mockAdminDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAdminSystem);
    });

    it('should create a STORE admin successfully', async () => {
      jest
        .spyOn(mockRepository, 'create')
        .mockReturnValue(mockAdminStore as AdministratorEntity);
      jest
        .spyOn(mockRepository, 'save')
        .mockResolvedValue(mockAdminStore as AdministratorEntity);
      const result = await adminRepository.create(mockAdminDto);
      expect(result).toEqual(mockAdminStore);
      expect(mockRepository.create).toHaveBeenCalledWith(mockAdminDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAdminStore);
    });

    it('should throw ConflictException on duplicate admin (23505)', async () => {
      jest.spyOn(mockRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(mockRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(adminRepository.create(mockAdminDto)).rejects.toThrow(
        new ConflictException('Administrator already exists'),
      );
    });

    it('should throw InternalServerErrorException on general error', async () => {
      jest.spyOn(mockRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(mockRepository, 'save').mockRejectedValue(new Error());

      await expect(adminRepository.create(mockAdminDto)).rejects.toThrow(
        new InternalServerErrorException('Failed to create admin'),
      );
    });
  });

  describe('findById', () => {
    it('should return STORE admin', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValue(mockAdminStore as AdministratorEntity);

      const result = await adminRepository.findById(1);
      expect(result).toEqual(mockAdminStore);
    });

    it('should return null if admin not found', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);

      const result = await adminRepository.findById(99);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return cleaned list of admins', async () => {
      const admins: IAdministrator[] = [
        {
          id: 1,
          admin_type: 'SYSTEM',
          person: mockAdminDto.person,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          admin_type: 'STORE',
          person: mockAdminDto.person,
          entity_id: mockStore.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(mockRepository, 'find')
        .mockResolvedValue(admins as AdministratorEntity[]);

      const result = await adminRepository.findAll();
      expect(result).toEqual(admins);
    });
  });

  describe('findOne', () => {
    it('should find one admin by given options', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValue(mockAdminStore as AdministratorEntity);

      const result = await adminRepository.findOne({ where: { id: 1 } });
      expect(result).toEqual(mockAdminStore);
    });
  });
});
