export class PageResponseDto {
  id: string;
  title: string;
  description: string;
  stamps: {
    branch: string;
    logo: string;
    name: string;
    description: string;
    coffeecoins_value: number;
  };

  constructor(page: any) {
    this.id = page.id;
    this.title = page.title;
    this.description = page.description;
    this.stamps = {
      branch: page.stamp?.branch?.name,
      logo: page.stamp?.logo,
      name: page.stamp?.name,
      description: page.stamp?.description,
      coffeecoins_value: page.stamp?.coffeecoins_value,
    };
  }
}

export class AlbumPageResponseDto {
  id: number;
  title: string;
  description: string;

  constructor(page: any) {
    this.id = page.id;
    this.title = page.title;
    this.description = page.description;
  }
}
