import {
  Controller,
  Inject,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';
import {
  IStoreService,
  IStoreServiceToken,
} from '../../domain/store.services.interfaces';
import { CreateBranchAttributeDto } from '../../application/dto/branch-attribute/create-branch-attribute.dto';
import { ResponseCreateBranchAttributeDto } from '../../application/dto/branch-attribute/reponse-create.dto';
import { ResponseBranchAttributeDto } from '../../application/dto/branch-attribute/response-attribute-by-branch.dto';
import { UpdateBranchAttributeDto } from '../../application/dto/branch-attribute/update-branch-attibute.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from 'src/modules/users/application/dto/enums/role.enum';

@ApiTags('Branch Attributes')
@Controller('branch-attributes')
export class BranchAttributesController {
  constructor(
    @Inject(IStoreServiceToken)
    private readonly storeService: IStoreService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new branch attribute' })
  @ApiResponse({
    status: 201,
    description: 'Branch attribute created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateBranchAttributeDto })
  async create(@Body() dto: CreateBranchAttributeDto) {
    try {
      const branchAttribute =
        await this.storeService.createBranchAttribute(dto);

      return new ResponseCreateBranchAttributeDto(branchAttribute);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Get(':branchId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all branch attributes by branch' })
  @ApiResponse({
    status: 200,
    description: 'Branch attributes by branch fetched successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Param('branchId') branchId: number) {
    try {
      const attributes =
        await this.storeService.findAllBranchAttributes(branchId);

      return new ResponseBranchAttributeDto(attributes);
    } catch (error) {
      this.handleError(error);
    }
  }
  
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_SYS, Role.ADMIN_BRANCH)
@Patch('branch/:branchId/attribute/:attributeId')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Update a branch attribute' })
@ApiResponse({
  status: 200,
  description: 'Branch attribute updated successfully',
})
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Internal server error' })
@ApiBody({ type: UpdateBranchAttributeDto })
async update(
  @Param('branchId') branchId: number,
  @Param('attributeId') attributeId: number,
  @Body() data: UpdateBranchAttributeDto
) {
  try {
    const branchAttribute = await this.storeService.updateBranchAttribute(
      branchId,
      attributeId,
      data
    );

    return branchAttribute;
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
