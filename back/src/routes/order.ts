const { Router } = require("express");
import { Request, Response } from "express";
import middlewareAuth from "../middleware/auth";
import calculateExchange from "../controllers/order/calculateExchange";
import exchangeRate from "../controllers/order/exchangeRate";

const router = Router();

router.get(
  "/exchange/calculate",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const {
        coinSender,
        coinReceiver,
        valueCoinSender,
        valueCoinReceiver,
        type,
      } = request.body as {
        coinSender: "BTC" | "USD";
        coinReceiver: "BTC" | "USD";
        valueCoinSender: string;
        valueCoinReceiver: string;
        type: "buy" | "sell";
      };

      const result = await calculateExchange.execute({
        coinSender,
        coinReceiver,
        valueCoinSender,
        valueCoinReceiver,
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

export default router;
