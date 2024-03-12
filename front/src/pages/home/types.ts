export interface Currency {
  id: number;
  name: string;
  description: string | null;
  symbol: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceTypes {
  id: number;
  userId: number;
  currencyId: number;
  balance: string;
  createdAt: string;
  updatedAt: string;
  currencies: Currency;
}

export interface ExchangeRates {
  usdToBitcoinRate: number;
  bitcoinToUsdRate: number;
}

export interface Order {
  id: number;
  currencyId: number;
  currencyAmount: number;
  amount: number;
  type: string;
  status: string;
}

export interface Transaction {
  id: number;
  walletSenderId: number;
  walletReceiverId: number;
  currencyId: number;
  amount: string;
  kind: "debit" | "credit";
  createdAt: string;
  updatedAt: string;
  currencies: any;
}
