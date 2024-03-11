import request from "utils/request/request";
import ScreenHome from "./screen";
import { useEffect, useState } from "react";
import { useAuth } from "context/auth";
import { BalanceTypes, ExchangeRates, Order } from "./types";
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
  const [orders, setOrders] = useState<Order[] | null>(null);

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
      socketInstance.emit("get_all_orders");

      socketInstance.on("user_token", (data) => {
        setToken(data);
      });

      socketInstance.on("repeat_get_all_orders", () => {
        socketInstance.emit("get_all_orders");
      });

      socketInstance.on("get_all_orders_response", ({ data, error }) => {
        if (error) {
          setOrders(null);
          return toast.error(error);
        }

        setOrders(data);
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
    orders: Order[] | null;
  } = {
    balances,
    loadingBalances,
    exchangeRates,
    loadingRates,
    orders,
  };
  return <ScreenHome handlers={handlers} />;
};

export default ControllerHome;
