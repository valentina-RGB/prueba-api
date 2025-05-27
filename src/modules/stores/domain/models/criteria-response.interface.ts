import { ICriteria } from './criteria.interface';

export interface ICriteriaResponse {
  id: number;
  response_text?: string;
  image_url?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  criteria: ICriteria;
}
