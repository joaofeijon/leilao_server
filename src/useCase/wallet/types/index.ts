export interface IGetWallet {
  userId: string;
}

export interface IDeposit {
  userId: string;
  amount: number;
}

export interface IResponseWallet {
  balance: number;
}
