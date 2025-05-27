import { ApiProperty } from "@nestjs/swagger";

  class GetAlbumResponseDto {
    id: number;
    title: string;
    logo: string;
    introduction: string;
    type: string;
    start_date: string;
    end_date: string;
    status: boolean;
    
  
    constructor(album: any) {
      this.id = album.id;
      this.title = album.title;
      this.logo = album.logo;
      this.introduction = album.introduction;
      this.type = album.type;
      this.start_date = album.start_date;
      this.end_date = album.end_date;
      this.status = album.status;
    }
  }
  export class ListAlbumsDto {
    @ApiProperty({ type: [GetAlbumResponseDto], description: 'List of albums' })
    albums: GetAlbumResponseDto[];
  
    constructor(albums: any[]) {
      this.albums = albums.map((albums) => new GetAlbumResponseDto(albums));
    }
  }