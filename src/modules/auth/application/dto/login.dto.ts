import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAuthLogin } from 'src/modules/auth/domain/interfaces/login-auth.interface';

export class LoginDto implements IAuthLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  id_google?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
