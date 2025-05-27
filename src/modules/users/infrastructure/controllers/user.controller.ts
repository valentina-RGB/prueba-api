import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Inject,
  HttpException,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IUserService,
  IUserServiceToken,
} from '../../domain/user.service.interface';
import { CreateUserDto } from '../../application/dto/users/create-user.dto';
import { UpdateUserDto } from '../../application/dto/users/update-user.dto';
import { UserResponseDto } from '../../application/dto/users/user-response.dto';
import { ListUsersDto } from '../../application/dto/users/list-users.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '../../application/dto/enums/role.enum';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/infrastructure/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(IUserServiceToken)
    private readonly userService: IUserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() userData: CreateUserDto) {
    try {
      const user = await this.userService.createUser(userData);

      return {
        message: 'User created succesfully',
        user: new UserResponseDto(user),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const users = await this.userService.listUsers();

      return {
        message: 'Users fetched successfully',
        users: new ListUsersDto(users),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User fetched succesfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const user = await this.userService.getUser(id);

      return {
        message: 'User fetched succesfully',
        user: new UserResponseDto(user),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.updateUser(id, userData);

      return {
        message: 'User updated succesfully',
        user: new UserResponseDto(user),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    try {
      await this.userService.deleteUser(id);
      return { message: 'User deleted succesfully' };
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
