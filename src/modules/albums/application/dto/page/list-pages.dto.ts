export class ListPagesDto {
  albumId: number;
  albumLogo: string;
  albumTitle: string;
  albumDescription: string;
  pages: {
    id: string;
    title: string;
    description: string;
  };

  constructor(page: any) {
    this.albumId = page[0].album?.id;
    this.albumLogo = page[0].album?.logo;
    this.albumTitle = page[0].album?.title;
    this.albumDescription = page[0].album?.description;
    this.pages = page.map((page) => {
      return {
        id: page.id,
        title: page.title,
        description: page.description,
      };
    });
  }
}
