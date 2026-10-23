import type { Product } from "@prisma/client";

export interface ICreateProduct {
  title: string;
  name: string;
  description: string;
  initialValue: number;
}

export interface IUpdateProduct {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  initialValue?: number;
}

export interface IProductId {
  id: string;
}

export interface IResponseProduct {
  product: Product;
}

export interface IResponseListProducts {
  products: Product[];
}
