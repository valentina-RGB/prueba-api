export class BADetailResponseDto {
  approvalId: number;
  status: string;
  updatedAt: string;

  branch: {
    id: number;
    name: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
    address: string;
  };

  criteriaResponses: {
    criteria: {
      name: string;
      description: string;
    };
    responseText: string;
    imageUrl: string | null;
  }[];

  approvedBy: string | null;

  comments: string | null;

  constructor(approval: any) {
    this.approvalId = approval.id;
    this.status = approval.status;
    this.updatedAt = approval.updatedAt.toISOString();
    this.comments = approval.comments || null;

    this.branch = {
      id: approval.branch.id,
      name: approval.branch.name,
      phoneNumber: approval.branch.phone_number,
      latitude: approval.branch.latitude,
      longitude: approval.branch.longitude,
      address: approval.branch.address,
    };

    this.criteriaResponses =
      approval.criteria_responses?.map((resp: any) => ({
        criteria: {
          name: resp.criteria.name,
          description: resp.criteria.description,
        },
        responseText: resp.response_text,
        imageUrl: resp.image_url || null,
      })) || [];

    this.approvedBy = approval.approved_by?.person.full_name || null;
  }
}
