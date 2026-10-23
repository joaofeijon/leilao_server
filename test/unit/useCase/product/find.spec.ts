import { beforeEach, describe, expect, it } from "vitest";
import { GetProduct } from "@/useCase/product/get";
import { ListProducts } from "@/useCase/product/list";
import { ProductRepositoryInMemory } from "@/repositories/in-memory/product-repository-in-memory";
import { productNotFound } from "@/useCase/errors/product-not-found";

let productRepository: ProductRepositoryInMemory;

describe("GetProduct / ListProducts use cases", () => {
  beforeEach(async () => {
    productRepository = new ProductRepositoryInMemory();

    await productRepository.create({
      id: "product-1",
      title: "Leilao de relogio",
      name: "Relogio",
      description: "Relogio antigo",
      initialValue: 15000,
    });
  });

  it("gets a product by id", async () => {
    const { product } = await new GetProduct(productRepository).execute({ id: "product-1" });

    expect(product.name).toBe("Relogio");
  });

  it("rejects when the product does not exist", async () => {
    await expect(() =>
      new GetProduct(productRepository).execute({ id: "not-found" }),
    ).rejects.toBeInstanceOf(productNotFound);
  });

  it("lists products", async () => {
    const { products } = await new ListProducts(productRepository).execute();

    expect(products).toHaveLength(1);
  });
});
