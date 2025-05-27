import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IStamps } from "../../domain/models/stamps.interface";
import { IStampRepository } from "../../domain/repositories/stamp.repository.interface";
import { StampsEntity } from "../entities/stamps.entity";
import { ICreateStampDto } from "../../domain/dto/stamp.dto.interface";


export class StampRepository implements IStampRepository {
  constructor(
    @InjectRepository(StampsEntity)
    private readonly stampEntityRepository: Repository<StampsEntity>,
  ) {}
  
  ListStampByIdBranch(id: number): Promise<IStamps | null> {
    return this.stampEntityRepository.findOne({ where: { branch: { id } } })
  }

  create(data: ICreateStampDto): Promise<IStamps> {
    try {
      return this.stampEntityRepository.save(data);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Stamp with this name already exists');
      }
      throw new InternalServerErrorException('Failed to create stamp');
    }
  }

  findAll(): Promise<IStamps[]> {
    return this.stampEntityRepository.find();
  }

  findById(id: number): Promise<IStamps | null> {
    return this.stampEntityRepository.findOne({ where: { id } });
  }

  update(id: number, data: Partial<IStamps>): Promise<IStamps> {
    return this.stampEntityRepository.save({ ...data, id });
  }
}