import { beforeEach, describe, expect, it } from "vitest";
import { DeleteProduct } from "@/useCase/product/delete";
import { ProductRepositoryInMemory } from "@/repositories/in-memory/product-repository-in-memory";
import { BidRepositoryInMemory } from "@/repositories/in-memory/bid-repository-in-memory";
import { WalletRepositoryInMemory } from "@/repositories/in-memory/wallet-repository-in-memory";
import { productNotFound } from "@/useCase/errors/product-not-found";
import { productHasBids } from "@/useCase/errors/product-has-bids";

let productRepository: ProductRepositoryInMemory;
let bidRepository: BidRepositoryInMemory;
let deleteProduct: DeleteProduct;

describe("DeleteProduct use case", () => {
  beforeEach(async () => {
    productRepository = new ProductRepositoryInMemory();
    bidRepository = new BidRepositoryInMemory(new WalletRepositoryInMemory());
    deleteProduct = new DeleteProduct(productRepository, bidRepository);

    await productRepository.create({
      id: "product-1",
      title: "Leilao de relogio",
      name: "Relogio",
      description: "Relogio antigo",
      initialValue: 15000,
    });
  });

  it("deletes a product", async () => {
    await deleteProduct.execute({ id: "product-1" });

    expect(productRepository.items).toHaveLength(0);
  });

  it("rejects when the product does not exist", async () => {
    await expect(() =>
      deleteProduct.execute({ id: "not-found" }),
    ).rejects.toBeInstanceOf(productNotFound);
  });

  it("rejects deleting a product that received bids", async () => {
    bidRepository.items.push({
      id: "bid-1",
      productId: "product-1",
      userId: "user-1",
      amount: 15000,
      createdAt: new Date(),
    });

    await expect(() =>
      deleteProduct.execute({ id: "product-1" }),
    ).rejects.toBeInstanceOf(productHasBids);
  });
});
