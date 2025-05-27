export class ListReviewsByBranchDto {
  branchId;
  branchName: string;
  reviews: {
    id: number;
    clientName: string;
    rating: number;
    comment: string;
    imageUrls?: string[];
    createdAt: Date;
  };

  constructor(review: any) {
    this.branchId = review[0].branch?.id || null;
    this.branchName = review[0].branch?.name || null;
    this.reviews = review.map((review) => {
      return {
        id: review.id,
        clientName: review.client?.person.full_name || null,
        rating: review.rating,
        comment: review.comment,
        imageUrls: review.image_urls || null,
        createdAt: review.createdAt || null,
      };
    });
  }
}
