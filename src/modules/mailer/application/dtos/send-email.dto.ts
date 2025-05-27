import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  attachments?: any[];
}