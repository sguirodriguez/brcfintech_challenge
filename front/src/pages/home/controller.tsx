import request from "utils/request/request";
import ScreenHome from "./screen";
import { useEffect, useState } from "react";

interface Currency {
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
const ControllerHome = () => {
  const [balances, setBalances] = useState<BalanceTypes[] | null>(null);
  const getUserBalances = async () => {
    const { data, error } = await request({
      method: "GET",
      path: "wallet/balances",
    });

    console.log("o que vem", data, error);

    if (error) {
      setBalances(null);
      return;
    }
    setBalances(data);
    return;
  };

  useEffect(() => {
    getUserBalances();
  }, []);

  const handlers: {
    balances: BalanceTypes[] | null;
  } = {
    balances,
  };
  return <ScreenHome handlers={handlers} />;
};

export default ControllerHome;
