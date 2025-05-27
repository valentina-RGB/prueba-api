export class BranchStatusResponseDto {
  id: number;
  name: string;
  address: string;
  status: string;
  store_logo: string | null;
  store_email: string | null;

  constructor(branch: any) {
    this.id = branch.id;
    this.name = branch.name;
    this.address = branch.address;
    this.status = branch.status;
    this.store_logo = branch.store?.logo ?? null;
    this.store_email = branch.store?.email ?? null;
  }
}
