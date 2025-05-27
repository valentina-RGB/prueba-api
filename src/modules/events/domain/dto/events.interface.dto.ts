export interface ICreateEvent {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  location: string;
  is_free: boolean;
  value?: number;
  organizer: string;
  branch_ids?: number[];
}

export interface IUpdateEvent {
  name?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  location?: string;
  is_free?: boolean;
  value?: number;
  organizer?: string;
}
