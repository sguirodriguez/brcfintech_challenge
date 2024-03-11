const { Router } = require("express");
import { Request, Response } from "express";

import middlewareAuth from "../middleware/auth";
import userInfo from "../services/partners/userInfo";
import findTransactions from "../controllers/transaction/find";
import findAllTransactions from "../controllers/transaction/findAll";

const router = Router();

router.get("", middlewareAuth, async (request: Request, response: Response) => {
  try {
    const user = await userInfo.getUserInfoByToken(
      String(request.headers.authorization),
      response
    );

    const result = await findTransactions.execute({
      userId: user.id,
    });

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

router.get(
  "/all",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const user = await userInfo.getUserInfoByToken(
        String(request.headers.authorization),
        response
      );

      const result = await findAllTransactions.execute({
        userId: user.id,
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
