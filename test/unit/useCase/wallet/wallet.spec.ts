import { beforeEach, describe, expect, it } from "vitest";
import { GetWallet } from "@/useCase/wallet/get";
import { Deposit } from "@/useCase/wallet/deposit";
import { WalletRepositoryInMemory } from "@/repositories/in-memory/wallet-repository-in-memory";
import { invalidAmount } from "@/useCase/errors/invalid-amount";

let walletRepository: WalletRepositoryInMemory;

describe("Wallet use cases", () => {
  beforeEach(() => {
    walletRepository = new WalletRepositoryInMemory();
  });

  it("returns balance 0 for a user without a wallet", async () => {
    const { balance } = await new GetWallet(walletRepository).execute({ userId: "user-1" });

    expect(balance).toBe(0);
  });

  it("adds credits to the wallet", async () => {
    const deposit = new Deposit(walletRepository);

    await deposit.execute({ userId: "user-1", amount: 10000 });
    const { balance } = await deposit.execute({ userId: "user-1", amount: 2550 });

    expect(balance).toBe(12550);
    expect((await new GetWallet(walletRepository).execute({ userId: "user-1" })).balance).toBe(12550);
  });

  it("rejects a deposit that is not a positive integer", async () => {
    for (const amount of [0, -100, 10.5]) {
      await expect(() =>
        new Deposit(walletRepository).execute({ userId: "user-1", amount }),
      ).rejects.toBeInstanceOf(invalidAmount);
    }
  });
});
