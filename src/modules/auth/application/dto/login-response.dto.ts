import { IAuthLoginDto } from 'src/modules/auth/domain/dto/auth.dto.interface';
import { IRole } from 'src/modules/users/domain/models/role.interface';

export class LoginResponseDto implements IAuthLoginDto {
  accessToken: string;
  user: {
    id: number;
    role: IRole;
    email: string;
  };
  storeOrBranchId?: number;

  constructor(data: any) {
    this.accessToken = data.accessToken;
    this.user = {
      id: data.user.id,
      role: data.user.role.name,
      email: data.user.email,
    };
    this.storeOrBranchId = data.storeOrBranchId;
  }
}
