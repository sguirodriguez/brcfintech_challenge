import { Request, Response } from "express";
import express from 'express'

const routes = express.Router();

routes.get("/", async (_request: Request, response: Response) => {
  try {
    return response.status(200).json("Online server!");
  } catch (error) {
    return response.status(500).json({ data: null, error });
  }
});

export default routes;