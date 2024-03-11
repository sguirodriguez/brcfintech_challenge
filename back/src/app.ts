import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes";
import userRoutes from "./routes/user";
import currencyRoutes from "./routes/currency";
import walletRoutes from "./routes/wallet";
import orderRoutes from "./routes/order";
import transactionRoutes from "./routes/transactions";
import configuration from "./config";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.use(cors({ origin: configuration.corsOrigin || "*" }));
app.use(express.json());

app.use(routes);
app.use("/user", userRoutes);
app.use("/currency", currencyRoutes);
app.use("/wallet", walletRoutes);
app.use("/order", orderRoutes);
app.use("/transaction", transactionRoutes);

const server = http.createServer(app);

const socketIo = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

export { server, socketIo };
