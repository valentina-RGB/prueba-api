import { ICriteria } from '../models/criteria.interface';

export interface ICreateCriteriaResponseDto {
  criteria?: ICriteria;
  response_text?: string;
  image_url?: string;
}
