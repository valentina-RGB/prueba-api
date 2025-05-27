import { Test } from '@nestjs/testing';
import { GenerateJwtTokenUseCase } from 'src/modules/auth/application/use-cases/generate-jwt-token.use-case';
import {
  IJwtService,
  IJwtServiceToken,
} from 'src/modules/auth/domain/external-services/jwt.interface.service';

describe('GenerateJwtTokenUseCase', () => {
  let generateJwtTokenUseCase: GenerateJwtTokenUseCase;
  let jwtService: IJwtService;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      providers: [
        GenerateJwtTokenUseCase,
        {
          provide: IJwtServiceToken,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    generateJwtTokenUseCase = moduleFixture.get<GenerateJwtTokenUseCase>(
      GenerateJwtTokenUseCase,
    );
    jwtService = moduleFixture.get<IJwtService>(IJwtServiceToken);
  });

  it('should generate a JWT token with the correct payload', () => {
    const user = {
      id: 1,
      email: 'john@example.com',
      role: { name: 'Admin' },
    };

    const mockToken = 'mock-jwt-token';
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

    const result = generateJwtTokenUseCase.execute(user);

    expect(result).toBe(mockToken);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });
  });
});
