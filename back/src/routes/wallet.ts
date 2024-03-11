import { Request, Response, Router } from "express";
import middlewareAuth from "../middleware/auth";
import createWallet from "../controllers/wallets/create";
import findWallet from "../controllers/wallets/find";
import updateWallet from "../controllers/wallets/update";
import deleteWallet from "../controllers/wallets/delete";
import findUserBalances from "../controllers/wallets/findUserBalances";

const router = Router();

router.post("", async (request: Request, response: Response) => {
  try {
    const { userId, currencyId, balance } = request.body as {
      userId: number;
      currencyId: number;
      balance: number;
    };

    const result = await createWallet.execute({
      userId,
      currencyId,
      balance,
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

    const result = await findWallet.execute({
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
    const { id, balance } = request.body as {
      id: number;
      balance: number;
    };

    const result = await updateWallet.execute({
      id,
      balance,
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

    const result = await deleteWallet.execute({
      id,
    });

    return response.status(result.status).send(result.response);
  } catch (error) {
    return response.status(500).json({
      error,
    });
  }
});

router.get(
  "/balances",
  middlewareAuth,
  async (request: Request, response: Response) => {
    try {
      const token = request.headers.authorization as string;

      const result = await findUserBalances.execute({
        token,
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
