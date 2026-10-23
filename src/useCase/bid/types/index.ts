import type { Bid } from "@prisma/client";

export interface IPlaceBidRequest {
  productId: string;
  userId: string;
  amount: number;
}

export interface IListBids {
  productId: string;
}

export interface IResponsePlaceBid {
  bid: Bid;
}

export interface IResponseListBids {
  bids: Bid[];
}
