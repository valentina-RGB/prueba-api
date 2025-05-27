import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginResponseDto } from '../../application/dto/login-response.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {
  IAuthService,
  IAuthServiceToken,
} from '../../domain/auth.service.interface';
import { Public } from '../decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(IAuthServiceToken)
    private readonly authService: IAuthService,

    private configService: ConfigService,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Iniciar autenticación con Google' })
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;

    if (!user) return res.redirect(`http://localhost:5173/registerWithGoogle`);

    const accessToken = this.authService.generateJwtToken(user);

    const userData = encodeURIComponent(JSON.stringify(user));

    return res.redirect(
      ` http://localhost:5173/google/callback?accessToken=${accessToken}&user=${userData}`,
    );
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'User logged in succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() data: LoginDto) {
    try {
      const loginResponse = await this.authService.login(data);
      return new LoginResponseDto(loginResponse);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) throw error;
    
    console.error(error);

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
