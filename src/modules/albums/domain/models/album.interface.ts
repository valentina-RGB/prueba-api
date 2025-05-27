export interface IAlbum {
    id: number;
    type: string; // 'ANNUAL', 'EVENT', 'STORE', 'SEASON'
    title: string;
    logo?: string;
    introduction: string;
    start_date: Date;
    end_date: Date;
    entity_id?: number;
    status: boolean;
  }
  