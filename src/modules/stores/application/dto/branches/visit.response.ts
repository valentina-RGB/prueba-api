export class VisitResponseDto {
  coffeecoins_earned: number;
  stamp: {
    logo: string;
    name: string;
  };

  constructor(stamp: any) {
    this.coffeecoins_earned = stamp.stamp?.coffeecoins_value || 0;
    this.stamp = {
      logo: stamp.stamp?.logo || null,
      name: stamp.stamp?.name || null,
    };
  }
}
