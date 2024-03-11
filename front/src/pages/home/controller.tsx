import request from "utils/request/request";
import ScreenHome from "./screen";
import { useEffect, useState } from "react";
import { useAuth } from "context/auth";
import { BalanceTypes, ExchangeRates } from "./types";
import { toast } from "react-toastify";

const ControllerHome = () => {
  const [token, setToken] = useState("");
  const { socketInstance } = useAuth();
  const [balances, setBalances] = useState<BalanceTypes[] | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null
  );
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);

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
      return toast.error(error);
    }

    setBalances(data);
    return;
  };

  const getExchangeRates = async (token: string) => {
    setLoadingRates(true);
    const { data, error } = await request({
      method: "GET",
      path: "order/exchange/rate",
      headers: {
        Authorization: token,
      },
    });
    setLoadingRates(false);

    if (error) {
      setExchangeRates(null);
      return toast.error(error);
    }

    setExchangeRates(data);
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
      getExchangeRates(token);
    }
  }, [token]);

  const handlers: {
    balances: BalanceTypes[] | null;
    loadingBalances: boolean;
    exchangeRates: ExchangeRates | null;
    loadingRates: boolean;
  } = {
    balances,
    loadingBalances,
    exchangeRates,
    loadingRates,
  };
  return <ScreenHome handlers={handlers} />;
};

export default ControllerHome;
