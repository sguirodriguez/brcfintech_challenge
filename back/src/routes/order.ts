const { Router } = require("express");
import { Request, Response } from "express";
import middlewareAuth from "../middleware/auth";
import calculateExchange from "../controllers/order/calculateExchange";
import exchangeRate from "../controllers/order/exchangeRate";
import makerOrder from "../controllers/order/makerOrder";
import findAllOrders from "../controllers/order/findAllOrders";
import findOrders from "../controllers/order/find";
import deleteOrder from "../controllers/order/delete";
import userInfo from "../services/partners/userInfo";
import completeOrder from "../controllers/order/completeOrder";

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

      const user = await userInfo.getUserInfoByToken(
        String(request.headers.authorization),
        response
      );

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

router.get(
  "/all",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const user = await userInfo.getUserInfoByToken(
        String(request.headers.authorization),
        response
      );

      const result = await findAllOrders.execute(user.id);

      return response.status(result.status).send(result.response);
    } catch (error) {
      return response.status(500).json({
        error,
      });
    }
  }
);

router.get("", middlewareAuth, async (request: Request, response: Response) => {
  try {
    const user = await userInfo.getUserInfoByToken(
      String(request.headers.authorization),
      response
    );

    const result = await findOrders.execute(user.id);

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

router.delete(
  "",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const { orderId } = request.body as {
        orderId: number;
      };

      const result = await deleteOrder.execute(orderId);

      return response.status(result.status).send(result.response);
    } catch (error) {
      return response.status(500).json({
        error,
      });
    }
  }
);

router.post(
  "/complete",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const { orderId, amount, coin, type } = request.body as {
        orderId: number;
        amount: number;
        coin: "BTC" | "USD";
        type: "buy" | "sell";
      };

      const user = await userInfo.getUserInfoByToken(
        String(request.headers.authorization),
        response
      );

      const result = await completeOrder.execute({
        userId: user.id,
        orderId,
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
