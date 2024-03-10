import request from "utils/request/request";
import ScreenHome from "./screen";
import { useEffect, useState } from "react";
import { useAuth } from "context/auth";
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
  const [token, setToken] = useState("");
  const { socketInstance } = useAuth();
  const [balances, setBalances] = useState<BalanceTypes[] | null>(null);
  const [loadingBalances, setLoadingBalances] = useState(false);

  const getUserBalances = async (token: string) => {
    setLoadingBalances(true);
    const { data, error } = await request({
      method: "GET",
      path: "wallet/balances",
      headers: {
        Authorization: token,
      },
    });
    setLoadingBalances(false);

    if (error) {
      setBalances(null);
      return;
    }

    setBalances(data);
    return;
  };

  useEffect(() => {
    if (socketInstance) {
      socketInstance.on("user_token", (data) => {
        setToken(data);
      });
    }
  }, [socketInstance]);

  useEffect(() => {
    if (token) {
      getUserBalances(token);
    }
  }, [token]);

  const handlers: {
    balances: BalanceTypes[] | null;
    loadingBalances: boolean;
  } = {
    balances,
    loadingBalances,
  };
  return <ScreenHome handlers={handlers} />;
};

export default ControllerHome;
