import type { ProductRepository } from "@/repositories/product-repository";
import type { BidRepository } from "@/repositories/bid-repository";
import type { IListBids, IResponseListBids } from "./types";
import { productNotFound } from '../errors/product-not-found';

export class ListBids {
  constructor(
    private productRepository: ProductRepository,
    private bidRepository: BidRepository,
  ) {}

  async execute({ productId }: IListBids): Promise<IResponseListBids> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new productNotFound()
    }

    const bids = await this.bidRepository.findManyByProductId(productId)

    return { bids }
  }
}
