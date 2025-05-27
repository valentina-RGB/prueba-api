import {
  IAlbumRepository,
  IAlbumRepositoryToken,
} from '../../../domain/repositories/album.repository.interface';
import { CreateAlbumDto } from 'src/modules/albums/application/dto/album/create-album.dto';
import { IAlbum } from '../../../domain/models/album.interface';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUseCase } from 'src/core/domain/interfaces/use-cases/use-case.interface';
import { GetAnnualAlbumByYearUseCase } from './get-album-by-year.use-case';
import { GetEventByIdUseCase } from 'src/modules/events/application/use-cases/events/get-event-by-id.use-case';
import { CreatePageUseCase } from '../page/create-page.use-case';
import { CreatePageStampsToEventUseCase } from '../page-stamps/create-page-stamps-to-event.use-case';
@Injectable()
export class CreateAlbumUseCase implements IUseCase<CreateAlbumDto, IAlbum> {
  constructor(
    @Inject(IAlbumRepositoryToken)
    private readonly albumRepository: IAlbumRepository,
    private readonly getAlbumByYearUseCase: GetAnnualAlbumByYearUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly createPageUseCase: CreatePageUseCase,
    private readonly createPageStampsToEvent: CreatePageStampsToEventUseCase,
  ) {}

  async execute(albumDto: CreateAlbumDto): Promise<IAlbum> {
    switch (albumDto.type) {
      case 'ANNUAL':
        await this.validateAnnualAlbum(albumDto);
        break;

      case 'EVENT':
        await this.validateEventAlbum(albumDto);
        break;

      default:
        throw new ConflictException(`Unknown album type: ${albumDto.type}`);
    }

    const album = await this.albumRepository.create(albumDto);
    if (!album) throw new ConflictException('Album already exists');

    const page = await this.createPageUseCase.execute({
      album_id: album.id,
      // type: 'BRANCHES',
      title: 'Página de Cafeterías',
      description: 'Sellos de las Cafeterías',
    });

    if (albumDto.type === 'EVENT') {
      await this.createPageStampsToEvent.execute({
        pageId: page.id,
        eventId: albumDto.entity_id!,
      });
    }

    return album;
  }

  private async validateAnnualAlbum(dto: CreateAlbumDto) {
    const year = new Date(dto.start_date).getFullYear();
    const existingAlbum = await this.getAlbumByYearUseCase.execute(year);

    if (existingAlbum) {
      throw new ConflictException(
        `The album ${existingAlbum.title} already exists and covers the period from ${existingAlbum.start_date} to ${existingAlbum.end_date}.`,
      );
    }
  }

  private async validateEventAlbum(dto: CreateAlbumDto) {
    if (!dto.entity_id) {
      throw new ConflictException('Event ID is required for event albums');
    }

    const event = await this.getEventByIdUseCase.execute({id: dto.entity_id});
    if (!event) {
      throw new ConflictException(
        `Event with ID ${dto.entity_id} does not exist`,
      );
    }

    const dtoStart = new Date(dto.start_date).getTime();
    const dtoEnd = new Date(dto.end_date).getTime();

    if (
      event.start_date.getTime() !== dtoStart ||
      event.end_date.getTime() !== dtoEnd
    ) {
      throw new ConflictException(
        `Album dates must match event dates. Event starts on ${event.start_date} and ends on ${event.end_date}.`,
      );
    }
  }
}
