export class ResponseAttributeDto {
  id: number;
  name: string;
  description: string;
  requires_response : boolean
  status: boolean;

  constructor(attribute: any) {
    this.id = attribute.id;
    this.name = attribute.name;
    this.description = attribute.description;
    this.requires_response = attribute.requires_response;
    this.status = attribute.status;
  }
}

export class ListAttributesDto {
  attributes: ResponseAttributeDto[];
  constructor(attributes: any[]) {
    this.attributes = attributes.map(
      (attribute) => new ResponseAttributeDto(attribute),
    );
  }
}
