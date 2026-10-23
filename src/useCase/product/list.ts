import type { ProductRepository } from "@/repositories/product-repository";
import type { IResponseListProducts } from "./types";

export class ListProducts {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<IResponseListProducts> {
    const products = await this.productRepository.findMany()

    return { products }
  }
}
