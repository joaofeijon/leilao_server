import { randomUUID } from "node:crypto";
import { Bid } from "@prisma/client";
import { BidRepository, IPlaceBid } from "../bid-repository";
import { WalletRepositoryInMemory } from "./wallet-repository-in-memory";
import { insufficientBalance } from "@/useCase/errors/insufficient-balance";

export class BidRepositoryInMemory implements BidRepository {
  public items: Bid[] = [];

  constructor(private walletRepository: WalletRepositoryInMemory) {}

  async findHighestByProductId(productId: string): Promise<Bid | null> {
    const bids = await this.findManyByProductId(productId);

    return bids[0] || null;
  }

  async findManyByProductId(productId: string): Promise<Bid[]> {
    return this.items
      .filter((item) => item.productId === productId)
      .sort((a, b) => b.amount - a.amount);
  }

  async placeBid({ productId, userId, amount, previousBid }: IPlaceBid): Promise<Bid> {
    if (previousBid) {
      await this.walletRepository.deposit(previousBid.userId, previousBid.amount);
    }

    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet || wallet.balance < amount) {
      throw new insufficientBalance();
    }

    wallet.balance -= amount;

    const bid: Bid = {
      id: randomUUID(),
      productId,
      userId,
      amount,
      createdAt: new Date(),
    };

    this.items.push(bid);

    return bid;
  }
}
