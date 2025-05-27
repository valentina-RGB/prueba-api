export class StampResponseDto {
  id: number;
  logo: string;
  name: string;
  description: string;
  coffeecoins_value: number;
  status: boolean;

  constructor(stamp: any) {
    this.id = stamp.id;
    this.logo = stamp.logo;
    this.name = stamp.name;
    this.description = stamp.description;
    this.coffeecoins_value = stamp.coffeecoins_value;
    this.status = stamp.status;
  }
}
