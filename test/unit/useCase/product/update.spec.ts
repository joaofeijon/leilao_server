import { beforeEach, describe, expect, it } from "vitest";
import { UpdateProduct } from "@/useCase/product/update";
import { ProductRepositoryInMemory } from "@/repositories/in-memory/product-repository-in-memory";
import { BidRepositoryInMemory } from "@/repositories/in-memory/bid-repository-in-memory";
import { WalletRepositoryInMemory } from "@/repositories/in-memory/wallet-repository-in-memory";
import { productNotFound } from "@/useCase/errors/product-not-found";
import { productHasBids } from "@/useCase/errors/product-has-bids";
import { invalidAmount } from "@/useCase/errors/invalid-amount";

let productRepository: ProductRepositoryInMemory;
let bidRepository: BidRepositoryInMemory;
let updateProduct: UpdateProduct;

describe("UpdateProduct use case", () => {
  beforeEach(async () => {
    productRepository = new ProductRepositoryInMemory();
    bidRepository = new BidRepositoryInMemory(new WalletRepositoryInMemory());
    updateProduct = new UpdateProduct(productRepository, bidRepository);

    await productRepository.create({
      id: "product-1",
      title: "Leilao de relogio",
      name: "Relogio",
      description: "Relogio antigo",
      initialValue: 15000,
    });
  });

  it("updates only the fields sent", async () => {
    const { product } = await updateProduct.execute({
      id: "product-1",
      description: "Relogio antigo de bolso",
    });

    expect(product.description).toBe("Relogio antigo de bolso");
    expect(product.name).toBe("Relogio");
  });

  it("rejects when the product does not exist", async () => {
    await expect(() =>
      updateProduct.execute({ id: "not-found", name: "Outro" }),
    ).rejects.toBeInstanceOf(productNotFound);
  });

  it("rejects an invalid initial value", async () => {
    await expect(() =>
      updateProduct.execute({ id: "product-1", initialValue: 0 }),
    ).rejects.toBeInstanceOf(invalidAmount);
  });

  it("rejects changing the initial value after the product received bids", async () => {
    bidRepository.items.push({
      id: "bid-1",
      productId: "product-1",
      userId: "user-1",
      amount: 15000,
      createdAt: new Date(),
    });

    await expect(() =>
      updateProduct.execute({ id: "product-1", initialValue: 20000 }),
    ).rejects.toBeInstanceOf(productHasBids);
  });
});
