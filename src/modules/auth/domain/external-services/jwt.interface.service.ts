export interface IJwtService {
  sign(payload: any, options?: any): string;
  verify(token: string, options?: any): any;
  decode(token: string): any;
}

export const IJwtServiceToken = Symbol('IJwtService');
