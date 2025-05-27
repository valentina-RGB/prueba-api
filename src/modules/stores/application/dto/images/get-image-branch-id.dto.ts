export class GetImageBranchIdDto {
  
  images: {
    id: number;
    image_type: string;
    image_url: string;
  }[];

  constructor(images: any[]) {
    if (!images || images.length === 0) {
      this.images = [];
      return;
    }

    this.images = images.map((img) => ({
      id: img.id,
      image_type: img.image_type,
      image_url: img.image_url,
    }));
  }

  toResponse() {
    if (!this.images.length) {
      return [];
    }
    return this;
  }
}