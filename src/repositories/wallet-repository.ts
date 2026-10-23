import { Wallet } from "@prisma/client"

export interface WalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>
  deposit(userId: string, amount: number): Promise<Wallet>
}
