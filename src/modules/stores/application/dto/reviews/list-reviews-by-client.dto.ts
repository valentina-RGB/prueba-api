export class ListReviewsByClientDto {
    clientId;
    clientName: string;
    reviews: {
      id: number;
      branchName: string;
      rating: number;
      comment: string;
      imageUrls?: string[];
      createdAt: Date;
    };
  
    constructor(review: any) {
      this.clientId = review[0].client?.id || null;
      this.clientName = review[0].client?.person.full_name || null;
      this.reviews = review.map((review) => {
        return {
          id: review.id,
          branchName: review.branch?.name || null,
          rating: review.rating,
          comment: review.comment,
          imageUrls: review.image_urls || null,
          createdAt: review.createdAt || null,
        };
      });
    }
  }
  