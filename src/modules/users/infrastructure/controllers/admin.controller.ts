import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IUserServiceToken,
  IUserService,
} from '../../domain/user.service.interface';
import { ListAdminsDto } from '../../application/dto/admins/list-admin.dto';
import { AdminResponseDto } from '../../application/dto/admins/admin-reponse.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from '../../application/dto/enums/role.enum';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { CreateAdminStoreDto } from '../../application/dto/admins/create-admin-store.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject(IUserServiceToken)
    private readonly userService: IUserService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get()
  @ApiOperation({ summary: 'List all admins' })
  @ApiResponse({ status: 200, description: 'List of all admins' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: ListAdminsDto })
  async listAdmins() {
    const admins = await this.userService.listAdmin();
    return new ListAdminsDto(admins);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get('user/:id')
  @ApiOperation({ summary: 'List all admins' })
  @ApiResponse({ status: 200, description: 'List of all admins' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: ListAdminsDto })
  async getAdmiByUserId(@Param('id') id: number) {
    const admin = await this.userService.getAdminByUserId(id);
    return new AdminResponseDto(admin);
  }

  @Public()
  @Post('store-admin')
  @ApiOperation({ summary: 'Create store admin' })
  @ApiResponse({ status: 201, description: 'Store admin created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateAdminStoreDto })
  async createStoreAdmin(@Body() data: CreateAdminStoreDto) {
    const admin = await this.userService.createStoreAdmin(
      data.storeData,
      data.userData,
      data.personData,
    );
    return new AdminResponseDto(admin);
  }
}
