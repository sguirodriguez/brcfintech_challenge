import { socketIo } from "./app";
import socketAuthMiddleware from "./middleware/socketAuth";

socketIo.on("connection", (socket) => {
  console.log("conectado");

  socket.on("disconnect", () => {
    console.log("desconetou");
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
