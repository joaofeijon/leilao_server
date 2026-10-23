import { randomUUID } from "node:crypto";
import { Wallet } from "@prisma/client";
import { WalletRepository } from "../wallet-repository";

export class WalletRepositoryInMemory implements WalletRepository {
  public items: Wallet[] = [];

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = this.items.find((item) => item.userId === userId);

    return wallet || null;
  }

  async deposit(userId: string, amount: number): Promise<Wallet> {
    let wallet = await this.findByUserId(userId);

    if (!wallet) {
      wallet = { id: randomUUID(), userId, balance: 0 };
      this.items.push(wallet);
    }

    wallet.balance += amount;

    return wallet;
  }
}
