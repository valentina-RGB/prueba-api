import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateRoleDto } from '../../application/dto/roles/create-role.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleResponseDto } from '../../application/dto/roles/role-response.dto';
import { ListRolesDto } from '../../application/dto/roles/list-roles.dto';
import {
  IUserService,
  IUserServiceToken,
} from '../../domain/user.service.interface';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '../../application/dto/enums/role.enum';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    @Inject(IUserServiceToken)
    private readonly userService: IUserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() roleData: CreateRoleDto) {
    try {
      const role = await this.userService.createRole(roleData);

      return {
        message: 'Role created succesfully',
        role: role,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Roles fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const roles = await this.userService.findAllRoles();

      return {
        message: 'Roles fetched succesfully',
        roles: new ListRolesDto(roles),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({ status: 200, description: 'Role fetched succesfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const role = await this.userService.findRoleById(id);

      return {
        message: 'Role fetched succesfully',
        role: new RoleResponseDto(role),
      };
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
