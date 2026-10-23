import type { WalletRepository } from "@/repositories/wallet-repository";
import type { IGetWallet, IResponseWallet } from "./types";

export class GetWallet {
  constructor(private walletRepository: WalletRepository) {}

  async execute({ userId }: IGetWallet): Promise<IResponseWallet> {
    const wallet = await this.walletRepository.findByUserId(userId)

    return { balance: wallet?.balance ?? 0 }
  }
}
