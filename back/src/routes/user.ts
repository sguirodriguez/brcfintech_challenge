const { Router } = require("express");
import { Request, Response } from "express";
import createUser from "../controllers/user/create";
import findUser from "../controllers/user/find";
import updateUser from "../controllers/user/update";
import deleteUser from "../controllers/user/delete";
const router = Router();

router.post("", async (request: Request, response: Response) => {
  try {
    const { username } = request.body as {
      username: string;
    };

    const result = await createUser.execute({
      username,
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

    const result = await findUser.execute({
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
    const { id, username } = request.body as {
      id: number;
      username: string;
    };

    const result = await updateUser.execute({
      id,
      username,
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

    const result = await deleteUser.execute({
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
