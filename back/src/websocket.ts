import { socketIo } from "./app";
import calculateExchange from "./controllers/order/calculateExchange";
import makerOrder from "./controllers/order/makerOrder";
import Users from "./database/models/users";
import socketAuthMiddleware from "./middleware/socketAuth";

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
    const token = authToken?.split(" ");

    if (!authToken) {
      return socket.emit("make_order_response", {
        error: "Não foi possível encontrar o usuário.",
      });
    }

    const user = await Users.findOne({
      where: {
        token: token?.[1],
      },
    });

    if (!user) {
      return socket.emit("make_order_response", {
        error: "Não foi possível encontrar o usuário.",
      });
    }

    const { response } = await makerOrder.execute({
      ...data,
      userId: user?.id,
    });

    socket.emit("make_order_response", {
      data: response.data,
      error: response.error,
    });
  });
});

socketIo.use((socket, next) => {
  socketAuthMiddleware(socket, (error) => {
    if (error) {
      return next(error);
    }
    next();
  });
});
