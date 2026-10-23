import type { ProductRepository } from "@/repositories/product-repository";
import type { BidRepository } from "@/repositories/bid-repository";
import type { IProductId } from "./types";
import { productNotFound } from '../errors/product-not-found';
import { productHasBids } from '../errors/product-has-bids';

export class DeleteProduct {
  constructor(
    private productRepository: ProductRepository,
    private bidRepository: BidRepository,
  ) {}

  async execute({ id }: IProductId): Promise<void> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new productNotFound()
    }

    if (await this.bidRepository.findHighestByProductId(id)) {
      throw new productHasBids()
    }

    await this.productRepository.delete(id)
  }
}
