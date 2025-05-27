export interface ICreateAttribute {
  name: string;
  description: string;
  status?: boolean;
}

export interface IUpdateAttribute {
  name?: string;
  description?: string;
  status?: boolean;
}

