import { Request, Response } from "express";
import express from "express";
import createUser from "../controllers/user/create";

const routes = express.Router();

routes.get("/", async (_request: Request, response: Response) => {
  try {
    return response.status(200).json("Online server!");
  } catch (error) {
    return response.status(500).json({ data: null, error });
  }
});

routes.post("/login", async (request: Request, response: Response) => {
  try {
    const { username } = request.body as {
      username: string;
    };

    const result = await createUser.execute({ username });

    return response.status(result.status).json(result.response);
  } catch (error) {
    return response.status(500).json({ data: null, error });
  }
});

export default routes;
