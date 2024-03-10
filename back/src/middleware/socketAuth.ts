import { Socket } from "socket.io";
import jwt from "../services/partners/jwt";

const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const authToken = socket.handshake.headers["authorization"];

    if (!authToken) {
      return next(new Error("Erro ao autenticar, faça login novamente."));
    }

    const token = authToken.split(" ");
    const isValidToken = jwt.verifyToken({ token: token[1] });

    if (!isValidToken) {
      return next(new Error("Erro ao autenticar, faça login novamente."));
    }

    socket.emit("user_token", authToken);

    next();
  } catch (error) {
    return next(new Error("Erro de autenticação"));
  }
};

export default socketAuthMiddleware;
