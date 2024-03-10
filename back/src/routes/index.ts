import { Request, Response } from "express";
import express from "express";
import createUser from "../controllers/user/create";
import { socketIo } from "../app";

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
    socketIo.serverSideEmit("client", () => {
      socketIo.emit("user_token", {
        ...result.response,
      });
    });

    return response.status(result.status).json(result.response);
  } catch (error) {
    return response.status(500).json({ data: null, error });
  }
});

export default routes;
