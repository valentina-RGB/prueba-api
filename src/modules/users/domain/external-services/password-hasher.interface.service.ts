export interface IPasswordHasherService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export const IPasswordHasherServiceToken = Symbol('IPasswordHasherService');
