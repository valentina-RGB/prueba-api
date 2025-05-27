import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { IPasswordHasherService } from '../../domain/external-services/password-hasher.interface.service';

@Injectable()
export class PasswordHasherService implements IPasswordHasherService {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
