import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { AddStampToClientUseCase } from 'src/modules/albums/application/use-cases/stamp-client/add-stamp-to-client.use-case';
import { IStampClients } from 'src/modules/albums/domain/models/stamp-clients.interface';
import {
  IBranchesRepository,
  IBranchRepositoryToken,
} from 'src/modules/stores/domain/repositories/branches.repository.interface';

const DISTANCE_IN_METERS = 0.01; // 20 metros

@Injectable()
export class RegisterVisitUseCase implements IUseCase<{}, IStampClients> {
  constructor(
    @Inject(IBranchRepositoryToken)
    private readonly branchRepository: IBranchesRepository,
    private readonly addStampToClient: AddStampToClientUseCase,
  ) {}

  async execute({
    branchId,
    latitude,
    longitude,
    user,
  }): Promise<IStampClients> {
    const branch = await this.branchRepository.findById(branchId);

    if (!branch) throw new NotFoundException('Branch not found');

    if (branch.status !== 'APPROVED')
      throw new BadRequestException('Branch is not approved');

    const distance = this.calculateDistance(
      branch.latitude,
      branch.longitude,
      latitude,
      longitude,
    );

    if (distance > DISTANCE_IN_METERS)
      throw new BadRequestException('You are too far from the branch');

    let stamp;

    try {
      stamp = await this.addStampToClient.execute({ branchId, user });
    } catch (error) {
      throw new BadRequestException(
        `Error adding stamp to client: ${error.message}`,
      );
    }

    return stamp;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
