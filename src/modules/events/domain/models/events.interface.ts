export interface IEvent {
  id: number;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  location: string;
  is_free: boolean;
  value: number;
  organizer: string;
  status: string; //'PUBLISHED' | 'RUNNING' | 'FINISHED' | 'CANCELLED';
}
