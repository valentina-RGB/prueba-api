import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IStoreService,
  IStoreServiceToken,
} from '../../domain/store.services.interfaces';
import { CreateBranchScheduleDto } from '../../application/dto/branch-schedule/create-branch-schedule.dto';
import { ResponseBranchScheduleDto } from '../../application/dto/branch-schedule/response-branch-schedule.dto';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

@ApiTags('Branch Schedule')
@Controller('branch-schedule')
export class BranchScheduleController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.ADMIN_BRANCH, Role.ADMIN_STORE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new branch schedule' })
  @ApiResponse({
    status: 201,
    description: 'Branch schedule created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createBranchSchedule(
    @Body() branchScheduleData: CreateBranchScheduleDto,
  ) {
    try {
      const branchSchedule =
        await this.storeService.createBranchSchedule(branchScheduleData);
      return new ResponseBranchScheduleDto(branchSchedule);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('branch/:branchId')
  @ApiOperation({ summary: 'Get schedule by branch ID' })
  @ApiResponse({ status: 200, description: 'Schedule fetched successfully' })
  @ApiResponse({
    status: 404,
    description: 'No schedule found for this branch',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getScheduleByBranchId(@Param('branchId') branchId: number) {
    try {
      const schedule = await this.storeService.getScheduleByBranchId(branchId);
      return schedule.map((entry) => new ResponseBranchScheduleDto(entry));
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
