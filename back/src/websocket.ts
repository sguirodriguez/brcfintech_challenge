import { socketIo } from "./app";
import calculateExchange from "./controllers/order/calculateExchange";
import findAllOrders from "./controllers/order/findAllOrders";
import findOrders from "./controllers/order/find";
import makerOrder from "./controllers/order/makerOrder";
import socketAuthMiddleware from "./middleware/socketAuth";
import userInfo from "./services/partners/userInfo";

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

  socket.on("find_fee_exchange", async (data) => {
    const { response } = await calculateExchange.execute(data);

    socket.emit("fee_exchange_values", {
      data: response.data,
      error: response.error,
    });
  });

  socket.on("make_order", async (data) => {
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
      const { response } = await makerOrder.execute({
        ...data,
        userId: user?.id,
      });

      socket.emit("make_order_response", {
        data: response.data,
        error: response.error,
      });

      socketIo.emit("repeat_get_all_orders");
    }
  });

  socket.on("get_all_orders", async () => {
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
  });

  socket.on("get_my_orders", async () => {
    const authToken = socket.handshake.headers["authorization"];

    if (!authToken) {
      return socket.emit("get_my_orders_response", {
        error: "Não foi possível encontrar o usuário.",
      });
    }

    const user = await userInfo?.getUserInfoSocket(
      authToken,
      socket,
      "get_my_orders_response"
    );

    const { response } = await findOrders.execute(user.id);

    socket.emit("get_my_orders_response", {
      data: response.data,
      error: response.error,
    });
  });
});
