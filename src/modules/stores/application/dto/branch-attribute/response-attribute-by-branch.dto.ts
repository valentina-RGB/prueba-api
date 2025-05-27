export class ResponseBranchAttributeDto {
  attributes: {
    attributeId: number;
    attributeName: string;
    value: string;
  }[];

  constructor(data: any[]) {
    this.attributes = data.map((item) => ({
      attributeId: item.attribute.id,
      attributeName: item.attribute.name,
      value: item.value,
    }));
  }}