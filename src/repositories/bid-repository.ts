import { Bid } from "@prisma/client"

export interface IPlaceBid {
  productId: string
  userId: string
  amount: number
  // lance que esta sendo superado, o valor dele volta para a carteira do dono
  previousBid: Bid | null
}

export interface BidRepository {
  findHighestByProductId(productId: string): Promise<Bid | null>
  findManyByProductId(productId: string): Promise<Bid[]>
  placeBid(data: IPlaceBid): Promise<Bid>
}
