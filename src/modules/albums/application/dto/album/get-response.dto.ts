import { AlbumPageResponseDto } from "../page/page-response.dto";

  export class AlbumResponseDto {
    id: number;
    title: string;
    logo: string;
    introduction: string;
    type: string;
    start_date: string;
    end_date: string;
    status: boolean;
    pages: AlbumPageResponseDto[];
  
    constructor(album: any) {
      this.id = album.id;
      this.title = album.title;
      this.logo = album.logo;
      this.introduction = album.introduction;
      this.type = album.type;
      this.start_date = album.start_date;
      this.end_date = album.end_date;
      this.status = album.status;
      this.pages = album.pages?.map((page: any) => new AlbumPageResponseDto(page)) || [];
    }
  }
  