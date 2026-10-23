import { beforeEach, describe, expect, it } from "vitest";
import { CreateProduct } from "@/useCase/product/create";
import { ProductRepositoryInMemory } from "@/repositories/in-memory/product-repository-in-memory";
import { invalidAmount } from "@/useCase/errors/invalid-amount";

let productRepository: ProductRepositoryInMemory;
let createProduct: CreateProduct;

describe("CreateProduct use case", () => {
  beforeEach(() => {
    productRepository = new ProductRepositoryInMemory();
    createProduct = new CreateProduct(productRepository);
  });

  it("creates a product", async () => {
    const { product } = await createProduct.execute({
      title: "Leilao de relogio",
      name: "Relogio",
      description: "Relogio antigo",
      initialValue: 15000,
    });

    expect(product.id).toEqual(expect.any(String));
    expect(productRepository.items).toHaveLength(1);
    expect(productRepository.items[0].initialValue).toBe(15000);
  });

  it("rejects an initial value that is not a positive integer", async () => {
    for (const initialValue of [0, -100, 10.5]) {
      await expect(() =>
        createProduct.execute({
          title: "Leilao de relogio",
          name: "Relogio",
          description: "Relogio antigo",
          initialValue,
        }),
      ).rejects.toBeInstanceOf(invalidAmount);
    }
  });
});
