import { PageStampsEntity } from 'src/modules/albums/infrastructure/entities/page-stamps.entity';
import { StampResponseDto } from '../stamp/stamp-response.dto';
import { PageResponseDto } from '../page/page-response.dto';

class CreatedStampPageDto {
  id: number;
  page: PageResponseDto;
  stamp: StampResponseDto;

  constructor(entity: PageStampsEntity) {
    this.id = entity.id;
    this.page = new PageResponseDto(entity.page);
    this.stamp = new StampResponseDto(entity.stamp);
  }
}

export class CreatePageStampsResponseDto {
  created: CreatedStampPageDto[];
  errors: string[];

  constructor(data: { created: PageStampsEntity[]; errors?: string[] }) {
    this.created = data.created.map(
      (entity) => new CreatedStampPageDto(entity),
    );
    this.errors = data.errors || [];
  }
}
