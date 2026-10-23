import type { ProductRepository } from "@/repositories/product-repository";
import type { WalletRepository } from "@/repositories/wallet-repository";
import type { BidRepository } from "@/repositories/bid-repository";
import type { IPlaceBidRequest, IResponsePlaceBid } from "./types";
import { productNotFound } from '../errors/product-not-found';
import { bidTooLow } from '../errors/bid-too-low';
import { insufficientBalance } from '../errors/insufficient-balance';
import { invalidAmount } from '../errors/invalid-amount';
import { isValidAmount } from '../utils/is-valid-amount';

export class PlaceBid {
  constructor(
    private productRepository: ProductRepository,
    private walletRepository: WalletRepository,
    private bidRepository: BidRepository,
  ) {}

  async execute({ productId, userId, amount }: IPlaceBidRequest): Promise<IResponsePlaceBid> {
    if (!isValidAmount(amount)) {
      throw new invalidAmount()
    }

    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new productNotFound()
    }

    const previousBid = await this.bidRepository.findHighestByProductId(productId)

    // primeiro lance pode ser igual ao valor inicial, os seguintes precisam superar o maior lance
    if (previousBid ? amount <= previousBid.amount : amount < product.initialValue) {
      throw new bidTooLow()
    }

    const wallet = await this.walletRepository.findByUserId(userId)

    // se o usuario ja e o maior lance, o valor que esta retido volta antes do novo debito
    const heldByUser = previousBid?.userId === userId ? previousBid.amount : 0
    const available = (wallet?.balance ?? 0) + heldByUser

    if (available < amount) {
      throw new insufficientBalance()
    }

    const bid = await this.bidRepository.placeBid({ productId, userId, amount, previousBid })

    return { bid }
  }
}
