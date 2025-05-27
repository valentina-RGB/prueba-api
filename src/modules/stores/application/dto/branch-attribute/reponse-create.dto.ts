export class ResponseCreateBranchAttributeDto {
  branchId: number;
  branchName: string;
  attributes: {
    attributeId: number;
    attributeName: string;
    value: string;
  }[];

  constructor(data: any[]) {
    this.branchId = data[0].branch.id;
    this.branchName = data[0].branch.name;
    this.attributes = data.map((item) => ({
      attributeId: item.attribute.id,
      attributeName: item.attribute.name,
      value: item.value || '',
    }));
  }}