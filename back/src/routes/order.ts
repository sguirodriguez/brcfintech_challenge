const { Router } = require("express");
import { Request, Response } from "express";
import middlewareAuth from "../middleware/auth";
import calculateExchange from "../controllers/order/calculateExchange";
import exchangeRate from "../controllers/order/exchangeRate";
import makerOrder from "../controllers/order/makerOrder";
import Users from "../database/models/users";

const router = Router();

router.get(
  "/exchange/calculate",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const { value, coin, type } = request.body as {
        value: number;
        coin: "BTC" | "USD";
        type: "buy" | "sell";
      };

      const result = await calculateExchange.execute({
        value,
        coin,
        type,
      });

      return response.status(result.status).send(result.response);
    } catch (error) {
      return response.status(500).json({
        error,
      });
    }
  }
);

router.get(
  "/exchange/rate",
  middlewareAuth,
  async (_request: Request, response: Response) => {
    try {
      const result = await exchangeRate.execute();

      return response.status(result.status).send(result.response);
    } catch (error) {
      return response.status(500).json({
        error,
      });
    }
  }
);

router.post(
  "",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const { amount, coin, type } = request.body as {
        amount: number;
        coin: "BTC" | "USD";
        type: "buy" | "sell";
      };

      const authToken = request.headers.authorization;
      const token = authToken?.split(" ");

      if (!authToken) {
        return response
          .status(401)
          .json({ error: "Erro ao autenticar, faça login novamente." });
      }

      const user = await Users.findOne({
        where: {
          token: token?.[1],
        },
      });

      if (!user) {
        return response
          .status(500)
          .json({ error: "Erro ao encontrar usuário." });
      }

      const result = await makerOrder.execute({
        userId: user?.id,
        amount,
        coin,
        type,
      });

      return response.status(result.status).send(result.response);
    } catch (error) {
      return response.status(500).json({
        error,
      });
    }
  }
);

export default router;
