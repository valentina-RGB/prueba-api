import { ApiProperty } from "@nestjs/swagger";
import { BranchResponseDto } from "./branch.response";

export class ListBranchesDto {
  @ApiProperty({ type: [BranchResponseDto], description: 'List of branches' })
  branches: BranchResponseDto[];

  constructor(branches: any[]) {
    this.branches = branches.map((branch) => new BranchResponseDto(branch));
  }
}