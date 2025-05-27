export class CreatePageResponseDto {
  album: {
    album_id: number;
    album_title: string;
  };
  id: string;
  title: string;
  description: string;
  status: string;

  constructor(page: any) {
    this.album = {
      album_id: page.album?.id,
      album_title: page.album?.title,
    };
    this.id = page.id;
    this.title = page.title;
    this.description = page.description;
    this.status = page.status;
  }
}
