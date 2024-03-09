import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes";
import userRoutes from "./routes/user";
import currencyRoutes from "./routes/currency";
import walletRoutes from "./routes/wallet";
import configuration from "./config";
import { Server } from "socket.io";

const app = express();

app.use(cors({ origin: configuration.corsOrigin || "*" }));
app.use(express.json());

app.use(routes);
app.use("/user", userRoutes);
app.use("/currency", currencyRoutes);
app.use("/wallet", walletRoutes);

const server = app.listen(configuration.port || 3333, async () => {
  console.log("running on port 3333");
});

const socketIo = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  console.log("conectou no socket io");

  socket.on("disconnect", () => {
    console.log("desconetou");
  });

  socket.on("login", (message) => {
    console.log("o que vem", message);
  });
});

export default server;
