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
