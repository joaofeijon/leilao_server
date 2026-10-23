import type { ProductRepository } from "@/repositories/product-repository";
import type { BidRepository } from "@/repositories/bid-repository";
import type { IUpdateProduct, IResponseProduct } from "./types";
import { productNotFound } from '../errors/product-not-found';
import { productHasBids } from '../errors/product-has-bids';
import { invalidAmount } from '../errors/invalid-amount';
import { isValidAmount } from '../utils/is-valid-amount';

export class UpdateProduct {
  constructor(
    private productRepository: ProductRepository,
    private bidRepository: BidRepository,
  ) {}

  async execute({ id, title, name, description, initialValue }: IUpdateProduct): Promise<IResponseProduct> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new productNotFound()
    }

    if (initialValue !== undefined) {
      if (!isValidAmount(initialValue)) {
        throw new invalidAmount()
      }

      if (await this.bidRepository.findHighestByProductId(id)) {
        throw new productHasBids()
      }
    }

    const updated = await this.productRepository.update(id, {
      title,
      name,
      description,
      initialValue
    })

    return { product: updated }
  }
}
