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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BranchResponseDto } from '../../application/dto/branches/branch.response';
import { CreateBranchDto } from '../../application/dto/branches/create-branch.dto';
import { ListBranchesDto } from '../../application/dto/branches/list-branch.dto';
import {
  IStoreService,
  IStoreServiceToken,
} from '../../domain/store.services.interfaces';
import { BranchStatusResponseDto } from '../../application/dto/branches/branch-status.dto';
import { RegisterVisitDto } from '../../application/dto/branches/register-visit.dto';
import { CurrentUser } from 'src/modules/auth/infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';
import { VisitResponseDto } from '../../application/dto/branches/visit.response';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import { OpenOrCloseBranchDto } from '../../application/dto/branches/open-close-branch.dto';
import { UpdateBranchDto } from '../../application/dto/branches/update-branch.dto';

@ApiTags('Branches')
@Controller('branches')
export class BranchController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly branchService: IStoreService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Branch is already' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateBranchDto })
  async create(@Body() branchData: CreateBranchDto) {
    try {
      const branch = await this.branchService.createBranch(branchData);
      return {
        message: 'Branch created succesfully',
        branch: new BranchResponseDto(branch),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all branch' })
  @ApiResponse({ status: 200, description: 'Branch fetched succesfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(
  @Query('lat') lat?: number,
  @Query('long') long?: number,
) {
    try {
      const branch = await this.branchService.findAllBranches(lat, long);
      return {
        message: 'Branch fetched succesfully',
        branches: new ListBranchesDto(branch),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a brach by id' })
  @ApiResponse({
    status: 200,
    description: 'Branch fetched succesfully',
    type: BranchResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const branch = await this.branchService.findBranchById(id);
      return {
        message: 'Branch fetched succesfully',
        branch: new BranchResponseDto(branch),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all branches by status' })
  @ApiResponse({
    status: 200,
    description: 'Branches fetched succesfully',
    type: BranchResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Branches not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByStatus(@Param('status') status: string) {
    try {
      const branches = await this.branchService.findBranchesByStatus(status);

      const response = branches.map(
        (branch) => new BranchStatusResponseDto(branch),
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.ADMIN_SYS,
    Role.ADMIN_BRANCH,
    Role.ADMIN_STORE,
    Role.CLIENT,
    Role.EMPLOYEE,
  )
  @Get('store/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all branches by store' })
  @ApiResponse({
    status: 200,
    description: 'Branches fetched succesfully',
    type: BranchResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Branches not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOneStore(@Param('id', new ParseIntPipe()) id: number) {
    try {
      const branches = await this.branchService.findBranchByStoreId(id);
      return {
        message: 'Branch by store fetched succesfully',
        branches: branches
          ? branches.map((branch) => new BranchResponseDto(branch))
          : [],
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.CLIENT)
  @Post('register-visit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a visit to a branch' })
  @ApiResponse({ status: 200, description: 'Visit registered succesfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: RegisterVisitDto })
  async registerVisit(
    @CurrentUser() user,
    @Body() visitData: RegisterVisitDto,
  ) {
    try {
      const visit = await this.branchService.registerVisit(
        visitData.branch_id,
        visitData.latitude,
        visitData.longitude,
        user,
      );
      return {
        message: 'Visit registered succesfully',
        data: new VisitResponseDto(visit),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.ADMIN_BRANCH, Role.ADMIN_STORE)
  @Patch('open-close/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Open or close a branch' })
  @ApiResponse({
    status: 200,
    description: 'Branch status updated succesfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 409, description: 'Branch already in this state' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async openOrCloseBranch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body('isOpen') isOpen: boolean,
  ) {
    try {
      const branch = await this.branchService.openOrCloseBranch(id, isOpen);
      return {
        message: 'Branch status updated succesfully',
        branch: new OpenOrCloseBranchDto(branch),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SYS, Role.ADMIN_BRANCH, Role.ADMIN_STORE)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a branch' })
  @ApiResponse({
    status: 200,
    description: 'Branch updated succesfully',
    type: BranchResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() branchData: UpdateBranchDto,
  ) {
    try {
      const branch = await this.branchService.updateBranch(id, branchData);
      return {
        message: 'Branch updated succesfully',
        branch: new BranchResponseDto(branch),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.error('Error:', error);
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
