import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes";
import userRoutes from "./routes/user";
import currencyRoutes from "./routes/currency";

const { CORS_ORIGIN, PORT } = process.env;

const app = express();

app.use(cors({ origin: CORS_ORIGIN || "*" }));
app.use(express.json());

app.use(routes);
app.use("/user", userRoutes);
app.use("/currency", currencyRoutes);

app.listen(PORT || 3333, async () => {
  console.log("running on port 3333");
});

export default app;
