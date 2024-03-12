import request from "utils/request/request";
import ScreenHome from "./screen";
import { useEffect, useState } from "react";
import { useAuth } from "context/auth";
import { BalanceTypes, ExchangeRates, Order, Transaction } from "./types";
import { toast } from "react-toastify";

const ControllerHome = () => {
  const [token, setToken] = useState("");
  const { socketInstance } = useAuth();
  const [balances, setBalances] = useState<BalanceTypes[] | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null
  );
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingRates, setLoadingRates] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [myOrders, setMyOrders] = useState<Order[] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [transactions, setTransaction] = useState<Transaction[] | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [myTransactions, setMyTransactions] = useState<Transaction[] | null>(
    null
  );

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

  const handleDeleteOrder = (orderId: number) => {
    if (!orderId) {
      return toast.error("é necessário selecionar uma ordem.");
    }
    socketInstance.emit("delete_my_order", { orderId });
  };

  const handleCompleteOrder = (payload: {
    amount: number;
    coin: "BTC" | "USD";
    type: string;
    orderId: number;
  }) => {
    if (!payload.orderId) {
      return toast.error("é necessário selecionar uma ordem.");
    }

    socketInstance.emit("complete_order", { ...payload });
  };

  useEffect(() => {
    if (socketInstance) {
      socketInstance.on("user_token", (data) => {
        setToken(data);
      });
      socketInstance.emit("get_user_balances");
      socketInstance.emit("get_all_orders");
      socketInstance.emit("my_orders");
      socketInstance.emit("get_all_transactions");
      socketInstance.emit("get_my_transactions");

      socketInstance.on("repeat_get_all_orders", () => {
        setLoadingTransactions(true);
        socketInstance.emit("get_all_orders");
      });

      socketInstance.on("repeat_get_my_orders", () => {
        socketInstance.emit("my_orders");
      });

      socketInstance.on("repeat_get_transactions", () => {
        socketInstance.emit("get_all_transactions");
        socketInstance.emit("get_my_transactions");
      });

      socketInstance.on("repeat_get_balances", () => {
        setLoadingBalances(true);
        socketInstance.emit("get_user_balances");
      });

      socketInstance.on("get_user_balances_response", ({ data, error }) => {
        setLoadingBalances(false);
        if (error) {
          setBalances(null);
          return toast.error(error);
        }

        setBalances(data);
      });

      socketInstance.on("get_all_orders_response", ({ data, error }) => {
        setLoadingOrders(false);
        if (error) {
          setOrders(null);
          return toast.error(error);
        }

        setOrders(data);
      });

      socketInstance.on("my_orders_response", ({ data, error }) => {
        setLoadingOrders(false);
        if (error) {
          setMyOrders(null);
          return toast.error(error);
        }

        setMyOrders(data);
      });

      socketInstance.on("delete_my_order_response", ({ error }) => {
        if (error) {
          return toast.error(error);
        }

        return toast.success("Ordem cancelada.");
      });

      socketInstance.on("complete_order_response", ({ error }) => {
        if (error) {
          return toast.error(error);
        }

        return toast.success("Ordem colocada na fila com sucesso.");
      });

      socketInstance.on("get_all_transactions_response", ({ data, error }) => {
        setLoadingTransactions(false);
        if (error) {
          setTransaction(null);
          return toast.error(error);
        }

        setTransaction(data);
      });

      socketInstance.on("get_my_transactions_response", ({ data, error }) => {
        setLoadingTransactions(false);
        if (error) {
          setMyTransactions(null);
          return toast.error(error);
        }

        setMyTransactions(data);
      });

      socketInstance.on("get_response_completed_order", ({ error }) => {
        if (error) {
          return toast.error(error);
        }

        return toast.success("Ordem executada com sucesso.");
      });

      socketInstance.on("make_order_executed", ({ error }) => {
        if (error) {
          return toast.error(error);
        }

        return toast.success("Ordem criada com sucesso.");
      });
    }

    if (!socketInstance) return;
  }, [socketInstance]);

  useEffect(() => {
    if (token) {
      getExchangeRates(token);
    }
  }, [token]);

  const handlers: {
    balances: BalanceTypes[] | null;
    loadingBalances: boolean;
    exchangeRates: ExchangeRates | null;
    loadingRates: boolean;
    orders: Order[] | null;
    loadingOrders: boolean;
    myOrders: Order[] | null;
    handleDeleteOrder: (orderId: number) => void;
    handleCompleteOrder: (payload: {
      amount: number;
      coin: "BTC" | "USD";
      type: "buy" | "sell";
      orderId: number;
    }) => void;
    transactions: Transaction[] | null;
    loadingTransactions: boolean;
    myTransactions: Transaction[] | null;
  } = {
    balances,
    loadingBalances,
    exchangeRates,
    loadingRates,
    orders,
    loadingOrders,
    myOrders,
    handleDeleteOrder,
    handleCompleteOrder,
    transactions,
    loadingTransactions,
    myTransactions,
  };
  return <ScreenHome handlers={handlers} />;
};

export default ControllerHome;
