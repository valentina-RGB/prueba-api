export class OpenOrCloseBranchDto {
  id: number;
  name: string;
  is_open: boolean;

  constructor(branch: any) {
    this.id = branch.id;
    this.name = branch.name;
    this.is_open = branch.is_open;
  }
}
