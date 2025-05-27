export interface ICriteria {
  id: number;
  name: string;
  description: string;
  active: boolean;
  requires_image: boolean;
  createdAt: Date;
  updatedAt: Date;
}
