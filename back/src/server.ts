import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes";

const { CORS_ORIGIN, PORT } = process.env;

const app = express();

app.use(cors({ origin: CORS_ORIGIN || "*" }));
app.use(express.json());

app.use(routes);

app.listen(PORT || 3333, async () => {
  console.log("running on port 3333");
});

export default app;
