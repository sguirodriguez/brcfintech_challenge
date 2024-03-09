const { Router } = require("express");
import { Request, Response } from "express";
import createUser from "../controllers/user/createUser";
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

export default router;
