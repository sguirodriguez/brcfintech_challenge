import { socketIo } from "./app";
import calculateExchange from "./controllers/order/calculateExchange";
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
});

socketIo.use((socket, next) => {
  socketAuthMiddleware(socket, (error) => {
    if (error) {
      return next(error);
    }
    next();
  });
});
