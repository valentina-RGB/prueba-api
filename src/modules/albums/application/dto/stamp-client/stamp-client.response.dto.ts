export class StampClientResponseDto {
  client_id: number | null;
  stamps: {
    id: number;
    coffecoins_earned: number;
    quantity: number;
  }[];

  constructor(stampsData: any[]) {
    if (!stampsData.length) {
      this.client_id = null;
      this.stamps = [];
      return;
    }

    const firstStamp = stampsData[0];
    this.client_id = firstStamp.client?.id || null;

    this.stamps = stampsData.map((stampItem) => ({
      id: stampItem.stamp?.id || null,
      coffecoins_earned: stampItem.coffecoins_earned || null,
      quantity: stampItem.quantity || null,
    }));
  }
}
