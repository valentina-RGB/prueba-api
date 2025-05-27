import { StampClientResponseDto } from 'src/modules/albums/application/dto/stamp-client/stamp-client.response.dto';

describe('StampClientResponseDto', () => {
  it('should return client_id as null and empty stamps when data is empty', () => {
    const dto = new StampClientResponseDto([]);

    expect(dto.client_id).toBeNull();
    expect(dto.stamps).toEqual([]);
  });

  it('should properly map stamp data', () => {
    const input = [
      {
        client: { id: 1 },
        stamp: { id: 10 },
        coffecoins_earned: 50,
        quantity: 2,
      },
      {
        client: { id: 1 },
        stamp: { id: 11 },
        coffecoins_earned: 25,
        quantity: 1,
      },
    ];

    const dto = new StampClientResponseDto(input);

    expect(dto.client_id).toBe(1);
    expect(dto.stamps).toEqual([
      { id: 10, coffecoins_earned: 50, quantity: 2 },
      { id: 11, coffecoins_earned: 25, quantity: 1 },
    ]);
  });

  it('should handle missing optional fields gracefully', () => {
    const input = [
      {
        client: null,
        stamp: null,
        coffecoins_earned: null,
        quantity: null,
      },
    ];

    const dto = new StampClientResponseDto(input);

    expect(dto.client_id).toBeNull();
    expect(dto.stamps).toEqual([
      { id: null, coffecoins_earned: null, quantity: null },
    ]);
  });
});
