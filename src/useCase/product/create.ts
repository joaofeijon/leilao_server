import type { ProductRepository } from "@/repositories/product-repository";
import type { ICreateProduct, IResponseProduct } from "./types";
import { invalidAmount } from '../errors/invalid-amount';
import { isValidAmount } from '../utils/is-valid-amount';

export class CreateProduct {
  constructor(private productRepository: ProductRepository) {}

  async execute({ title, name, description, initialValue }: ICreateProduct): Promise<IResponseProduct> {
    if (!isValidAmount(initialValue)) {
      throw new invalidAmount()
    }

    const product = await this.productRepository.create({
      title,
      name,
      description,
      initialValue
    })

    return { product }
  }
}
