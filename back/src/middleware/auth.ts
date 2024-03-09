import { Request, Response, NextFunction } from "express";
import jwt from "../services/partners/jwt";

const middlewareAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const authToken = request.headers.authorization;

    if (!authToken) {
      return response
        .status(401)
        .json({ error: "Erro ao autenticar, faça login novamente." });
    }

    const token = authToken.split(" ");
    const isValidToken = jwt.verifyToken({ token: token[1] });

    if (!isValidToken) {
      return response
        .status(401)
        .json({ error: "Erro ao autenticar, faça login novamente." });
    }

    next();
  } catch (error) {
    return response.status(500).json({ error: "Erro de autenticação" });
  }
};

export default middlewareAuth;
