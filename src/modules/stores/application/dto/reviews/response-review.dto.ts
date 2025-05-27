export class ResponseReviewDto {
  id: number;
  branchName: string;
  clientName: string;
  rating: number;
  comment: string;
  imageUrls?: string[];
  createdAt: Date;

  constructor(review: any) {
    this.id = review.id;
    this.branchName = review.branch?.name || null;
    this.clientName = review.client?.person.full_name || null;
    this.rating = review.rating;
    this.comment = review.comment;
    this.imageUrls = review.image_urls || null;
    this.createdAt = review.createdAt || null;
  }
}
