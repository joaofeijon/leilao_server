import type { WalletRepository } from "@/repositories/wallet-repository";
import type { IDeposit, IResponseWallet } from "./types";
import { invalidAmount } from '../errors/invalid-amount';
import { isValidAmount } from '../utils/is-valid-amount';

export class Deposit {
  constructor(private walletRepository: WalletRepository) {}

  async execute({ userId, amount }: IDeposit): Promise<IResponseWallet> {
    if (!isValidAmount(amount)) {
      throw new invalidAmount()
    }

    const wallet = await this.walletRepository.deposit(userId, amount)

    return { balance: wallet.balance }
  }
}
