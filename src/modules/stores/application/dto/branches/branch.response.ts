export class BranchResponseDto {
  id: number;
  name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
  average_rating: number;
  is_open: boolean;
  status: boolean;
  store: {
    store_id: number;
    store_name: string;
    store_logo: string;
    store_email: string;
  };
  social_branches: {
    social_network_name: string;
    value: string;
    description: string;
  }[];

  constructor(branch: any) {
    this.id = branch.id;
    this.name = branch.name;
    this.phone_number = branch.phone_number;
    this.average_rating = branch.average_rating;
    this.is_open = branch.is_open;
    this.status = branch.status;
    this.latitude = branch.latitude;
    this.longitude = branch.longitude;
    this.address = branch.address;
    this.store = {
      store_id: branch.store?.id || null,
      store_name: branch.store?.name || null,
      store_logo: branch.store?.logo || null,
      store_email: branch.store?.email || null,
    };
    this.social_branches = Array.isArray(branch.social_branches) 
      ? branch.social_branches.map(social => ({
          social_network_id: social.social_network?.name || null,
          value: social.value,
          description: social.description
        }))
      : [];
  }
}
