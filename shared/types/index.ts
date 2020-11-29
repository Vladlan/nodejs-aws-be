export interface DBProduct {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface DBStock {
  id: string;
  product_id: string;
  count: number;
}

export class Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  count: number;
}
