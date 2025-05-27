export interface ICreateImage {
  image_type: string;
  image_url: string;
  related_type: string;
  related_id: number;
}

export interface ICreateMultipleImages {
  related_type: string;
  related_id: number;
  images: Omit<ICreateImage, 'related_type' | 'related_id'>[];
}
