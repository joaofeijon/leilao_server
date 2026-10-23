import type { ProductRepository } from "@/repositories/product-repository";
import type { IProductId, IResponseProduct } from "./types";
import { productNotFound } from '../errors/product-not-found';

export class GetProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute({ id }: IProductId): Promise<IResponseProduct> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new productNotFound()
    }

    return { product }
  }
}
