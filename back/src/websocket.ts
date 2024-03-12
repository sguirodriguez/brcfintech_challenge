import { socketIo } from "./app";
import calculateExchange from "./controllers/order/calculateExchange";
import findAllOrders from "./controllers/order/findAllOrders";
import findOrders from "./controllers/order/find";
import deleteOrder from "./controllers/order/delete";
import socketAuthMiddleware from "./middleware/socketAuth";
import userInfo from "./services/partners/userInfo";
import findUserBalances from "./controllers/wallets/findUserBalances";
import findAllTransactions from "./controllers/transaction/findAll";
import findTransactions from "./controllers/transaction/find";
import Redis from "ioredis";
import redisAction from "./services/adapters/redis";

export const redis = new Redis(
  "redis://default:97c95ee1355b47458b1c93b5e5a73dc4@precious-mayfly-45394.upstash.io:45394"
);

redis.on("connect", () => {
  console.log("conectado ao servidor Redis");
});

redis.on("error", (error) => {
  console.error("erro ao conectar ao servidor Redis:", error);
});

socketIo.use((socket, next) => {
  socketAuthMiddleware(socket, (error) => {
    if (error) {
      return next(error);
    }
    next();
  });
});

socketIo.on("connection", (socket) => {
  console.log("conectado");

  socket.on("disconnect", () => {
    console.log("desconetou");
  });

  socket.on("get_user_balances", async () => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("get_user_balances_response", {
          error: "Não foi possível encontrar o usuário.",
        });
      }

      const user = await userInfo?.getUserInfoSocket(
        authToken,
        socket,
        "get_user_balances_response"
      );

      const { response } = await findUserBalances.execute({ userId: user.id });

      socket.emit("get_user_balances_response", {
        data: response.data,
        error: response.error,
      });
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("find_fee_exchange", async (data) => {
    try {
      const { response } = await calculateExchange.execute(data);

      socket.emit("fee_exchange_values", {
        data: response.data,
        error: response.error,
      });
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("make_order", async (data) => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("make_order_response", {
          error: "Não foi possível encontrar o usuário, faça login novamente.",
        });
      }

      const user = await userInfo.getUserInfoSocket(
        authToken,
        socket,
        "make_order_response"
      );

      if (user?.id) {
        await redisAction.addToOrderQueue({
          amount: data.amount,
          coin: data.coin,
          type: data.type,
          userId: user.id,
          typeFunction: "make",
        });

        socket.emit("make_order_response", {
          data: true,
          error: false,
        });
      }
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("complete_order", async (data) => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("complete_order_response", {
          error: "Não foi possível encontrar o usuário, faça login novamente.",
        });
      }

      const user = await userInfo.getUserInfoSocket(
        authToken,
        socket,
        "complete_order_response"
      );

      if (user?.id) {
        await redisAction.addToOrderQueue({
          amount: data.amount,
          coin: data.coin,
          type: data.type,
          userId: user.id,
          typeFunction: "complete",
          orderId: data.orderId,
        });

        socket.emit("complete_order_response", {
          data: true,
          error: false,
        });
      }
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("get_all_orders", async () => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("get_all_orders_response", {
          error: "Não foi possível encontrar o usuário.",
        });
      }

      const user = await userInfo?.getUserInfoSocket(
        authToken,
        socket,
        "get_all_orders_response"
      );

      const { response } = await findAllOrders.execute(user.id);

      socket.emit("get_all_orders_response", {
        data: response.data,
        error: response.error,
      });
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("my_orders", async () => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("my_orders_response", {
          error: "Não foi possível encontrar o usuário.",
        });
      }

      const user = await userInfo?.getUserInfoSocket(
        authToken,
        socket,
        "my_orders_response"
      );

      const { response } = await findOrders.execute(user.id);

      socket.emit("my_orders_response", {
        data: response.data,
        error: response.error,
      });
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("delete_my_order", async ({ orderId }) => {
    try {
      if (!orderId) {
        return socket.emit("delete_my_order_response", {
          error: "É necessário uma ordem para deletar.",
        });
      }

      const { response } = await deleteOrder.execute(orderId);

      socket.emit("delete_my_order_response", {
        data: response.data,
        error: response.error,
      });

      socketIo.emit("repeat_get_my_orders");
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("get_all_transactions", async () => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("get_all_transactions_response", {
          error: "Não foi possível encontrar o usuário.",
        });
      }

      const user = await userInfo?.getUserInfoSocket(
        authToken,
        socket,
        "get_all_transactions_response"
      );

      const { response } = await findAllTransactions.execute({
        userId: user.id,
      });

      socket.emit("get_all_transactions_response", {
        data: response.data,
        error: response.error,
      });
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });

  socket.on("get_my_transactions", async () => {
    try {
      const authToken = socket.handshake.headers["authorization"];

      if (!authToken) {
        return socket.emit("get_my_transactions_response", {
          error: "Não foi possível encontrar o usuário.",
        });
      }

      const user = await userInfo?.getUserInfoSocket(
        authToken,
        socket,
        "get_my_transactions_response"
      );

      const { response } = await findTransactions.execute({
        userId: user.id,
      });

      socket.emit("get_my_transactions_response", {
        data: response.data,
        error: response.error,
      });
    } catch (error) {
      console.log("SOCKET ERROR:", error);
    }
  });
});
