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
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBranchApprovalDto } from '../../application/dto/branch-approval/create-branch-approval.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  IStoreServiceToken,
  IStoreService,
} from '../../domain/store.services.interfaces';
import { BranchApprovalResponseDto } from '../../application/dto/branch-approval/update-response.dto';
import { BranchApprovalResponseCreateDto } from '../../application/dto/branch-approval/create-response.dto';
import { BADetailResponseDto } from '../../application/dto/branch-approval/get-detail-response.dto';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@ApiTags('Branch Approvals')
@Controller('branch-approvals')
export class BranchApprovalController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Get('detail/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get detailed info for a branch' })
  @ApiResponse({
    status: 200,
    description: 'Branch detail fetched successfully',
    // type: BranchDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getBranchDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      const detail = await this.storeService.getBranchApprovalByBranchId(id);

      return new BADetailResponseDto(detail);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create branch approval with criteria responses' })
  @ApiResponse({
    status: 201,
    description: 'Branch approval process created successfully',
  })
  async createApproval(@Body() data: CreateBranchApprovalDto) {
    try {
      const approval = await this.storeService.createBranchApproval(data);

      const responseApproval = new BranchApprovalResponseCreateDto(approval);
      return {
        message: 'Branch approval created successfully',
        responseApproval,
      };
    } catch (error) {
      this.handleError(error);
    }
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update branch approval status' })
  @ApiResponse({
    status: 200,
    description: 'Branch approval status updated successfully',
  })
  async updateApprovalStatus(
    @Param('id') id: number,
    @Body() data: { status: boolean; comments?: string; approvedById: number },
  ) {
    try {
      const approval = await this.storeService.updateBranchApprovalStatus(
        id,
        data.status,
        data.approvedById,
        data?.comments,
      );

      const responseApproval = new BranchApprovalResponseDto(approval);
      return {
        message: 'Branch approval status updated successfully',
        responseApproval,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
