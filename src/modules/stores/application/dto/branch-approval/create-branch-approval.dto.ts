import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateCriteriaResponseDto } from '../criteria-response/create-criteria-response.dto';
import { ICreateBranchApprovalDto } from 'src/modules/stores/domain/dto/branch-approval.interface.dto';

export class CreateBranchApprovalDto implements ICreateBranchApprovalDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the branch being approved',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'The branchId must be a number.' })
  branchId: number;

  @ApiProperty({
    example: 'This branch meets all the criteria.',
    description: 'Comments for the branch approval',
  })
  @IsOptional()
  comments?: string;

  criteriaResponseData: CreateCriteriaResponseDto[];
}
