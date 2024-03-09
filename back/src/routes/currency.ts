const { Router } = require("express");
import { Request, Response } from "express";
import createCurrency from "../controllers/currency/create";
import findCurrency from "../controllers/currency/find";
import updateCurrency from "../controllers/currency/update";
import deleteCurrency from "../controllers/currency/delete";

const router = Router();

router.post("", async (request: Request, response: Response) => {
  try {
    const { name, description, symbol, value } = request.body as {
      name: string;
      description: string;
      symbol: string;
      value: number;
    };

    const result = await createCurrency.execute({
      name,
      description,
      symbol,
      value,
    });

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

router.get("", async (request: Request, response: Response) => {
  try {
    const { id } = request.body as {
      id: number;
    };

    const result = await findCurrency.execute({
      id,
    });

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

router.put("", async (request: Request, response: Response) => {
  try {
    const { id, name, description, symbol, value } = request.body as {
      id: number;
      name: string;
      description: string;
      symbol: string;
      value: number;
    };

    const result = await updateCurrency.execute({
      id,
      name,
      description,
      symbol,
      value,
    });

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

router.delete("", async (request: Request, response: Response) => {
  try {
    const { id } = request.body as {
      id: number;
    };

    const result = await deleteCurrency.execute({
      id,
    });

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

export default router;
