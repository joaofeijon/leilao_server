import { beforeEach, describe, expect, it } from "vitest";
import { PlaceBid } from "@/useCase/bid/place";
import { ListBids } from "@/useCase/bid/list";
import { ProductRepositoryInMemory } from "@/repositories/in-memory/product-repository-in-memory";
import { WalletRepositoryInMemory } from "@/repositories/in-memory/wallet-repository-in-memory";
import { BidRepositoryInMemory } from "@/repositories/in-memory/bid-repository-in-memory";
import { productNotFound } from "@/useCase/errors/product-not-found";
import { bidTooLow } from "@/useCase/errors/bid-too-low";
import { insufficientBalance } from "@/useCase/errors/insufficient-balance";
import { invalidAmount } from "@/useCase/errors/invalid-amount";

let productRepository: ProductRepositoryInMemory;
let walletRepository: WalletRepositoryInMemory;
let bidRepository: BidRepositoryInMemory;
let placeBid: PlaceBid;

const balanceOf = async (userId: string) =>
  (await walletRepository.findByUserId(userId))?.balance ?? 0;

describe("PlaceBid use case", () => {
  beforeEach(async () => {
    productRepository = new ProductRepositoryInMemory();
    walletRepository = new WalletRepositoryInMemory();
    bidRepository = new BidRepositoryInMemory(walletRepository);
    placeBid = new PlaceBid(productRepository, walletRepository, bidRepository);

    await productRepository.create({
      id: "product-1",
      title: "Leilao de relogio",
      name: "Relogio",
      description: "Relogio antigo",
      initialValue: 10000,
    });

    await walletRepository.deposit("user-1", 50000);
    await walletRepository.deposit("user-2", 50000);
  });

  it("places the first bid and debits the wallet", async () => {
    const { bid } = await placeBid.execute({ productId: "product-1", userId: "user-1", amount: 10000 });

    expect(bid.amount).toBe(10000);
    expect(await balanceOf("user-1")).toBe(40000);
  });

  it("rejects a first bid below the initial value", async () => {
    await expect(() =>
      placeBid.execute({ productId: "product-1", userId: "user-1", amount: 9999 }),
    ).rejects.toBeInstanceOf(bidTooLow);
  });

  it("rejects a bid that is not higher than the current highest bid", async () => {
    await placeBid.execute({ productId: "product-1", userId: "user-1", amount: 12000 });

    await expect(() =>
      placeBid.execute({ productId: "product-1", userId: "user-2", amount: 12000 }),
    ).rejects.toBeInstanceOf(bidTooLow);
  });

  it("refunds the previous highest bidder when outbid", async () => {
    await placeBid.execute({ productId: "product-1", userId: "user-1", amount: 12000 });
    await placeBid.execute({ productId: "product-1", userId: "user-2", amount: 15000 });

    expect(await balanceOf("user-1")).toBe(50000);
    expect(await balanceOf("user-2")).toBe(35000);
  });

  it("lets the highest bidder raise their own bid using the amount already held", async () => {
    await placeBid.execute({ productId: "product-1", userId: "user-1", amount: 40000 });
    await placeBid.execute({ productId: "product-1", userId: "user-1", amount: 50000 });

    expect(await balanceOf("user-1")).toBe(0);
  });

  it("rejects a bid higher than the wallet balance", async () => {
    await expect(() =>
      placeBid.execute({ productId: "product-1", userId: "user-1", amount: 50001 }),
    ).rejects.toBeInstanceOf(insufficientBalance);
  });

  it("rejects a bid from a user without a wallet", async () => {
    await expect(() =>
      placeBid.execute({ productId: "product-1", userId: "user-3", amount: 10000 }),
    ).rejects.toBeInstanceOf(insufficientBalance);
  });

  it("rejects a bid on a product that does not exist", async () => {
    await expect(() =>
      placeBid.execute({ productId: "not-found", userId: "user-1", amount: 10000 }),
    ).rejects.toBeInstanceOf(productNotFound);
  });

  it("rejects an amount that is not a positive integer", async () => {
    await expect(() =>
      placeBid.execute({ productId: "product-1", userId: "user-1", amount: 10000.5 }),
    ).rejects.toBeInstanceOf(invalidAmount);
  });

  it("lists the bids of a product from highest to lowest", async () => {
    await placeBid.execute({ productId: "product-1", userId: "user-1", amount: 12000 });
    await placeBid.execute({ productId: "product-1", userId: "user-2", amount: 15000 });

    const { bids } = await new ListBids(productRepository, bidRepository).execute({ productId: "product-1" });

    expect(bids.map((bid) => bid.amount)).toEqual([15000, 12000]);
  });
});
